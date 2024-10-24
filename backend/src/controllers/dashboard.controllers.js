import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscriptions.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const { channelId } = req.params;
    // console.log("dashBoard");
    
    if (!channelId) {
        throw new ApiError(400, "Channel id is missing");
    }

    const totalVideos = await Video.find({ owner: channelId }).countDocuments();

    const totalViews = await Video.aggregate([
        {
            $match: { owner: new mongoose.Types.ObjectId(channelId) },
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" },
            },
        },
    ]);

    const totalSubscribers = await Subscription.find({
        channel: channelId,
    }).countDocuments();

    const totalLikes = await Like.aggregate([
        {
            $match: {
                $or: [
                    { tweet: new mongoose.Types.ObjectId(channelId) },

                    { video: new mongoose.Types.ObjectId(channelId) },
                ],
            },
        },
        {
            $group: {
                _id: null,
                totalLikes: { $sum: 1 },
            },
        },
        {
            $project: {
                totalLikes: 1,
            },
        },
    ]);

    res.status(200).json(
        new ApiResponse(
            200,
            {
                totalVideos,
                totalViews: totalViews[0]?.totalViews || 0,
                totalSubscribers,
                totalLikes: totalLikes[0]?.totalLikes || 0,
            },
            "Channel stats found successfully"
        )
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(400, "Channel id is missing");
    }

    const channel = await User.findById(channelId);

    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    // const videos = await Video.find({ owner: channelId }).populate("owner" , "username fullName avatar");

    const videos = await Video.aggregate([
        {
            $match: { owner: new mongoose.Types.ObjectId(channelId) },
        },
        {
            $lookup : {
                from : "likes",
                let: { videoId: '$_id' },
                pipeline : [{
                    $match : {
                        $expr : {
                           $and : [
                            { $eq : ["$video" , "$$videoId"]},
                            { $eq : ["$isLiked" , true]}

                           ]
                        }
                    }
                }],

                as : "likes"
            }
        },
        {
            $lookup : {
                from : "likes",
                let: { videoId: '$_id' },
                pipeline : [{
                    $match : {
                        $expr : {
                           $and : [
                            { $eq : ["$video" , "$$videoId"]},
                            { $eq : ["$isLiked" , false]}

                           ]
                        }
                    }
                }],

                as : "disLikes"
            }
        },
        {
            $addFields : {
                likes : { $size : "$likes" },
                disLikes : { $size : "$disLikes" }
            }
        }
        // {
        //     $lookup : {
        //         from : "likes",
        //         let: { videoId: '$_id' },
        //         pipeline : [{
        //             $match : {
        //                 $expr : {
        //                     $and : [
        //                         { 
        //                             $eq : ["$video" , "$videoId"] ,
        //                             $eq : ["$isLiked" , false]
        //                         }
        //                     ]
        //                 }
        //             }
        //         }],

        //         as : "dislikes"
        //     }
        // },
        // {
        //     $addFields : {
        //         likes : { $size : "$likes" },
        //         dislikes : { $size : "$dislikes" }
        //     }
        // },
        
        
    ])

    if (videos?.length < 0) {
        throw new ApiError(404, "No videos found for this channel");
    }

    res.status(200).json(
        new ApiResponse(200, videos, "Videos found successfully")
    );
});

export { getChannelStats, getChannelVideos };
