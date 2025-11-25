import mongoose, { Types } from "mongoose";

const LikeSchema = mongoose.Schema({
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    },

    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    },
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    tweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet"
    }
},{
    timestamps:true
})

export default Like = mongoose.model("Like",LikeSchema)