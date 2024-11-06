import {
  useQuery,
  useQueries,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import dateFormatter from "../../Utils/dateFormatter";
import { useFetchLikesAndDislikes } from "../../Utils/sharedQuaries/sharedfetchcommentandLikes";
import VideoModelPopUp from "../Channel/VideoModelPopUp";
import EditVideoPopup from "../EditVideo/EditVideoPopup";
import DeleteVideoPopup from "../EditVideo/DeleteVideoPopup";

const fetchChannelStats = (channelId) =>
  axios.get(`https://video-tube-eight.vercel.app/api/dashboard/stats/c/${channelId}`);

const fetchChannelVideos = (channelId) =>
  axios.get(`https://video-tube-eight.vercel.app/api/dashboard/videos/c/${channelId}`);

const patchVideoPublishStatus = (videoId) =>
  axios.patch(`https://video-tube-eight.vercel.app/api/videos/toggle/publish/${videoId}`);

const Dashboard = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [newVideo, setNewVideo] = useState(false);
  const [editVideoDetails, setEditVideoDetails] = useState({});
  const [deleteVideoDetails, setDeleteVideoDetails] = useState({});
  const isLogin = useSelector((state) => state.auth.isLogin);
  const uploaded = () => {
    setNewVideo(false);
  };

  const edited = () => {
    setEditVideoDetails({});
  };
  const deleted = () => {
    setDeleteVideoDetails({});
  };

  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
    error: statsError,
  } = useQuery({
    queryKey: ["channelState", user?._id],
    queryFn: () => fetchChannelStats(user?._id),
    staleTime: 1000 * 30,
  });

  // const { data , refetch } = useFetchLikesAndDislikes();

  const { data: videos } = useQuery({
    queryKey: ["videos", user?._id],
    queryFn: () => fetchChannelVideos(user?._id),
  });

  const queryClient = useQueryClient();

  const { mutate: togglePublishStatus } = useMutation({
    mutationFn: (videoId) => patchVideoPublishStatus(videoId),
    onSuccess: (newData) => {
      queryClient.setQueryData(["videos", user?._id], (oldData) => {
        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: oldData.data.data.map((video) => {
              if (video._id === newData.data.data._id) {
                return newData.data.data;
              }
              return video;
            }),
          },
        };
      });
    },
  });

  // console.log(user);
  // console.log(videos);
  // // console.log(likeQueries);

  if (isStatsLoading) {
    return <div>Loading...</div>;
  }

  if (isStatsError) {
    return <div>{statsError.message}</div>;
  }

  return isLogin ? (
    <>
      <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-y-6 px-4 py-8">
          <div className="flex flex-wrap justify-between gap-4">
            <div className="block">
              <h1 className="text-2xl font-bold">Welcome Back, {user.fullName}</h1>
              <p className="text-sm text-gray-300">
                Seamless Video Management, Elevated Results.
              </p>
            </div>
            <div className="block">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNewVideo(true);
                }}
                className="inline-flex items-center gap-x-2 bg-[#ae7aff] px-3 py-2 font-semibold text-black"
              >
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
                Upload video
              </button>
            </div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4">
            <div className="border p-4">
              <div className="mb-4 block">
                <span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </span>
              </div>
              <h6 className="text-gray-300">Total views</h6>
              <p className="text-3xl font-semibold">
                {stats?.data.data?.totalViews}
              </p>
            </div>
            <div className="border p-4">
              <div className="mb-4 block">
                <span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    ></path>
                  </svg>
                </span>
              </div>
              <h6 className="text-gray-300">Total subscribers</h6>
              <p className="text-3xl font-semibold">
                {stats?.data.data?.totalSubscribers}
              </p>
            </div>
            <div className="border p-4">
              <div className="mb-4 block">
                <span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    ></path>
                  </svg>
                </span>
              </div>
              <h6 className="text-gray-300">Total likes</h6>
              <p className="text-3xl font-semibold">
                {stats?.data?.data?.totalLikes}
              </p>
            </div>
          </div>
          <div className="w-full overflow-auto">
            <table className="w-full min-w-[1200px] border-collapse border text-white">
              <thead>
                <tr>
                  <th className="border-collapse border-b p-4">Status</th>
                  <th className="border-collapse border-b p-4">Status</th>
                  <th className="border-collapse border-b p-4">Uploaded</th>
                  <th className="border-collapse border-b p-4">Rating</th>
                  <th className="border-collapse border-b p-4">Date uploaded</th>
                  <th className="border-collapse border-b p-4"></th>
                </tr>
              </thead>
              <tbody>
                {videos?.data?.data?.map((video) => (
                  
                    <tr className="group border" key={video._id}>
                      <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                        <div className="flex justify-center">
                          <label
                            htmlFor={video._id}
                            className="relative inline-block w-12 cursor-pointer overflow-hidden"
                          >
                            <input
                              onClick={() => {
                                togglePublishStatus(video._id);
                              }}
                              type="checkbox"
                              id={video._id}
                              className="peer sr-only"
                              checked={video.isPublished}
                            />
                            <span className="inline-block h-6 w-full rounded-2xl bg-gray-200 duration-200 after:absolute after:bottom-1 after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-black after:duration-200 peer-checked:bg-[#ae7aff] peer-checked:after:left-7"></span>
                          </label>
                        </div>
                      </td>
                      <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                        <div className="flex justify-center">
                          {video.isPublished ? (
                            <span className="inline-block rounded-2xl border px-1.5 py-0.5 border-green-600 text-green-600">
                              Published
                            </span>
                          ) : (
                            <span className="inline-block rounded-2xl border px-1.5 py-0.5 border-orange-600 text-orange-600">
                              Unpublished
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                        <div className="flex items-center gap-4">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={video.thumbnail}
                            alt={video.owner.username}
                          />
                          <h3 className="font-semibold">{video.title}</h3>
                        </div>
                      </td>
                      <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                        <div className="flex justify-center gap-4">
                          <span className="inline-block rounded-xl bg-green-200 px-1.5 py-0.5 text-green-700">
                            {video.likes} likes
                          </span>
                          <span className="inline-block rounded-xl bg-red-200 px-1.5 py-0.5 text-red-700">
                            {video.disLikes} dislikes
                          </span>
                        </div>
                      </td>
                      <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                        {dateFormatter(video.createdAt)}
                      </td>
                      <td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
                        <div className="flex gap-4">
                          <button
                            onClick={() => {
                              setDeleteVideoDetails(video);
                            }}
                            className="h-5 w-5 hover:text-[#ae7aff]"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              ></path>
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setEditVideoDetails(video);
                            }}
                            className="h-5 w-5 hover:text-[#ae7aff]"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                      {/* <EditVideoPopup/> */}
                    </tr>
                  
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {newVideo && <VideoModelPopUp uploaded={uploaded} />}
      {editVideoDetails?._id && (
        <EditVideoPopup video={{ editVideoDetails, edited }} />
      )}
      {deleteVideoDetails?._id && (
        <DeleteVideoPopup video={{ deleteVideoDetails, deleted }} />
      )}
    </>
  ) : (
    <div className="h-full w-full overflow-y-auto bg-[#121212] text-white">
      <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
        <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
          <div className="flex h-full items-center justify-center">
            <div className="w-full max-w-sm text-center">
              <p className="mb-3 w-full">
                <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                  <svg
                    width="36px"
                    height="36px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        opacity="0.4"
                        d="M10.7604 2C10.2804 2 9.90039 2.38 9.90039 2.86V21.15C9.90039 21.62 10.2804 22.01 10.7604 22.01C16.6504 22.01 20.7604 17.9 20.7604 12.01C20.7604 6.12 16.6404 2 10.7604 2Z"
                        fill="#292D32"
                      ></path>{" "}
                      <path
                        d="M15.9002 11.5399L13.0602 8.68991C12.7702 8.39991 12.2902 8.39991 12.0002 8.68991C11.7102 8.97991 11.7102 9.45991 12.0002 9.74991L13.5602 11.3099H3.99023C3.58023 11.3099 3.24023 11.6499 3.24023 12.0599C3.24023 12.4699 3.58023 12.8099 3.99023 12.8099H13.5602L12.0002 14.3799C11.7102 14.6699 11.7102 15.1499 12.0002 15.4399C12.1502 15.5899 12.3402 15.6599 12.5302 15.6599C12.7202 15.6599 12.9102 15.5899 13.0602 15.4399L15.9002 12.5899C16.2002 12.2999 16.2002 11.8299 15.9002 11.5399Z"
                        fill="#292D32"
                      ></path>{" "}
                    </g>
                  </svg>{" "}
                </span>
              </p>
              <h5 className="mb-2 font-semibold">PLease Login </h5>
              <p>Login first to continue</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
