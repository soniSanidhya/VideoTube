import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import { useSharedVideoQuery } from "../../Utils/sharedQuaries/SharedVideoQuery";
import viewsFormatter from "../../Utils/viewsFormatter";
import timeFormatter from "../../Utils/timeformater";
import durationFormatter from "../../Utils/durationFormatter";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
const VideoPage = () => {

  const isLogin = useSelector((state) => state.auth.isLogin);

  console.log("isLogin", isLogin);
 


  const { data, isLoading, isError, error } = useSharedVideoQuery();
  // const response = axios.get("/api/videos/");
  // console.log("response", response);
  
  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
      {data?.data.data?.length ? (
        // <section class="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
          <div class="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
            {data.data.data?.map((element) => {
              return (
                <Link to={`/watch/${element._id}`} key={element._id} class="w-full">
                <div key={element._id} class="w-full">
                  <div class="relative mb-2 w-full pt-[56%]">
                    <div class="absolute inset-0">
                      <img
                        src={element.thumbnail}
                        alt={element.title}
                        class="h-full w-full"
                      />
                    </div>
                    <span class="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                      {durationFormatter(element.duration)}
                    </span>
                  </div>
                  <div class="flex gap-x-2 items-center">
                    <div class="h-10 w-10 shrink-0 ">
                    <Link to={`/channel/c/${element?.owner.username}`} class="block">
                      <img
                        src={element.owner.avatar}
                        alt={element.owner.username}
                        class="h-10 w-10 rounded-full"
                      />
                      </Link>
                    </div>
                    <div class="w-full">
                      <h6 class="mb-1 font-semibold">{element.title}</h6>
                      <p class="flex text-sm text-gray-200">
                        {viewsFormatter(element.views)} Views · {timeFormatter(element.createdAt)}
                      </p>
                      <Link to={`/channel/c/${element?.owner.username}`} class="block">
                      <p class="text-sm text-gray-200">
                        @{element.owner.username}
                      </p>
                      </Link>
                    </div>
                  </div>
                </div>
                </Link>
              );
            })}
          </div>
        // </section>
      ) : (
        <div className="h-screen overflow-y-auto bg-[#121212] text-white">
          <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
            <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
              <div className="flex h-full items-center justify-center">
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
                  <h5 className="mb-2 font-semibold">No videos available</h5>
                  <p>
                    There are no videos here available. Please try to search
                    some thing else.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    
    </>
  );
};

export default VideoPage;
