import mongoose, {Schema} from "mongoose";

const notificationSchema= new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        message: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["booking", "wallet", "review", "system"],
            default: "system",
        },
        read: {
            type: Boolean,
            default: false
        }
    },
    { timestamps:true }
);

const Notification= mongoose.model("Notification", notificationSchema);
export default Notification;