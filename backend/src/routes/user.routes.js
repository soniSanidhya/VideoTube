import { Router } from "express";
import {
    registerUser,
    userLogin,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage,
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory,
    getLikedVideos,
    getMyvideos,
    updateWatchHistory,
} from "../controllers/user.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    registerUser
);
router.route("/login").post(userLogin);
//secure Routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refreshToken").post(refreshAccessToken);

router.route("/change-password").patch(verifyJWT, changeCurrentPassword);
router.route("/update-account").patch(verifyJWT , updateAccountDetails)
router.route("/updateAvatar").patch(
    upload.single("avatar"),
    verifyJWT,
    updateAvatar
);
router.route("/updateCoverImage").patch(
    upload.single("coverImage"),
    verifyJWT,
    updateCoverImage
);
router.route("/current-user").get(verifyJWT , getCurrentUser);
router.route("/channel/:username").get(getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);
router.route("/likedVideos").get(verifyJWT, getLikedVideos);
router.route("/myVideos").get(verifyJWT, getMyvideos);
router.route("/updateWatchHistory").patch(verifyJWT, updateWatchHistory);
router.route("/changePassword").patch(verifyJWT, changeCurrentPassword);

export default router;
