import axios from "axios";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { RiLoginCircleLine } from "react-icons/ri";
import durationFormatter from "../../Utils/durationFormatter";
import viewsFormatter from "../../Utils/viewsFormatter";
import timeFormatter from "../../Utils/timeformater";
import api from "../../Utils/axiosHelper";
const fetchVideoList = (v , id) => {
  if(v == 'playlist'){
    return api.get(`/api/playlists/${id}`);
  }
  return api.get(`/api/users/${v}`);
};

const VideoListPage = () => {
  const { v } = useParams();
  const { id } = useParams() || null;
  const isLogin = useSelector((state) => state.auth.isLogin);
  // console.log("v", v);
  // console.log("id", id);
  

  
  // console.log("isLogin", isLogin);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["videoList", v ?? "all"],
    queryFn: () => fetchVideoList(v , id),
    staleTime: 1000 * 60 * 1,
    enabled: isLogin || v === "playlist",
  });

  // if (!isLogin) {
  //   return (
  //     <div className="h-full w-full overflow-y-auto bg-[#121212] text-white">
  //       <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
  //         <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
  //           <div className="flex h-full items-center justify-center">
  //             <div className="w-full max-w-sm text-center">
  //               <p className="mb-3 w-full">
  //                 <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
  //                 <svg width="36px" height="36px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.4" d="M10.7604 2C10.2804 2 9.90039 2.38 9.90039 2.86V21.15C9.90039 21.62 10.2804 22.01 10.7604 22.01C16.6504 22.01 20.7604 17.9 20.7604 12.01C20.7604 6.12 16.6404 2 10.7604 2Z" fill="#292D32"></path> <path d="M15.9002 11.5399L13.0602 8.68991C12.7702 8.39991 12.2902 8.39991 12.0002 8.68991C11.7102 8.97991 11.7102 9.45991 12.0002 9.74991L13.5602 11.3099H3.99023C3.58023 11.3099 3.24023 11.6499 3.24023 12.0599C3.24023 12.4699 3.58023 12.8099 3.99023 12.8099H13.5602L12.0002 14.3799C11.7102 14.6699 11.7102 15.1499 12.0002 15.4399C12.1502 15.5899 12.3402 15.6599 12.5302 15.6599C12.7202 15.6599 12.9102 15.5899 13.0602 15.4399L15.9002 12.5899C16.2002 12.2999 16.2002 11.8299 15.9002 11.5399Z" fill="#292D32"></path> </g></svg> </span>
  //               </p>
  //               <h5 className="mb-2 font-semibold">PLease Login </h5>
  //               <p>Login first to continue</p>
  //             </div>
  //           </div>
  //         </section>
  //       </div>
  //     </div>
  //   );
  // }

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  // console.log(data);

  // if (v === likedVideos || v === myContent || v === history  ) {
    if(!isLogin && !(v === "playlist") ){
      return (
            <div className="h-full w-full overflow-y-auto bg-[#121212] text-white">
              <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
                <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
                  <div className="flex h-full items-center justify-center">
                    <div className="w-full max-w-sm text-center">
                      <p className="mb-3 w-full">
                        <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
                        <svg width="36px" height="36px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.4" d="M10.7604 2C10.2804 2 9.90039 2.38 9.90039 2.86V21.15C9.90039 21.62 10.2804 22.01 10.7604 22.01C16.6504 22.01 20.7604 17.9 20.7604 12.01C20.7604 6.12 16.6404 2 10.7604 2Z" fill="#292D32"></path> <path d="M15.9002 11.5399L13.0602 8.68991C12.7702 8.39991 12.2902 8.39991 12.0002 8.68991C11.7102 8.97991 11.7102 9.45991 12.0002 9.74991L13.5602 11.3099H3.99023C3.58023 11.3099 3.24023 11.6499 3.24023 12.0599C3.24023 12.4699 3.58023 12.8099 3.99023 12.8099H13.5602L12.0002 14.3799C11.7102 14.6699 11.7102 15.1499 12.0002 15.4399C12.1502 15.5899 12.3402 15.6599 12.5302 15.6599C12.7202 15.6599 12.9102 15.5899 13.0602 15.4399L15.9002 12.5899C16.2002 12.2999 16.2002 11.8299 15.9002 11.5399Z" fill="#292D32"></path> </g></svg> </span>
                      </p>
                      <h5 className="mb-2 font-semibold">PLease Login </h5>
                      <p>Login first to continue</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          );
    }
    
  // }

  return (
    data?.data.data?.length > 0 && (
      // <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        <div className="flex flex-col gap-4 p-4">
          {data?.data.data?.map((video) => (
            <Link to={`/watch/${video._id}`} key={video._id} className="w-full">
            <div className="w-full max-w-3xl gap-x-4 md:flex">
              <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
                <div className="w-full pt-[56%]">
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
              </div>
              <div className="flex gap-x-2 md:w-7/12">
              <Link to={`/channel/c/${video?.owner.username}`} className="block">

                <div className="h-10 w-10 shrink-0 md:hidden">
                  <img
                    src={video.owner.avatar}alt={video.owner.username}
                    className="h-full w-full rounded-full"
                  />
                </div>
                </Link>
                <div className="w-full">
                  <h6 className="mb-1 font-semibold md:max-w-[75%]">
                    {video.title}
                  </h6>
                  <p className="flex text-sm text-gray-200 sm:mt-3">
                   {viewsFormatter(video.views)} Views · {timeFormatter(video.createdAt)}
                  </p>
                  <Link to={`/channel/c/${video?.owner.username}`} className="block">
                  <div className="flex items-center gap-x-4">
                    <div className="mt-2 hidden h-10 w-10 shrink-0 md:block">
                      <img
                       src={video?.owner.avatar}alt={video?.owner.username}
                        className="h-full w-full rounded-full"
                      />
                    </div>
                    <p className="text-sm text-gray-200">{video.owner.username}</p>
                  </div>
                  </Link>
                  <p className="mt-2 hidden text-sm md:block">
                   {video.description}
                  </p>
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
      // </section>
    )
  );
};

export default VideoListPage;
