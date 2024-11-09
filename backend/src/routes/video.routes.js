import { Router } from "express";
import {
    deleteVideo,
    getAllVideos,
    getUserVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
    updateViews,
} from "../controllers/video.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/videoUploadMulter.js";

const router = Router();
router.route("/").get(getAllVideos);
router.route("/v/:videoId").get(getVideoById);
router.route("/u/:username").get(getUserVideos);

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")

    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
        ]),
        publishAVideo
    );

router
    .route("/v/:videoId")
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
router.route("/update/views/:videoId").patch(updateViews);


export default router;
