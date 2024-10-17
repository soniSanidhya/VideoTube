import { subscribe } from "diagnostics_channel";
import { Subscription } from "../models/subscriptions.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    // TODO: toggle subscription
    if (!channelId) {
        throw new ApiError(400, "Channel id is missing ");
    }

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
    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(400, "Channel id is missing");
    }

    const subscribers = await Subscription.find({
        channel: channelId,
    } , {subscribe : 1}).populate("subscriber", "username fullName avatar");

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

    if(!subscriberId) {
        throw new ApiError(400, "Subscriber id is missing");
    }

    const channels = await Subscription.find({
        subscriber : subscriberId
    } , {channel : 1}).populate("channel", "username fullName avatar");
    
    if(!channels) {
        throw new ApiError(404, "Channels not found");
    }

    res.status(200).json(
        new ApiResponse(200, channels, "Channels fetched successfully")
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
