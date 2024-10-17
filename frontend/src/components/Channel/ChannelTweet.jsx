import React from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import timeFormatter from "../../Utils/timeformater";
import { getLikes } from "../../Utils/sharedQuaries/sharedLikeQuery";

const fetchChannelTweets = (username) => {
  return axios.get(`/api/tweets/user/${username}`);
};

const ChannelTweet = () => {
  const { username } = useOutletContext();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["channelTweets", username],
    queryFn: () => fetchChannelTweets(username),
    staleTime: 1000 * 60,
  });
  // const {data : likeCount } = getLikes() 
  console.log("data", data?.data.data);

  if (isLoading) {
    return (
      <div class="flex justify-center p-4">
        <div class="w-full max-w-sm text-center">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div class="flex justify-center p-4">
        <div class="w-full max-w-sm text-center">Error</div>
      </div>
    );
  }

  return data?.data.data?.length > 0 ? (
    <div class="py-4">
      {data?.data.data?.map((tweet)=>(
        <div class="flex gap-3 border-b border-gray-700 py-4 last:border-b-transparent">
        <div class="h-14 w-14 shrink-0">
          <img
            src={tweet?.owner.avatar}
            alt={tweet?.owner.username}
            class="h-full w-full rounded-full"
          />
        </div>
        <div class="w-full">
          <h4 class="mb-1 flex items-center gap-x-2">
            <span class="font-semibold">@{tweet?.owner.username}</span> 
            <span class="inline-block text-sm text-gray-400">
            {timeFormatter(tweet.createdAt)}
            </span>
          </h4>
          <p class="mb-2">
           {tweet.content}
          </p>
          <div class="flex gap-4">
            <button
              class="group inline-flex items-center gap-x-1 outline-none after:content-[attr(data-like-count)] focus:after:content-[attr(data-like-count-alt)]"
              data-like-count="425"
              data-like-count-alt="424"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
                class="h-5 w-5 text-[#ae7aff] group-focus:text-inherit"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                ></path>
              </svg>
            </button>
            <button
              class="group inline-flex items-center gap-x-1 outline-none after:content-[attr(data-dislike-count)] focus:after:content-[attr(data-dislike-count-alt)]"
              data-dislike-count="87"
              data-dislike-count-alt="88"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
                class="h-5 w-5 text-inherit group-focus:text-[#ae7aff]"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      ))}  
    </div>
  ) : (
    <div class="flex justify-center p-4">
      <div class="w-full max-w-sm text-center">
        <p class="mb-3 w-full">
          <span class="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
            <span class="inline-block w-6">
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
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                ></path>
              </svg>
            </span>
          </span>
        </p>
        <h5 class="mb-2 font-semibold">No Tweets</h5>
        <p>
          This channel has yet to make a<strong>Tweet</strong>.
        </p>
      </div>
    </div>
  );
};

export default ChannelTweet;
