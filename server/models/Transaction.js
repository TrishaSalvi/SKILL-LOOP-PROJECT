import mongoose,{Schema} from "mongoose";

const transactionSchema= new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        booking: {
            type: Schema.Types.ObjectId,
            ref: "Booking"
        },
        amount: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            enum: ["WELCOME_BONUS", "ESCROW_LOCK", "CREDIT_EARN", "REFUND", "ESCROW_RELEASE"],
            required: true
        },
        description: {
            type: String,
            default:""
        }
    },
    { timestamps: true }
);

const Transaction= mongoose.model("Transaction", transactionSchema);
export default Transaction;