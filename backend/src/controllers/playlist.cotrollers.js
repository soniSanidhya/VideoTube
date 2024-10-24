import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    //TODO: create playlist
    if (!name) {
        throw new ApiError(400, "Name is required");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id,
    });

    if (!playlist) {
        throw new ApiError(500, "Something went wrong While creating Playlist");
    }

    res.status(200).json(
        new ApiResponse(200, playlist, "Playlist successfully created")
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { username } = req.params;
    //TODO: get user playlists
    if (!username) {
        throw new ApiError(400, "username is required");
    }

    const user = await User.findOne({ username: username });

    if (!user) {
        throw new ApiError(400, "user not found");
    }

    // console.log("user",user);
    
    const userPlaylist = await Playlist.aggregate([
        {
            $match: {
                owner: user._id,
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
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
            $addFields: {
                totalViews: {
                    $sum: "$videos.views",
                },
                totalVideos: {
                    $size: "$videos",
                },
                totalDuration: {
                    $sum: "$videos.duration",
                },
            },
        },
    ]);

    if (!userPlaylist) {
        throw new ApiError(404, "Playlists Not Found");
    }

    res.status(200).json(
        new ApiResponse(200, { userPlaylist }, "Playlists Fetched Successfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    //TODO: get playlist by id
    // console.log("fetching plalist");

    if (!playlistId) {
        throw new ApiError(400, "playlist id is required");
    }

    const playlistwithID = await Playlist.findById(playlistId);

    if (!playlistwithID) {
        throw new ApiError(400);
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId),
            },
        },

        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
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
                videos: 1,
                _id: 0,
            },
        },
        {
            $unwind: "$videos",
        },
        {
            $project: {
                _id: "$videos._id",
                videoFile: "$videos.videoFile",
                thumbnail: "$videos.thumbnail",
                title: "$videos.title",
                description: "$videos.description",
                duration: "$videos.duration",
                views: "$videos.views",
                isPublished: "$videos.isPublished",
                owner: "$videos.owner",
                createdAt: "$videos.createdAt",
                updatedAt: "$videos.updatedAt",
                __v: "$videos.__v",
            },
        },
    ]);
    // console.log("playList with id", playlistwithID);
    // console.log("playList", playlist);

    res.status(200).json(
        new ApiResponse(200, playlist, "Playlist Fatched Successfully")
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    // console.log(playlistId, videoId);
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(400, "Playlist Not found");
    }
    let updatedPlaylist = null;
    if (playlist.videos.includes(videoId)) {
       
        updatedPlaylist = await Playlist.findByIdAndUpdate(
            playlist._id,
            {
                $set: {
                    videos: playlist.videos.filter((vi) => vi != videoId),
                },
            },
            {
                new: true,
            }
        );

    }
    else {
    updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlist._id,
        {
            $set: {
                videos: [...playlist.videos, videoId],
            },
        },
        {
            new: true,
        }
    );
}

    if (!updatePlaylist) {
        throw new ApiError(500, "Something wnt wrong while updating playlist");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "Video Successfully added/remove in the playlist"
        )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    // TODO: remove video from playlist
    if (!playlistId && !videoId) {
        throw new ApiError(400, "Both Playlidt id and video id are required ");
    }
    const oldPlaylist = await Playlist.findById(playlistId);
    if (!oldPlaylist) {
        throw new ApiError(400, "playlist not found");
    }
    const playList = await Playlist.findByIdAndUpdate(
        oldPlaylist._id,
        {
            $set: {
                videos: oldPlaylist.videos.filter((vi) => vi != videoId),
            },
        },
        {
            new: true,
        }
    );

    if (!playList) {
        throw new ApiError(
            500,
            "Something went wrong while removing video from playlist"
        );
    }

    res.status(200).json(
        new ApiResponse(
            200,
            playList,
            "Video successfully removed from th playlist"
        )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    // TODO: delete playlist
    if (!playlistId) {
        throw new ApiError(400, "Playlist id is required ");
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

    // console.log(deletedPlaylist);

    if (!deletedPlaylist) {
        throw new ApiError(500, "Something went wrong while deleting playlist");
    }

    res.status(200).json(
        new ApiResponse(200, deletedPlaylist, "playList successfully deleted ")
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    //TODO: update playlist

    // const playlist = await Playlist.findById(playlistId);
    // // console.log(playlist);

    const updatedPlayList = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description,
            },
        },
        {
            new: true,
        }
    );

    if (!updatePlaylist) {
        throw new ApiError(500, "Something went wrong while updating playlist");
    }

    res.status(200).json(
        new ApiResponse(200, updatedPlayList, "playList successfully updated ")
    );
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
};
