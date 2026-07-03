import mongoose,{Schema} from "mongoose";

const slotSchema= new Schema(
    {
        skill: {
            type: Schema.Types.ObjectId,
            ref: "Skill",
            required: true
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            required: true
        },
        mode: {
            type: String,
            enum: ["online", "offline"],
            default: "online"
        },
        meetingLink: {
            type: String,
            default: ""
        },
        location: {
            type: String,
            default: ""
        },
        status: {
            type: String,
            enum: ["available","booked","completed","cancelled"],
            default: "available"
        }
    },
    { timestamps: true }
);

slotSchema.index(
 { teacher:1, startTime:1, endTime: 1}, { unique: true}
);

slotSchema.index(
{ skill:1, status:1, startTime:1}
);

const Slot= mongoose.model("Slot", slotSchema);
export default Slot;