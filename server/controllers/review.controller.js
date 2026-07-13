import Booking from "../models/Booking.js";
import Review from "../models/Review.js";
import Skill from "../models/Skills.js";
import User from "../models/User.js";
import Notification from "../models/Notifications.js";

const recomputeUserRating= async (userId) => {
    const reviews= await Review.find( {to: userId} );
    const totalReviews= reviews.length;
    const ratingAvg= totalReviews
    ? reviews.reduce( (sum,review) => sum+ review.rating, 0)/totalReviews
    : 0;

    await User.findByIdAndUpdate( userId, {
        totalReviews,
        ratingAvg: Number(ratingAvg.toFixed(1))
    });
};

const recomputeSkillRating= async (skillId) => {
    const reviews= await Review.find( {skill: skillId});
    const totalReviews= reviews.length;
    const ratingAvg= totalReviews
    ? reviews.reduce( (sum, review) => sum + review.rating, 0) / totalReviews
    : 0;

    await Skill.findByIdAndUpdate(skillId, {
        totalReviews,
        ratingAvg: Number(ratingAvg.toFixed(1) )
    });
};

export const createReview= async (req,res,next) => {
    try {
        const {bookingId, rating, comment} = req.body;
        const booking= await Booking.findById(bookingId);

        if( !booking) {
            res.status(404);
            throw new Error("Booking not found");
        }

        if( booking.status !== "completed") {
            res.status(400);
            throw new Error("only completed sessions can be reviewed!");
        }

        const isLearner= String(booking.learner) === String(req.user._id);
        const isTeacher= String(booking.teacher) === String(req.user._id);

        if( !isLearner && !isTeacher) {
            res.status(403);
            throw new Error("You cannot review this booking");
        }

        const to= isLearner ? booking.teacher : booking.learner;

        const review= await Review.create({
            booking: booking._id,
            skill: booking.skill,
            from: req.user._id,
            to,
            rating,
            comment
        });

        await recomputeUserRating(to);
        await recomputeSkillRating(booking.skill);

        const notification= await Notification.create({
            user: to,
            message: `${req.user.name} reviewed from SkillLoop session` ,
            type: "review"
        });

        const io= req.app.get("io");
        io.to(`user:${to}`).emit("notification", notification);

        res.status(201).json(review);
    }
    catch(error) {
        if( error.code === 11000 ) {
            res.status(400);
            return next( new Error("You already reviewed this booking"));
        }
        next(error);
    }
};

export const getReviewsForUser= async (req,res,next) => {
    try{
        const reviews = await Review.find( { to: req.params.userId})
          .populate("from", "name")
          .populate("skill", "title")
          .sort( { createdAt: -1});

        res.json(reviews);
    }
    catch(error) {
        next(error);
    }
};

export const getReviewsForSkill= async (req,res,next) => {
    try {
        const reviews= await Review.find( { skill: req.params.skillId})
          .populate("from", "name")
          .populate("to","name")
          .sort( { createdAt: -1});

        res.json(reviews);
    }
    catch(error) {
        next(error);
    }
};