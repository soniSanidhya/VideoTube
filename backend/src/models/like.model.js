import mongoose, { Schema, Types } from "mongoose";

const likeSchema = new Schema({
    comment : {
        type : Schema.Types.ObjectId,
        ref : "Comment"
    },
    tweet : {
        type : Schema.Types.ObjectId,
        ref : "Tweet"
    },
    likedBy : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    video : {
        type : Schema.Types.ObjectId,
        ref : "Video"
    },
    isLiked : {
        type : Boolean,
        default : true
    }
    
},{
    timestamps : true
});

export const Like = mongoose.model("Like" , likeSchema) 