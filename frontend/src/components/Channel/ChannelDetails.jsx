import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { usesharedFetchChannelDetails } from "../../Utils/sharedQuaries/sharedChannelDetails";
import axios from "axios";



const ChannelDetails = ({isChannel}) => {
  const { username } = useParams();
  console.log(username);

  const { data, isLoading, isError, error } = usesharedFetchChannelDetails(username)

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  console.log(data.data);

  if(data.data.data){
    isChannel();
    console.log("called");
    
  }

  return data?.data.data ? (
    <section class="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div class="relative min-h-[150px] w-full pt-[16.28%]">
        <div class="absolute inset-0 overflow-hidden">
          <img src={data.data.data.coverImage} alt="cover-photo" />
        </div>
      </div>
      <div class="px-4 pb-4">
        <div class="flex flex-wrap gap-4 pb-4 pt-6">
          <span class="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2">
            <img
              src={data.data.data.avatar}
              alt="Channel"
              class="h-full w-full"
            />
          </span>
          <div class="mr-auto inline-block">
            <h1 class="font-bolg text-xl">{data.data.data.fullName}</h1>
            <p class="text-sm text-gray-400">@{data.data.data.username}</p>
            <p class="text-sm text-gray-400">
              {data.data.data.channelSubscriberCount} Subscribers ·{" "}
              {data.data.data.channelSubscribedToCount} Subscribed
            </p>
          </div>
          <div class="inline-block">
            <div class="inline-flex min-w-[145px] justify-end">
              <button class="group/btn mr-1 flex w-full items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto">
                <span class="inline-block w-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                    ></path>
                  </svg>
                </span>
                <span class="group-focus/btn:hidden">Subscribe</span>
                <span class="hidden group-focus/btn:block">Subscribed</span>
              </button>
            </div>
          </div>
        </div>
        <ul class="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 bg-[#121212] py-2 sm:top-[82px]">
          <li class="w-full">
            <button class="w-full border-b-2 border-[#ae7aff] bg-white px-3 py-1.5 text-[#ae7aff]">
              Videos
            </button>
          </li>
          <li class="w-full">
            <button class="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">
              Playlist
            </button>
          </li>
          <li class="w-full">
            <button class="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">
              Tweets
            </button>
          </li>
          <li class="w-full">
            <button class="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-400">
              Subscribed
            </button>
          </li>
        </ul>
      </div>
    </section>) : 
    (
      <div>Channel not found</div>
    );
  
};

export default ChannelDetails;
