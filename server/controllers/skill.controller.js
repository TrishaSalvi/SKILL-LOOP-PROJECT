import Skill from "../models/Skills.js";
import Slot from "../models/Slot.js";

export const getSkills= async (req,res,next) => {
   try {
     const { search= "", category= "" } = req.query;
     const query = {};

     if(search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" }},
            { tags: { $regex: search, $options: "i" } }
        ];
     }

     if(category) {
        query.category= { $regex: category, $options: "i" };
     }

     const skills= await Skill.find(query)
       .populate("teacher","name department year ratingAvg totalReviews")
       .sort( { createdAt: -1 });

     req.json(skills);
   }
   catch(error) {
    next(error);
   }
};

export const getSkillById= async (req,res,next) => {
    try {
        const skill= await Skill.findById(req.params.id).populate(
            "teacher",
            "name email department year bio ratingAvg totalReviews"
        );

        if(!skill) {
            res.status(404);
            throw new Error("Skill not found!");
        }
        res.json(skill);
    }
    catch(error) {
        next(error);
    }
};

export const getMySkills= async (req,res,next) => {
    try {
        const skills= (await Skill.find( { teacher: req.user._id })).toSorted( { createdAt: -1});
        res.json(skills);
    }
    catch(error) {
        next(error);
    }
};

export const createSkill= async (req,res,next) => {
    try {
        const {title, description, category, tags, level, creditCost, proofLink } = req.body;

        if( !title || !description || !category) {
            res.status(400);
            throw new Error("Title, description and category are required Fields.");
        }

        const normalizedTags= Array.isArray(tags)
        ? tags
        : String( tags || "")
            .split(",")
            .map( (tag) => tag.trim() )
            .filter(Boolean);

        const skill= await Skill.create({
            title,
            description,
            category,
            tags: normalizedTags,
            level,
            creditCost,
            proofLink,
            teacher: req.user._id
        });

        res.status(201).json(skill);
    }
    catch(error) {
        next(error);
    }
};

export const updateSkill= async (req,res,next) => {
    try {
        const skill= await Skill.findById(req.params.id);

        if( !skill) {
            res.status(404);
            throw new Error("Skill not found");
        }

        if(String(skill.teacher) !== String(req.user._id)) {
            res.status(403);
            throw new Error("only the owner can edit this skill");
        }

        const fields= ["title", "description", "category", "level", "creditCost", "proofLink"];
        fields.forEach( (field) => {
            if( req.body[field] !== undefined) skill[field] = req.body[field];
        });

        if( req.body.tags !== undefined ) {
            skill.tags= Array.isArray(req.body.tags)
            ? req.body.tags
            : String(req.body.tags)
                .split(",")
                .map( (tag) => tag.trim() )
                .filter(Boolean);
        }

        const updated= await skill.save();
        res.json(updated);
    }
    catch(error) {
        next(error);
    }
};

export const deleteSkill= async (req,res,next) => {
    try {
        const skill= await Skill.findById(req.params.id);

        if( !skill) {
            res.status(404);
            throw new Error("Skill not found");
        }

        if( String(skill.teacher) !== String(req.user._id)) {
            res.status(403);
            throw new Error("Only the owner can delete this skill");
        }

        await Slot.deleteMany( {skill: skill._id, status: "available"});
        await skill.deleteOne();

        res.json( {message:"Skill deleted. Available slots for this skill were removed."});
    }
    catch(error) {
        next(error);
    }
};