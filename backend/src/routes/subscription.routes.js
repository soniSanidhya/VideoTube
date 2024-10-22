import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controllers.js"
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = Router();



router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/c/:channelName")
    .get(getUserChannelSubscribers)
    
router
    .route("/c/:channelId")
    .post(toggleSubscription);

router.route("/u/:subscriberId").get(getSubscribedChannels);

export default router