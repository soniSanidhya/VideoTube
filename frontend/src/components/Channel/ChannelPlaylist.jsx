import React, { useEffect } from 'react';
import axios from 'axios';
import { Link, useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import viewsFormatter from '../../Utils/viewsFormatter';
import timeFormatter from '../../Utils/timeformater';
import { useSelector } from 'react-redux';
import { useFetchPlaylists } from '../../Utils/sharedQuaries/sharedFetchPlaylists';
import noVideos from '/noVideos.jpg';


const ChannelPlaylist = () => {
  const user = useSelector((state) => state.user.currentUser);
  const tempUsername = useOutletContext()
  const {username } = tempUsername || {username : user.username}; 
  const isLogin = useSelector((state) => state.auth.isLogin)
  
  // // console.log("username" , username);
  
  const {data , isloading, isError, error} = useFetchPlaylists(username);
// // console.log("data" ,data?.data.data.userPlaylist);
// // console.log("playlist" , data );

// // console.log( "tempusername" ,tempUsername?.username);

  if(!isLogin && tempUsername?.username == undefined ){
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

    return (

      data?.data.data?.userPlaylist.length > 0  ? (
        <div className="grid gap-4 pt-2 sm:grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))]">

        { data?.data.data.userPlaylist.map((playlist) => (

          <Link to={`/videoList/playlist/${playlist._id}`} key={playlist._id}>
          <div className="w-full">
            <div className="relative mb-2 w-full pt-[56%]">
              <div className="absolute inset-0">
                <img
                  src={playlist.videos[0]?.thumbnail || noVideos } alt="React Mastery"
                  className="h-full w-full" />
                <div className="absolute inset-x-0 bottom-0">
                  <div className="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                    <div className="relative z-[1]">
                      <p className="flex justify-between">
                        <span className="inline-block">Playlist</span>
                        <span className="inline-block">{playlist.totalVideos} videos</span>
                      </p>
                      <p className="text-sm text-gray-200">{viewsFormatter(playlist.totalViews)} Views · {timeFormatter(playlist.createdAt)} </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h6 className="mb-1 font-semibold">{playlist.name}</h6>
            <p className="flex text-sm text-gray-200">{playlist.description || ""}</p>
          </div>      
        </Link>
        )
      )}
        </div>
      ) : (
      <div className="flex justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <p className="mb-3 w-full">
          <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
            <span className="inline-block w-6">
              <svg
                style={{ width: '100%' }}
                viewBox="0 0 22 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 5L10.8845 2.76892C10.5634 2.1268 10.4029 1.80573 10.1634 1.57116C9.95158 1.36373 9.69632 1.20597 9.41607 1.10931C9.09916 1 8.74021 1 8.02229 1H4.2C3.0799 1 2.51984 1 2.09202 1.21799C1.71569 1.40973 1.40973 1.71569 1.21799 2.09202C1 2.51984 1 3.0799 1 4.2V5M1 5H16.2C17.8802 5 18.7202 5 19.362 5.32698C19.9265 5.6146 20.3854 6.07354 20.673 6.63803C21 7.27976 21 8.11984 21 9.8V14.2C21 15.8802 21 16.7202 20.673 17.362C20.3854 17.9265 19.9265 18.3854 19.362 18.673C18.7202 19 17.8802 19 16.2 19H5.8C4.11984 19 3.27976 19 2.63803 18.673C2.07354 18.3854 1.6146 17.9265 1.32698 17.362C1 16.7202 1 15.8802 1 14.2V5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"></path>
              </svg>
            </span>
          </span>
        </p>
        <h5 className="mb-2 font-semibold">No playlist created</h5>
        <p>There are no playlist created on this channel.</p>
      </div>
    </div>
    )
  );
};

export default ChannelPlaylist;