import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import  viewsFormatter  from "../../Utils/viewsFormatter.js";
import timeFormatter from "../../Utils/timeformater.js";
import durationFormatter from "../../Utils/durationFormatter.js";
import { Link, useParams } from "react-router-dom";

const fetchChannelVideos = (username) => {
  return axios.get(`/api/videos/u/${username}`);
};
const ChannelVideos = () => {
  const { username } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["channelVideos", username],
    queryFn: () => fetchChannelVideos(username),
    staleTime: 1000 * 60 * 5,
  });

  console.log("videos", data);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return data.data.data.length > 0 ? (
    <div class="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 pt-2">
      {
        data.data.data.map((video) => (
          
          <Link to={`/watch/${video._id}`} key={video._id}>

          <div class="w-full">
          <div class="relative mb-2 w-full pt-[56%]">
            <div class="absolute inset-0">
              <img
                src={video.thumbnail}
                 alt={video.title}
                class="h-full w-full"
              />
            </div>
            <span class="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
              {durationFormatter(video.duration)}
            </span>
          </div>
          <h6 class="mb-1 font-semibold">
            {video.title}
          </h6>
          <p class="flex text-sm text-gray-200">{viewsFormatter(video.views)} Views · {timeFormatter(video.createdAt)} </p>
        </div>
        </Link>
        ))
      }
    </div>
  ) : (
    <div class="flex justify-center p-4">
      <div class="w-full max-w-sm text-center">
        <p class="mb-3 w-full">
          <span class="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              class="w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
              ></path>
            </svg>
          </span>
        </p>
        <h5 class="mb-2 font-semibold">No videos uploaded</h5>
        <p>
          This page has yet to upload a video. Search another page in order to
          find more videos.
        </p>
      </div>
    </div>
  );
};

export default ChannelVideos;
