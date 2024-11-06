import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import viewsFormatter from "../../Utils/viewsFormatter.js";
import timeFormatter from "../../Utils/timeformater.js";
import durationFormatter from "../../Utils/durationFormatter.js";
import { Link, useParams } from "react-router-dom";
import { useGetCurrentUser } from "../../Utils/sharedQuaries/sharedGetCurrentUser.js";
import { useSelector } from "react-redux";
import VideoModelPopUp from "./VideoModelPopUp.jsx";
import api from "../../Utils/axiosHelper.js";

const fetchChannelVideos = (username) => {
  return api.get(`/api/videos/u/${username}`);
};
const ChannelVideos = () => {
  const { username } = useParams();
  const isLogin = useSelector((state) => state.auth.isLogin);
  const [isMyChannel, setIsMyChannel] = useState(false);
  const { data: user } = useGetCurrentUser(isLogin);
  const [newVideo, setNewVideo] = useState(false);


  const uploaded = () => {
   
    setNewVideo(false);
  }

  useEffect(() => {
    if (user) {
      if (user.data.data.username === username) {
        setIsMyChannel(true);
      }
    }
  }, [user]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["channelVideos", username],
    queryFn: () => fetchChannelVideos(username),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  // // console.log(newVideo);
  
  return (data.data.data.length > 0 ? (
    <>{isMyChannel && (
          <button
          onClick={()=>{setNewVideo(true)}} className="mt-4 inline-flex items-center gap-x-2 bg-[#ae7aff] px-3 py-2 font-semibold text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              ></path>
            </svg>
            New video
          </button>
        )}
    <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 pt-2">
    
      {data.data.data.map((video) => (
        <Link to={`/watch/${video._id}`} key={video._id}>
          <div className="w-full">
            <div className="relative mb-2 w-full pt-[56%]">
              <div className="absolute inset-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-full w-full"
                />
              </div>
              <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                {durationFormatter(video.duration)}
              </span>
            </div>
            <h6 className="mb-1 font-semibold">{video.title}</h6>
            <p className="flex text-sm text-gray-200">
              {viewsFormatter(video.views)} Views ·{" "}
              {timeFormatter(video.createdAt)}{" "}
            </p>
          </div>
        </Link>
      ))}
    </div>
    {newVideo && <VideoModelPopUp uploaded = {{uploaded}}/>}
    </>
  ) : (<>
    <div className="flex justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <p className="mb-3 w-full">
          <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              className="w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
              ></path>
            </svg>
          </span>
        </p>
        <h5 className="mb-2 font-semibold">No videos uploaded</h5>
        <p>
          This page has yet to upload a video. Search another page in order to
          find more videos.
        </p>
        {isMyChannel && (
          <button onClick={()=>{setNewVideo(true)}} className="mt-4 inline-flex items-center gap-x-2 bg-[#ae7aff] px-3 py-2 font-semibold text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              ></path>
            </svg>
            New video
          </button>
        )}
      </div>
    </div>
    {newVideo && <VideoModelPopUp uploaded = {uploaded} />}

    </>
  )
  
)};

export default ChannelVideos;
