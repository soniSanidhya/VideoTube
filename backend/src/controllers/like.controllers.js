import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    let { isLiked } = req.body;
    //TODO: toggle like on video

    console.log("entered toggle like" , isLiked);
    
    if (!videoId) {
        throw new ApiError(400, "Video id is missing");
    }
    // isLiked = isLiked === "true" ? true : false;

    console.log("isLiked: ", isLiked);
    
    const likePrev = await Like.find({ video: videoId, likedBy: req.user._id });

    let flag = false;
    let like = {};
    if (likePrev?.length > 0 && !(likePrev[0].isLiked ^ isLiked)) {
        flag = true;

        await Like.findByIdAndDelete(likePrev[0]._id);
    } else if (likePrev?.length > 0 && likePrev[0].isLiked ^ isLiked) {
        flag = false;

        like = await Like.findByIdAndUpdate(
            likePrev[0]._id,
            {
                isLiked,
            },
            {
                new: true,
            }
        );
    } else {
        flag = false;

        like = await Like.create({
            video: videoId,
            likedBy: req.user._id,
            isLiked,
        });
    }

    if (!like) {
        throw new ApiError(
            500,
            flag
                ? "Something went wrong while disliking  video"
                : "Something went wrong while liking  video"
        );
    }

    res.status(200).json(
        new ApiResponse(
            200,
            like,
            flag
                ? "Video deleted successfully"
                : "Video liked / disliked successfully"
        )
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    //TODO: toggle like on comment

    if (!commentId) {
        throw new ApiError(400, "Comment id is missing");
    }

    const likePrev = await Like.find({
        comment: commentId,
        likedBy: req.user._id,
    });
    let flag = false;
    let like;
    if (likePrev.length > 0) {
        flag = true;
        like = await Like.findByIdAndDelete(likePrev[0]._id);
        console.log("Like deleted");
    } else {
        console.log("Like created");
        flag = false;
        like = await Like.create({
            comment: commentId,
            likedBy: req.user._id,
        });
    }

    if (!like) {
        throw new ApiError(
            500,
            flag
                ? "Something went wrong while disliking comment"
                : "Something went wrong while liking  comment"
        );
    }

    res.status(200).json(
        new ApiResponse(
            200,
            like,
            flag
                ? "Comment disliked successfully"
                : "Comment liked successfully"
        )
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    //TODO: toggle like on tweet
    if (!tweetId) {
        throw new ApiError(400, "Tweet id is missing");
    }

    const likePrev = await Like.find({ tweet: tweetId, likedBy: req.user._id });
    let flag = false;
    let like;
    if (likePrev.length > 0) {
        flag = true;
        like = await Like.findByIdAndDelete(likePrev[0]._id);
    } else {
        flag = false;
        like = await Like.create({
            tweet: tweetId,
            likedBy: req.user._id,
        });
    }

    if (!like) {
        throw new ApiError(
            500,
            flag
                ? "Something went wrong while disliking tweet"
                : "Something went wrong while liking  tweet"
        );
    }

    res.status(200).json(
        new ApiResponse(
            200,
            like,
            flag ? "Tweet disliked successfully" : "Tweet liked successfully"
        )
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const videos = await Like.find(
        { likedBy: req.user._id, video: { $ne: null } },
        { video: 1 }
    ).populate({
        path: "video",
        populate: {
            path: "owner",
            select: "username fullName avatar",
        },
    });

    if (!videos) {
        throw new ApiError(404, "No videos found");
    }
    res.status(200).json(
        new ApiResponse(200, videos, "Liked videos fetched successfully")
    );
});

const getLikeCount = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Id is missing");
    }
    const likeCount = await Like.aggregate([
        {
            $match: {
                $or: [
                    { video: new mongoose.Types.ObjectId(id) },
                    { comment: new mongoose.Types.ObjectId(id) },
                    { tweet: new mongoose.Types.ObjectId(id) },
                ],
                isLiked: true,
            },
        },
        {
            $count: "likeCount",
        },
        {
            $project: {
                likeCount: 1,
            },
        },
    ]);
    console.log(likeCount);

    res.status(200).json(
        new ApiResponse(
            200,
            likeCount[0] || { likeCount: 0 },
            "Like count fetched successfully"
        )
    );
});
const getDisLikeCount = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Id is missing");
    }
    const disLikeCount = await Like.aggregate([
        {
            $match: {
                $or: [
                    { video: new mongoose.Types.ObjectId(id) },
                    { comment: new mongoose.Types.ObjectId(id) },
                    { tweet: new mongoose.Types.ObjectId(id) },
                ],
                isLiked: false,
            },
        },
        {
            $count: "disLikeCount",
        },
        {
            $project: {
                disLikeCount: 1,
            },
        },
    ]);
    console.log(disLikeCount);

    res.status(200).json(
        new ApiResponse(
            200,
            disLikeCount[0] || { disLikeCount: 0 },
            "DisLikeLike count fetched successfully"
        )
    );
});
export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getLikeCount,
    getDisLikeCount,
};
