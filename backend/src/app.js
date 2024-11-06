import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
const app = express();


app.use(cors({
    origin : 'https://video-tube-1in9.vercel.app',
    credentials : true
}));
app.use(express.json({limit : "16kb"}));
app.use(express.urlencoded({extended : true, limit : "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// console.log(":Hello");

import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import playlistRouter from "./routes/playlist.routes.js"
import commentRouter from "./routes/comment.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import likeRouter from "./routes/like.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"



app.use('/api/users' , userRouter);
app.use('/api/videos' , videoRouter);
app.use('/api/playlists' , playlistRouter);
app.use('/api/comments' ,commentRouter );
app.use('/api/tweets' ,tweetRouter );
app.use('/api/likes' ,likeRouter );
app.use('/api/subscriptions' ,subscriptionRouter );
app.use('/api/dashboard' ,dashboardRouter);


app.get('/' ,(req , res)=>{
    res.send("Sanidhya");
})

export {app};