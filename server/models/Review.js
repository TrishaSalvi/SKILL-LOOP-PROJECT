import mongoose, {Schema} from "mongoose";

const reviewSchema= new Schema(
    {
        booking: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            required: true
        },
        skill: {
            type: Schema.Types.ObjectId,
            ref: "Skill",
            required: true
        },
        from: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        to: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        comment: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

reviewSchema.index( {
    booking:1, from:1}, { unique:true }
);

const Review= mongoose.model("Review", reviewSchema);
export default Review;