import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    getLikeCount,
    getDisLikeCount,
} from "../controllers/like.controllers.js"
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = Router();

router.route("/getLikes/:id").get(getLikeCount);
router.route("/getDisLikes/:id").get(getDisLikeCount);

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);

export default router