import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import timeFormatter from "../../Utils/timeformater";
import { getLikes } from "../../Utils/sharedQuaries/sharedLikeQuery";
import { useFetchLikesAndDislikes } from "../../Utils/sharedQuaries/sharedfetchcommentandLikes";
import { useSelector } from "react-redux";

const fetchChannelTweets = (username) => {
  return axios.get(`/api/tweets/user/${username}`);
};

const postTweet = (tweet) => axios.post("/api/tweets", { content: tweet });

const patchLike = ({ id, isLiked }) =>
  axios.post(`/api/likes/toggle/t/${id}`, { isLiked });

const ChannelTweet = () => {
  const currUser = useSelector((state) => state.user.currentUser);
  const isLogin = useSelector((state) => state.auth.isLogin);
  const [isMyChannel, setIsMyChannel] = useState(false);



  // // console.log("currentUser" , currUser?.username);
  // // console.log("isLogin" , isLogin);

  const { username } = useOutletContext();
  const [tweet, setTweet] = useState("");

  useEffect(() => {
    if (currUser?.username === username) {
      setIsMyChannel(true);
    }
  }, [currUser, username]);
  const queryClient = useQueryClient();
  const {
    data: tweetData,
    isLoading: isTweeLoading,
    isError: isTweetError,
    error: tweetError,
  } = useQuery({
    queryKey: ["channelTweets", username],
    queryFn: () => fetchChannelTweets(username),
    staleTime: 1000 * 60,
  });

  const { mutate: toggleLikeMutaion } = useMutation({
    mutationFn: ({ tweetId, isLiked }) => patchLike({ id: tweetId, isLiked }),
    onSuccess: (newData) => {
      queryClient.invalidateQueries(["channelTweets", username]);
      // console.log("liked", newData);
    }
  });

  const { mutate: postTweetMutation } = useMutation({
    mutationFn: (tweet) => postTweet(tweet),
    onSuccess: () => {
      queryClient.invalidateQueries(["channelTweets", username]);
      setTweet("");
    },
  });

  const handleTweet = (e) => {
    setTweet(e.target.value);
  };
  // const {data : likeCount } = getLikes()
  // // console.log("data", tweetData?.data.data);

  if (isTweeLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="w-full max-w-sm text-center">Loading...</div>
      </div>
    );
  }

  if (isTweetError) {
    return (
      <div className="flex justify-center p-4">
        <div className="w-full max-w-sm text-center">Error</div>
      </div>
    );
  }

  return tweetData?.data.data?.length > 0 ? (
    <>
      { isMyChannel &&
        <div className="mt-2 border pb-2">
          <textarea
            onChange={handleTweet}
            className="mb-2 h-10 w-full resize-none border-none bg-transparent px-3 pt-2 outline-none"
            placeholder="Write a tweet"
          ></textarea>
          <div className="flex items-center justify-end gap-x-3 px-3">
            <button className="inline-block h-5 w-5 hover:text-[#ae7aff]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                ></path>
              </svg>
            </button>
            <button className="inline-block h-5 w-5 hover:text-[#ae7aff]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                ></path>
              </svg>
            </button>
            <button
              onClick={() => {
                postTweetMutation(tweet);
              }}
              className="bg-[#ae7aff] px-3 py-2 font-semibold text-black"
            >
              Send
            </button>
          </div>
        </div>
      }
      <div className="py-4">
        {tweetData?.data.data?.map((tweet) => {
          // const { data: likeData, isLoading: isLikeLoading, isError: isLikeError } = fetchLikedata(tweet._id);
          // // console.log("likeData", likeData);
          // // console.log("data" , data);

          return (
            <div key={tweet._id} className="flex gap-3 border-b border-gray-700 py-4 last:border-b-transparent">
              <div className="h-14 w-14 shrink-0">
                <img
                  src={tweet?.owner.avatar}
                  alt={tweet?.owner.username}
                  className="h-full w-full rounded-full"
                />
              </div>
              <div className="w-full">
                <h4 className="mb-1 flex items-center gap-x-2">
                  <span className="font-semibold">@{tweet?.owner.username}</span> 
                  <span className="inline-block text-sm text-gray-400">
                    {timeFormatter(tweet.createdAt)}
                  </span>
                </h4>
                <p className="mb-2">{tweet.content}</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      isLogin &&
                        toggleLikeMutaion({
                          tweetId: tweet._id,
                          isLiked: true,
                        });
                    }}
                    className="group inline-flex items-center gap-x-1 outline-none after:content-[attr(data-like-count)] focus:after:content-[attr(data-like-count-alt)]"
                    data-like-count={tweet.likes}
                    data-like-count-alt={tweet.likes}
                    disabled={!isLogin}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="h-5 w-5 text-[#ae7aff] group-focus:text-inherit"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                      ></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      isLogin &&
                        toggleLikeMutaion({
                          tweetId: tweet._id,
                          isLiked: false,
                        });
                    }}
                    className="group inline-flex items-center gap-x-1 outline-none after:content-[attr(data-dislike-count)] focus:after:content-[attr(data-dislike-count-alt)]"
                    data-dislike-count={tweet.dislikes}
                    data-dislike-count-alt={tweet.dislikes}
                    disabled={!isLogin}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="h-5 w-5 text-inherit group-focus:text-[#ae7aff]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  ) : (
    <>
      <div className="mt-2 border pb-2">
        <textarea
          onChange={handleTweet}
          className="mb-2 h-10 w-full resize-none border-none bg-transparent px-3 pt-2 outline-none"
          placeholder="Write a tweet"
        ></textarea>
        <div className="flex items-center justify-end gap-x-3 px-3">
          <button className="inline-block h-5 w-5 hover:text-[#ae7aff]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
              ></path>
            </svg>
          </button>
          <button className="inline-block h-5 w-5 hover:text-[#ae7aff]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              ></path>
            </svg>
          </button>
          <button
            onClick={() => {
              postTweetMutation(tweet);
            }}
            className="bg-[#ae7aff] px-3 py-2 font-semibold text-black"
          >
            Send
          </button>
        </div>
      </div>

      <div className="flex justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <p className="mb-3 w-full">
            <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
              <span className="inline-block w-6">
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
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  ></path>
                </svg>
              </span>
            </span>
          </p>
          <h5 className="mb-2 font-semibold">No Tweets</h5>
          <p>
            This channel has yet to make a<strong>Tweet</strong>.
          </p>
        </div>
      </div>
    </>
  );
};

export default ChannelTweet;
