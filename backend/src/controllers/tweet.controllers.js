import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body;
    if (!content) {
        throw new ApiError(400, "content is missing");
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id,
    });

    if (!tweet) {
        throw new ApiError(500, "something went wrong while creating tweet");
    }

    res.status(201).json(
        new ApiResponse(201, tweet, "tweet created successfully")
    );
});

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { username } = req.params;

    if (!username) {
        throw new ApiError(400, "username is missing");
    }

    const user = await User.findOne({username});

    if (!user) {
        throw new ApiError(404, "user not found");
    }

    const tweets = await Tweet.find({
        owner: user._id,
    }).populate("owner", "username fullName avatar");

    if (!tweets) {
        throw new ApiError(404, "tweet not found");
    }

    res.status(200).json(
        new ApiResponse(200, tweets, "tweets fetched successfully")
    );
});

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!tweetId || !isValidObjectId(tweetId)) {
        throw new ApiError(400, "invalid tweet id");
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "tweet not found");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content,
            },
        },
        {
            new: true,
        }
    );

    if (!updatedTweet) {
        throw new ApiError(500, "something went wrong while updating tweet");
    }

    res.status(200).json(
        new ApiResponse(200, updatedTweet, "tweet updated successfully")
    );
});

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const { tweetId } = req.params;

    if (!tweetId) {
        throw new ApiError(400, "tweet id is missing");
    }

    const tweet = await Tweet.findByIdAndDelete(tweetId);

    if (!tweet) {
        throw new ApiError(404, "tweet not found");
    }

    res.status(200).json(
        new ApiResponse(200, tweet, "tweet deleted successfully")
    );

});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
