import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Video id is missing or invalid");
    }
    const video = await Video.findById(videoId);
    // const comments = await Comment.aggregate([
    //     {
    //         $match: {
    //             video: video._id,
    //         },
    //     },
        
    //     {
    //         $lookup: {
    //             from: "users",
    //             localField: "owner",
    //             foreignField: "_id",
    //             as: "owner",
    //             pipeline: [
    //                 {
    //                     $project: {
    //                         username: 1,
    //                         fullName: 1,
    //                         avatar: 1,
    //                     },
    //                 },
    //             ],
    //         },
    //     },
    //     {
    //         $addFields: {
    //             owner: {
    //                 $first: "$owner",
    //             },
                
    //         },
    //     },
        
    
    // ]);
    const comments = await Comment.find({ video: video._id }).populate("owner", "username fullName avatar").sort({ createdAt: -1 });
    const commentsCount = await Comment.countDocuments({ video: video._id }).countDocuments();
    if (!comments) {
        throw new ApiError(500, "Something went wrong while fetching comments");
    }

    
    const options = {
        page: 1,
        limit: 10,
    };

    // const paginatedComments = await Comment.aggregatePaginate(comments, options);

    res.status(200).json(
        new ApiResponse(200, {comments , commentsCount : commentsCount ||  0} , "Comments successfully fetched")
    );
});


const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    const video = await Video.findById(videoId);

    const comment = await Comment.create({
        content,
        video: video._id,
        owner: req.user._id,
    });

    if (!comment) {
        throw new ApiError(500, "something went wrong while adding coomment");
    }

    res.status(200).json(
        new ApiResponse(200, comment, "Successfully added comment")
    );
});

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    // hello
    const { commentId } = req.params;
    const { content } = req.body;

    if (!commentId) {
        throw new ApiError(400, "Comment Id is required");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(200, "comment id is incorrect!!");
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        comment._id,
        {
            $set: {
                content,
            },
        },
        {
            new: true,
        }
    );

    res.status(200).json(
        new ApiResponse(200, updatedComment, "Successfully updated comment")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;

    if (!commentId) {
        throw new ApiError(400, "Comment Id is required");
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(200, "comment id is incorrect!!");
    }
    const deletedComment = await Comment.deleteOne(comment._id);

    if (!deletedComment) {
        throw new ApiError(500, "something went wrong while deleting comment");
    }

    res.status(200).json(
        new ApiResponse(200, deletedComment, "Successfully deleted comment")
    );
});

export { getVideoComments, addComment, updateComment, deleteComment };
