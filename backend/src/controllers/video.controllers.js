import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    //TODO: get all videos based on query, sort, pagination
    const allVideos = await Video.find()
        .populate("owner", "username avatar fullName")
        .sort({ createdAt: -1 });

    if (!allVideos) {
        throw new ApiError(404, "No videos found");
    }

    res.status(200).json(
        new ApiResponse(200, allVideos, "All Videos fetched successfully")
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    console.log("hello hi video");

    if (!title || !description) {
        throw new ApiError(400, "Please provide title and description");
    }

    // TODO: get video, upload to cloudinary, create video
    const videoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    if (!videoLocalPath) {
        throw new ApiError(400, "Please provide a video file");
    }

    const uploadedVideo = await uploadOnCloudinary(videoLocalPath);
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!uploadedVideo.url && !uploadedThumbnail) {
        throw new ApiError(400, "Something went wrong while uploading video");
    }
    console.log("duration: ", uploadedVideo.duration);
    const video = await Video.create({
        videoFile: uploadedVideo.url,
        thumbnail: uploadedThumbnail.url,
        title,
        description,
        duration: uploadedVideo.duration,
        owner: req.user._id,
    });

    const createdVideo = await Video.findById(video._id);
    console.log("created video: ", createdVideo);

    if (!createdVideo) {
        throw new ApiError(500, "Something Went wrong");
    }

    res.status(200).json(
        new ApiResponse(200, createdVideo, "uploaded succesfully")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: get video by id
    const video = await Video.findById(videoId).populate("owner", "username avatar fullName");
    if (!video) {
        throw new ApiError(404, "video Not found");
    }

    res.status(200).json(
        new ApiResponse(200, video, "Video Fetched Successfully")
    );
});

const getUserVideos = asyncHandler(async (req, res) => {
    const { username } = req.params;
    console.log("username: ", username);
    
    if(!username){
        throw new ApiError(400, "Please provide a username");
    }
        
    const owner = await User.findOne({ username});

    console.log("owner: ", owner);
    
    const videos = await Video.find({ owner: owner._id })
        .populate("owner", "username avatar fullName")
        .sort({ createdAt: -1 });

    if (!videos) {
        throw new ApiError(404, "No videos found");
    }

    res.status(200).json(
        new ApiResponse(200, videos,  "All Videos fetched successfully")
    )
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: update video details like title, description, thumbnail
    const thumbnailLocalPath = req.file?.path;
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Please provide a thumbnail file");
    }
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!uploadedThumbnail.url) {
        throw new ApiError(
            400,
            "Something went wrong while uploading thumbnail"
        );
    }
    const video = await Video.findById(videoId);
    const oldThumbnail = video.thumbnail || null;
    const updatedVideo = await Video.findByIdAndUpdate(
        video._id,
        {
            $set: {
                thumbnail: uploadedThumbnail.url,
            },
        },
        {
            new: true,
        }
    );
    if (!updatedVideo) {
        throw new ApiError(500, "Something Went wrong");
    }
    deleteFromCloudinary(video.thumbnail);

    res.status(200).json(
        new ApiResponse(200, updatedVideo, "Thumbnail updated successfully")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: delete video
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "video Not found");
    }
    const videourl = video.videoFile;
    const thumbnailurl = video.thumbnail;
    const deletedVideo = await Video.findByIdAndDelete(videoId);
    if (!deletedVideo) {
        throw new ApiError(500, "Something Went wrong");
    }
    deleteFromCloudinary(videourl);
    deleteFromCloudinary(thumbnailurl);

    res.status(200).json(
        new ApiResponse(200, {}, "Video Deleted Successfully")
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    const updatedVideo = await Video.findByIdAndUpdate(
        video._id,
        {
            $set: {
                isPublished: !video.isPublished,
            },
        },
        {
            new: true,
        }
    );

    if (!updatedVideo) {
        throw new ApiError(500, "Something Went wrong");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            updatedVideo,
            "Publish status updated successfully"
        )
    );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    getUserVideos,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
};
