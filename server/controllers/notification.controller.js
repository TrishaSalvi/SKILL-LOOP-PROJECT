import Notification from "../models/Notifications.js";

export const getNotifications= async (req,res,next) => {
    try {
      const notifications= await Notifications.find( {user: req.user._id}).sort({createdAt:-1});
      res.json(notifications);
    }
    catch(error) {
        next(error);
    }
};

export const markNotificationRead= async (req,res,next) => {
    try {
        const notification= await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id},
            { read: true },
            { new: true }
        );
        if( !notification ) {
            res.status(404);
            throw new Error("notifications not found");
        }
        res.json(notification);
    }
    catch(error) {
        next(error);
    }
};