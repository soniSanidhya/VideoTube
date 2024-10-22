import { channel, subscribe } from "diagnostics_channel";
import { Subscription } from "../models/subscriptions.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    // TODO: toggle subscription
    if (!channelId) {
        throw new ApiError(400, "Channel id is missing ");
    }
    console.log("entered toggleSubscription", channelId);

    const isSubscribed = await Subscription.find({
        subscriber: req.user._id,
        channel: channelId,
    });

    let flag = false;
    let subscription;
    if (isSubscribed.length > 0) {
        flag = true;
        subscription = await Subscription.findByIdAndDelete(
            isSubscribed[0]._id
        );
    } else {
        flag = false;
        subscription = await Subscription.create({
            subscriber: req.user._id,
            channel: channelId,
        });
    }

    if (!subscription) {
        throw new ApiError(
            500,
            flag
                ? "Something went wrong while unsubscribing channel"
                : "Something went wrong while subscribing channel"
        );
    }

    res.status(200).json(
        new ApiResponse(
            200,
            subscription,
            flag
                ? "Channel unsubscribed successfully"
                : "Channel subscribed successfully"
        )
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelName } = req.params;

    if (!channelName) {
        throw new ApiError(400, "Channel name is missing");
    }

    const channel = await User.findOne({ username: channelName });
    const channelId = channel._id;
    // const subscribers = await Subscription.find({
    //     channel: channelId,
    // } , {subscribe : 1}).populate("subscriber", "username fullName avatar");
    console.log("user", req.user);

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: channelId,
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "userSubscriber",
                        },
                    },
                    {
                        $addFields: {
                            subCriberCount: {
                                $size: "$userSubscriber",
                            },
                            isSubscribed: {
                                $cond: {
                                    if: {
                                        $in: [
                                            req.user._id,
                                            "$userSubscriber.subscriber",
                                        ],
                                    },
                                    then: true,
                                    else: false,
                                },
                            },
                        },
                    },
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            fullName: 1,
                            isSubscribed: 1,
                            subCriberCount: 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: "$subscriber",
        },

        {
            $project: {
                _id: "$subscriber._id",
                username: "$subscriber.username",
                fullName: "$subscriber.fullName",
                avatar: "$subscriber.avatar",
                isSubscribed: "$subscriber.isSubscribed",
                subcriberCount: "$subscriber.subCriberCount",
            },
        },
    ]);

    if (!subscribers) {
        throw new ApiError(404, "subscribers not found");
    }

    res.status(200).json(
        new ApiResponse(200, subscribers, "subscribers fetched successfully")
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!subscriberId) {
        throw new ApiError(400, "Subscriber id is missing");
    }

    const channels = await Subscription.aggregate([
        {
            $match : {
                subscriber : req.user._id
            }
        },
      
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channel",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "userSubscriber",
                        },
                    },
                    {
                        $addFields: {
                            subCriberCount: {
                                $size: "$userSubscriber",
                            },
                            isSubscribed: {
                                $cond: {
                                    if: {
                                        $in: [
                                            req.user._id,
                                            "$userSubscriber.subscriber",
                                        ],
                                    },
                                    then: true,
                                    else: false,
                                },
                            },
                        },
                    },
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            fullName: 1,
                            isSubscribed: 1,
                            subCriberCount: 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: "$channel",
        },

        {
            $project: {
                _id: "$channel._id",
                username: "$channel.username",
                fullName: "$channel.fullName",
                avatar: "$channel.avatar",
                isSubscribed: "$channel.isSubscribed",
                subcriberCount: "$channel.subCriberCount",
            },
        },
    ])
    

    if (!channels) {
        throw new ApiError(404, "Channels not found");
    }

    res.status(200).json(
        new ApiResponse(200, channels, "Channels fetched successfully")
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
