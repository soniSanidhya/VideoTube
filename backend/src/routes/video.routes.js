import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getUserVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controllers.js"
import {verifyJWT} from "../middleware/auth.middleware.js"
import {upload} from "../middleware/multer.middleware.js"

const router = Router();
router.route("/")
    .get(getAllVideos)
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
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/u/:username").get(getUserVideos);
router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router