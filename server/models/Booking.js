import mongoose,{Schema} from "mongoose";

const bookingSchema= new Schema(
    {
        learner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        skill: {
            type: Schema.Types.ObjectId,
            ref: "Skill",
            required: true
        },
        slot: {
            type: Schema.Types.ObjectId,
            ref: "Slot",
            required: true
        },
        credits: {
            type: Number,
            required: true,
            min: 10
        },
        status: {
            type: String,
            enum: ["booked", "completed", "cancelled"],
            default: "booked"
        },
        paymentStatus: {
            type: String,
            enum: ["escrowed", "released", "refunded"],
            default: "escrowed"
        },
        isActive: {
            type: Boolean,
            default: true
        },
        completedAt: Date,
        cancelledAt: Date
    },
    {
        timestamps: true
    }
);

//only 1 active booking can exist for a slot.
//If a booking is cancelled, isActive becomes False and the slot can be re-opened.
bookingSchema.index(
    { slot: 1, isActive: 1},
    { unique: true, partialFilterExpression: {isActive: true}}
);

const Booking= mongoose.model("Booking", bookingSchema);
export default Booking;

