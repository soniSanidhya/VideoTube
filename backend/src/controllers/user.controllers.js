import fs, { watch } from "fs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import {
    deleteFromCloudinary,
    uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { subscribe } from "diagnostics_channel";

const generateRefreshTokenAndAcessToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();
        user.refreshToken = refreshToken;

        user.save({ validateBeforeSave: false });

        return { refreshToken, accessToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access token and refresh token "
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    // console.log(req.body);
    const { fullName, username, password, email } = req.body;
    if (
        [fullName, username, email, password].some((el) => el?.trim() === "") ||
        [fullName, username, email, password].some(
            (el) => el?.trim() === undefined
        )
    ) {
        throw new ApiError(400, "All feilds are required");
    }
    // console.log("received");

    const userExist = await User.findOne({
        $or: [{ username }, { email }],
    });
    // console.log(userExist);

    // console.log("user doesnot exist");
    console.log(req?.files);
    
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    ) {
        coverImageLocalPath = req.files?.coverImage[0]?.path;
    }

    // console.log(avatarLocalPath);
    // console.log(coverImageLocalPath);
    // console.log(req.files);

    if (!avatarLocalPath) {
        throw new ApiError(409, "avatar is Required");
    }

    if (userExist) {
        fs.unlinkSync(avatarLocalPath);
        fs.unlinkSync(coverImageLocalPath);
        throw new ApiError(409, "User already exists");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    // console.log("Images Uploaded to cloudinary");
    // console.log(avatar);
    // console.log(coverImage);

    const user = await User.create({
        fullName,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    });

    // console.log("sent to database");

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while regidtering user");
    }

    return res.json(
        new ApiResponse(200, createdUser, "user Succesfully Registered")
    );
});

const userLogin = asyncHandler(async (req, res) => {
    // const { username, password, email } = req.body;
    const { fullName, username, password, email } = req.body;

    // console.log(req.body);

    if (!(username || email)) {
        throw new ApiError(400, "Email or username is required");
    }

    const user = await User.findOne({
        $or: [{ username: username || email }, { email: email || username }],
    });

    if (!user) {
        throw new ApiError(404, "user does not exist");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Password is incorrect");
    }

    const { refreshToken, accessToken } =
        await generateRefreshTokenAndAcessToken(user._id);

    const LoggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None'      
    };

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: LoggedInUser,
                    refreshToken,
                    accessToken,
                },
                "Succesfully Logged in"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    // console.log("user", req.user);

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None'      
    };

    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "user logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorised request");
    }

    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
        throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "RefreshToken is expired or already used");
    }

    const { accessToken, newRefreshToken } = generateRefreshTokenAndAcessToken(
        user._id
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    res.status(200)
        .cookie("refreshToken", newRefreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken: newRefreshToken,
                },
                "Acess Token Refreshed"
            )
        );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "all feilds are required");
    }
    // // console.log(oldPassword);
    // // console.log(newPassword);

    const user = await User.findById(req.user?._id);
    // // console.log(user);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Password is incorrect");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "password changed"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req?.user, "user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    // console.log("body", req.body);
    // console.log(req.body.fullName);

    // const { fullName, email } = req.body;
    const fullName = req.body.fullName;
    const email = req.body.email;

    if (!(fullName && email)) {
        throw new ApiError("All feilds are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email,
            },
        },
        {
            new: true,
        }
    ).select("-password");
    // console.log(req.body.email);

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Details updated Successfully"));
});

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalFilePath = req.file?.path;
    // console.log(req.file);
    // console.log(req.user);

    if (!avatarLocalFilePath) {
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalFilePath);
    // console.log(avatar.url);

    if (!avatar.url) {
        throw new ApiError(400, "failed while Uploading on cloudinary");
    }
    const oldAvatar = req.user.avatar;
    // console.log("old", oldAvatar);

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: avatar.url,
            },
        },
        {
            new: true,
        }
    ).select("-password -refreshToken");

    // console.log(user.avatar);
    deleteFromCloudinary(oldAvatar);

    return res.status(200).json(new ApiResponse(200, user, "Avatar changed"));
});
const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover Image is required");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!coverImage.url) {
        throw new ApiError(400, "failed while Uploading on cloudinary");
    }
    const oldCoverImage = req.user.coverImage || null;
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                coverImage: coverImage.url,
            },
        },
        {
            new: true,
        }
    ).select("-password -refreshToken");

    deleteFromCloudinary(oldCoverImage);

    return res
        .status(200)
        .json(new ApiResponse(200, user, "coverImage changed"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username) {
        throw new ApiError(400, "Username Missing!!");
    }
    // console.log(username);

    const userId = req.user?._id;

    const channel = await User.aggregate([
        {
            $match: {
                username: username.trim(),
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo",
            },
        },

        {
            $addFields: {
                channelSubscriberCount: {
                    $size: "$subscribers",
                },
                channelSubscribedToCount: {
                    $size: "$subscribedTo",
                },
                isSubscribed: {
                    $cond: {
                        if: userId
                            ? { $in: [userId, "$subscriber.subscriber"] }
                            : false,
                        then: true,
                        else: false,
                    },
                },
            },
        },
        {
            $project: {
                username: 1,
                fullName: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                channelSubscriberCount: 1,
                channelSubscribedToCount: 1,
                isSubscribed: 1,
                createdAt: 1,
                subscribers: 1,
                subscribedTo: 1,
            },
        },
    ]);

    // console.log(channel);

    if (!channel) {
        throw new ApiError(404, "channel does not exist");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            channel[0],
            "User Channel Profile fetched successfully"
        )
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
    // const user = await User.aggregate([
    // {
    //     $match: {
    //         _id: new mongoose.Types.ObjectId(req.user._id),
    //     },
    // },
    // {
    //     $lookup: {
    //         from: "videos",
    //         localField: "wathchHistory",
    //         foreignField: "_id",
    //         as: "watchHistory",
    //         pipeline: [
    //             {
    //                 $lookup: {
    //                     from: "users",
    //                     localField: "owner",
    //                     foreignField: "_id",
    //                     as: "owner",
    //                     pipeline: [
    //                         {
    //                             $project: {
    //                                 fullName: 1,
    //                                 avatar: 1,
    //                                 username: 1,
    //                             },
    //                         },
    //                         {
    //                             $addFields: {
    //                                 owner: {
    //                                     $first: "$owner",
    //                                 },
    //                             },
    //                         },
    //                     ],
    //                 },
    //             },
    //         ],
    //     },
    // },
    // ]);

    // // console.log(req.user._id);

    // const user = await User.findById(req.user._id).populate({
    //     path: "watchHistory",
    //     populate: {
    //         path: "owner",
    //         select: "username fullName avatar",
    //     }
    // });
    // // console.log(user);

    // const userObject = user.toObject();

    // const userHistory = await User.aggregate([
    //     {
    //         $replaceRoot: { newRoot: userObject }
    //     },
    //     // {
    //     //     $project: {
    //     //         watchHistory: 1,
    //     //         _id : 0
    //     //     }
    //     // },
    //     // {
    //     //     $unwind: "$watchHistory"
    //     // },
    //     // {
    //     //     $project: {
    //     //         _id: "$watchHistory._id",
    //     //         videoFile: "$watchHistory.videoFile",
    //     //         thumbnail: "$watchHistory.thumbnail",
    //     //         title: "$watchHistory.title",
    //     //         description: "$watchHistory.description",
    //     //         duration: "$watchHistory.duration",
    //     //         views: "$watchHistory.views",
    //     //         isPublished: "$watchHistory.isPublished",
    //     //         owner: "$watchHistory.owner",
    //     //         createdAt: "$watchHistory.createdAt",
    //     //         updatedAt: "$watchHistory.updatedAt",
    //     //         __v: "$watchHistory.__v",
    //     //     },
    //     // },
    // ])

    // const user = await User.aggregate([
    //     {
    //         $match: {
    //             _id: new mongoose.Types.ObjectId(req.user._id),
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "videos",
    //             localField: "watchHistory",
    //             foreignField: "_id",
    //             as: "watchHistory",
    //             pipeline: [
    //                 {
    //                     $lookup: {
    //                         from: "users",
    //                         localField: "owner",
    //                         foreignField: "_id",
    //                         as: "owner",
    //                         pipeline: [
    //                             {
    //                                 $project: {
    //                                     avatar: 1,
    //                                     username: 1,
    //                                 },
    //                             },
    //                         ],
    //                     },
    //                 },
    //                 {
    //                     $addFields: {
    //                         owner: {
    //                             $first: "$owner",
    //                         },
    //                     },
    //                 },
    //             ],
    //         },
    //     },
    //     // {
    //     //     $addFields: {
    //     //         watchHistory: {
    //     //             $first: "$watchHistory",
    //     //         },
    //     //     },
    //     // },
    //     {
    //         $project: {
    //             watchHistory: 1,
    //             _id: 0,
    //         }
    //     },
    //     {
    //         $unwind: "$watchHistory",
    //     },

    // ])

    const userHistory = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner",
                            },
                        },
                    },
                ],
            },
        },
        {
            $project: {
                watchHistory: 1,
                _id: 0,
            },
        },
        {
            $unwind: "$watchHistory",
        },
        {
            $project: {
                _id: "$watchHistory._id",
                videoFile: "$watchHistory.videoFile",
                thumbnail: "$watchHistory.thumbnail",
                title: "$watchHistory.title",
                description: "$watchHistory.description",
                duration: "$watchHistory.duration",
                views: "$watchHistory.views",
                isPublished: "$watchHistory.isPublished",
                owner: "$watchHistory.owner",
                createdAt: "$watchHistory.createdAt",
                updatedAt: "$watchHistory.updatedAt",
                __v: "$watchHistory.__v",
            },
        },
       
        
    ]);

    res.status(200).json(
        new ApiResponse(200, userHistory, "Watch History Fetched")
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
    // const likedVideos = await Like.find({
    //     video: { $ne: null },
    //     likedBy: req?.user?._id,
    // })
    //     .populate("video")
    //     .populate("owner", "username avatar fullName");

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user._id),
                video: { $ne: null },
                isLiked: true,
            },
        },
        {
            $project: {
                video: 1,
                _id: 0,
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        avatar: 1,
                                        username: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner",
                            },
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                video: {
                    $first: "$video",
                },
            },
        },
        {
            $project: {
                _id: "$video._id",
                videoFile: "$video.videoFile",
                thumbnail: "$video.thumbnail",
                title: "$video.title",
                description: "$video.description",
                duration: "$video.duration",
                views: "$video.views",
                isPublished: "$video.isPublished",
                owner: "$video.owner",
                createdAt: "$video.createdAt",
                updatedAt: "$video.updatedAt",
                __v: "$video.__v",
            },
        },
    ]);

    if (!likedVideos) {
        throw new ApiError(404, "No liked videos found");
    }

    res.status(200).json(
        new ApiResponse(200, likedVideos, "successfully fetched liked videos")
    );
});

const getMyvideos = asyncHandler(async (req, res) => {
    const videos = await Video.find({ owner: req.user?._id }).populate(
        "owner",
        "username avatar fullName"
    );

    if (!videos) {
        throw new ApiError(404, "No videos found");
    }

    res.status(200).json(
        new ApiResponse(200, videos, "All Videos fetched successfully")
    );
});

const updateWatchHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.body;

    if (!videoId) {
        throw new ApiError(400, "videoId is required");
    }

    // const user = await User.findByIdAndUpdate(
    //     req.user._id,
    //     {
    //         $addToSet: {
    //             watchHistory: videoId,
    //         },
    //     },
    //     { new: true }
    // );

    const user = await User.findById(req.user._id);
    if (!user.watchHistory.includes(videoId)) {
        user.watchHistory.push(videoId);
        await user.save();
    }
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // console.log(videoId);

    if (!user) {
        throw new ApiError(
            500,
            "Something went wrong while updating watch history"
        );
    }

    res.status(200).json(new ApiResponse(200, user, "Watch History updated"));
});

// const changeUsername

export {
    registerUser,
    userLogin,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    getLikedVideos,
    getMyvideos,
    updateWatchHistory,
};
