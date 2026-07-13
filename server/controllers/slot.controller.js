import Skill from "../models/Skills.js";
import Slot from "../models/Slot.js";

export const createSlot= async(req,res,next) => {
    try {
        const { skillId, startTime, endTime, mode, meetingLink, location } = req.body;

        const skill= await Skill.findById(skillId);
        if( !skill) {
            req.status(404);
            throw new Error("Skill not found!");
        }

        if( String(skill.teacher) !== String(req.user._id)) {
            res.status(403);
            throw new Error("Only the skill owner can create slots!");
        }

        const start= new Date(startTime);
        const end= new Date(endTime);

        if( Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end<=start ) {
             res.status(400);
             throw new Error("Please provide a valid start and end time!");
        }

        const slot= await Slot.create({
            skill: skill._id,
            teacher: req.user._id,
            startTime: start,
            endTime: end,
            mode,
            meetingLink,
            location
        });

        const io= req.app.get("io");
        io.to(`skill: ${skill._id}`).emit("slot-created", slot);

        res.status(201).json(slot);
    }
    catch(error) {
        if( error.code === 11000) {
            res.status(400);
            return next(new Error("You already have a slot at this time"));
        }
        next(error);
    }
};

export const getSlotsBySkill= async (req,res,next) => {
    try {
        const slots= await Slot.find( { skill: req.params.skillId })
          .sort( { startTime: 1 })
          .populate("teacher", "name email");

        res.json(slots);
    }
    catch(error) {
        next(error);
    }
};

export const getMySlots= async (req,res,next) => {
    try {
        const slots= await Slot.find( { teacher: req.user._id })
          .populate("skill", "title category creditCost")
          .sort( { startTime: 1});

        res.json(slots);
    }
    catch(error) {
        next(error);
    }
};

export const deleteSlot= async (req,res,next) => {
    try{
        const slot= await slot.findById(req.params.id);

        if( !slot) {
            res.status(404);
            throw new Error("Slot not found");
        }

        if( String(slot.teacher) !== String(req.user._id)) {
            res.status(403);
            throw new Error("Only the slot owner can delete this slot");
        }

        if( slot.status !== "available") {
            res.status(400);
            throw new Error("Only available slots can be deleted");
        }
        
        await slot.deleteOne();

        const io= req.app.get("io");
        io.to(`skill: ${slot.skill}`).emit("slot-detected", { slotId: slot._id });

        res.json( { message: "Slot detected"});
    }
    catch(error) {
        next(error);
    }
};