import mongoose, {models, Schema} from "mongoose";

const skillSchema= new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        tags: [{
            type: String,
            trim: true
        }
       ],
        level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Beginner"
        },
        creditCost: {
            type: Number,
            required: true,
            min: 1,
            default: 10
        },
        proofLink: {
            type: String,
            default: ""
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        ratingAvg: {
            type: Number,
            default: 0
        },
        totalReviews: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

skillSchema.index(
  { title: "text",
    description: "text",
    category: "text",
    tags: "text"
  }
);

const Skill=mongoose.model("Skill",skillSchema);
export default Skill;