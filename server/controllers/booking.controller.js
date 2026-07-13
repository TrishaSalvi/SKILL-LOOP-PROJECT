import Booking from "../models/Booking.js";
import Notification from "../models/Notifications.js";
import Skill from "../models/Skills.js";
import Slot from "../models/Slot.js";
import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";

const emitToUser= (req,userId, event, payload) => {
    const io= req.app.get("io");
    io.to(`user:${userId}`).emit(event, payload);
}

export const createBooking= async (req,res,next) => {
    let walletReserved = false;
    let lockedSlot= null;
    let cost=0;

    try {
        const {slotId} = req.body;
        const learnerId= req.user._id;
    
        const slotSnapshot= await Slot.findById(slotId).populate("skill");

        if( !slotSnapshot) {
            res.status(404);
            throw new Error("Slot not found");
        }

        if( slotSnapshot.status !== "available") {
            res.status(409);
            throw new Error("Slot just got booked. Please pick another time");
        }

        if( String(slotSnapshot.teacher) === String(learnerId)) {
            res.status(400);
            throw new Error("You cannot book your own skill session!");
        }

        cost = slotSnapshot.skill.creditCost;

        //Step 1: Reserve learner credits atomically.
        // This also prevents a learner from booking multiple slots at once using the same credits.
        const wallet= await Wallet.findOneAndUpdate(
            { user: learnerId, balance: { $gte: cost }},
            { $inc: { balance: -cost, escrowBalance: cost }},
            { new: true }
        );

        if( !wallet) {
            res.status(400);
            throw new Error("sadly not enough credits in wallet!");
        }

        walletReserved= true;

        //Step 2: Lock the slot using mongoDB's atomic findOneAndUpdate.
        //Only one request can change this slot from available to booked.
        lockedSlot= await Slot.findOneAndUpdate(
            { _id: slotId, status: "available" },
            { $set: { status: "booked" }},
            { new: true }
        );

        if( !lockedSlot) {
            await Wallet.findOneAndUpdate(
                { user: learnerId },
                { $inc: { balance: cost, escrowBalance: -cost }}
            );
            walletReserved= false;

            res.status(409);
            throw new Error("slot just got booked. Please pick another time.");
        }

        const booking= await Booking.create({
            learner: learnerId,
            teacher: lockedSlot.teacher,
            skill: lockedSlot.skill,
            slot: lockedSlot._id,
            credits: cost,
            status: "booked",
            paymentStatus: "escrowed",
            isActive: true
        });

        await Transaction.create({
            user: learnerId,
            booking: booking._id,
            amount: -cost,
            type: "ESCROW_LOCK",
            description: "Credits locked in escrow for session Booking"
        });

        const skill= await Skill.findById(lockedSlot.skill);
        const notification= await Notification.create({
            user: lockedSlot.teacher,
            message: `${req.user.name} booked your session for ${skill.title}`,
            type: "booking"
        });

        const populatedBooking= await Booking.findById(booking._id)
          .populate("learner", "name email")
          .populate("teacher", "name email")
          .populate("skill", "title category creditCost")
          .populate("slot");

        const io = req.app.get("io");
        io.to(`skill:${lockedSlot.skill}`).emit("slot-booked", { slotId: lockedSlot._id, booking: populatedBooking});
        emitToUser(req, lockedSlot.teacher, "notification", notification);

        res.status(201).json({ booking: populatedBooking, wallet });
    }
    catch(error) {
        //Basic rollback safety if something fails after reserving credits or locking the slot.
        if( walletReserved) {
            await Wallet.findOneAndUpdate(
                { user: req.user._id },
                { $inc: { balance: cost, escrowBalance: -cost }}
            );
        }

        if(lockedSlot) {
            await Slot.findByIdAndUpdate(lockedSlot._id, { $set: {status: "available "}});
        }

        if( error.code === 11000 ) {
            res.status(409);
            return next(new Error("This slot already has an active booking"));
        }
        next(error);
    }
};

export const getMyBookings= async (req,res,next) => {
    try {
        const bookings= await Booking.find({
            $or: [{ learner: req.user._id}, {teacher: req.user._id}]
        })
          .populate("learner", "name email")
          .populate("teacher", "name email")
          .populate("skill", "title category creditCost")
          .populate("slot")
          .sort({ createdAt: -1 });

        res.json(bookings);
    }
    catch(error) {
        next(error);
    }
};

export const completeBooking= async (req,res,next) => {
    try {
        const booking= await Booking.findById(req.params.id);

        if( !booking) {
            res.status(404);
            throw new Error("Booking not found!");
        }

        const isLearner= String(booking.learner) === String(req.user._id);
        const isTeacher= String(booking.teacher) === String(req.user._id);

        if( !isLearner && !isTeacher) {
            res.status(403);
            throw new Error("You are not part of this Booking.");
        }
        if( booking.status !== "booked") {
            res.status(400);
            throw new Error("Only booked sessions can be completed");
        }

        booking.status="completed";
        booking.paymentStatus= "released";
        booking.isActive= false;
        booking.completedAt= new Date();
        await booking.save();

        await Slot.findByIdAndUpdate(booking.slot, { $set: { status: "completed"}});

        await Wallet.findOneAndUpdate(
            { user: booking.learner },
            { $inc: { escrowBalance: -booking.credits }}
        );

        await Wallet.findOneAndUpdate(
            { user: booking.teacher },
            { $setOnInsert: { user: booking.teacher }, $inc: { balance: booking.credits }},
            { upsert:true, new: true}
        );

        await Transaction.create([
            {
                user: booking.learner,
                booking: booking._id,
                amount: 0,
                type: "ESCROW_RELEASE",
                description: "Escrow released after session completion."
            },
            {
                user: booking.teacher,
                booking: booking._id,
                amount: booking.credits,
                type: "CREDITS_EARN",
                description:"Credits earned by teaching a completed SkillLoop session"
            }
        ]);

        await Notification.create({
            user: booking.teacher,
            message: `Session completed. ${booking.credits} credits were added to your wallet.`,
            type: "wallet"
        });

        const populatedBooking= await Booking.findById(booking._id)
          .populate("learner", "name email")
          .populate("teacher", "name email")
          .populate("skill", "title category creditCost")
          .populate("slot");

        const io= req.app.get("io");
        io.to(`skill:${booking.skill}`).emit("booking-completed", populatedBooking);
        emitToUser(req, booking.teacher, "wallet-updated", { message: "Credits released" })

        res.json(populatedBooking);
        }
        catch(error) {
            next(error);
        }
};

export const cancelBooking= async (req,res,next) => {
    try {
        const booking= await Booking.findById(req.params.id);

        if( !booking) {
            res.status(404);
            throw new Error("Booking not found");
        }

        const isLearner= String(booking.learner) === String(req.user._id);
        const isTeacher= String(booking.teacher) === String(req.user._id);

        if( !isLearner && !isTeacher) {
            res.status(403);
            throw new Error("You are not part of this Booking");
        }

        if( booking.status !== "booked") {
            res.status(400);
            throw new Error("Only booked sessions can be cancelled!");
        }

        booking.status= "cancelled";
        booking.paymentStatus= "refunded";
        booking.isActive= false;
        booking.cancelledAt= new Date();
        await booking.save();

        await Slot.findByIdAndUpdate(booking.slot, { $set: { status: "available "}});

        await Wallet.findOneAndUpdate(
            { user: booking.learner },
            { $inc: { balance: booking.credits, escrowBalance: -booking.credits }}
        );

        await Transaction.create({
            user: booking.learner,
            booking: booking._id,
            amount: booking.credits,
            type: "REFUND",
            description: "Credits successfully refunded after session completed!"
        });

        const io= req.app.get("io");
        io.to(`skill:${booking.skill}`).emit("slot-available", { slotId: booking.slot });

        const populatedBooking = await Booking.findById(booking._id)
          .populate("learner", "name email")
          .populate("teacher", "name email")
          .populate("skill", "title category creditCost")
          .populate("slot");

        res.json(populatedBooking);
    }
    catch(error) {
        next(error);
    }
};



