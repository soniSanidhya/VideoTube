import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { usesharedFetchChannelDetails } from "../../Utils/sharedQuaries/sharedChannelDetails";
import axios from "axios";
import { useSelector } from "react-redux";
import { useGetCurrentUser } from "../../Utils/sharedQuaries/sharedGetCurrentUser";

const ChannelDetails = ({ isChannel }) => {
  const isLogin = useSelector((state) => state.auth.isLogin);
  const { username } = useParams();
  console.log(username);
  const [isMyChannel, setIsMyChannel] = useState(false);
  const { data: user } = useGetCurrentUser(isLogin);

  useEffect(() => {
    if (user) {
      if (user.data.data.username === username) {
        setIsMyChannel(true);
      }
    }
  }, [user]);
  const { data, isLoading, isError, error } =
    usesharedFetchChannelDetails(username);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  console.log(data.data);

  if (data.data.data) {
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
          {isMyChannel ? (
            <div class="inline-block">
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
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                    ></path>
                  </svg>
                </span>
                Edit
              </button>
            </div>
          ) : (
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
          )}
        </div>
        <ul class="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 bg-[#121212] py-2 sm:top-[82px]">
          <li class="w-full">
            <NavLink
              to={`/channel/c/${username}/videos`}
              className={({ isActive }) => (isActive ? " bg-white" : "")}
            >
              <button class="w-full border-b-2 border-[#ae7aff] px-3 py-1.5 text-[#ae7aff]">
                Videos
              </button>
            </NavLink>
          </li>
          <li class="w-full">
            <NavLink
              to={`/channel/c/${username}/playlists`}
              className={({ isActive }) => (isActive ? " bg-white" : "")}
            >
              <button class="w-full border-b-2 border-[#ae7aff] px-3 py-1.5 text-[#ae7aff]">
                Playlist
              </button>
            </NavLink>
          </li>
          <li class="w-full">
            <NavLink
              to={`/channel/c/${username}/tweets`}
              className={({ isActive }) => (isActive ? " bg-white" : "")}
            >
              <button class="w-full border-b-2 border-[#ae7aff] px-3 py-1.5 text-[#ae7aff]">
                Tweets
              </button>
            </NavLink>
          </li>
          <li class="w-full">
            <NavLink
              to={`/channel/c/${username}/subscribed`}
              className={({ isActive }) => (isActive ? " bg-white" : "")}
            >
              <button class="w-full border-b-2 border-[#ae7aff] px-3 py-1.5 text-[#ae7aff]">
                Subscribed
              </button>
            </NavLink>
          </li>
        </ul>
      </div>
    </section>
  ) : (
    <div>Channel not found</div>
  );
};

export default ChannelDetails;
