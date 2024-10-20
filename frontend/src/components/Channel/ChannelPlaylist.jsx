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
  const {username } = useOutletContext() || {username : user.username}; 
  
  
  console.log("username" , username);
  
  const {data , isloading, isError, error} = useFetchPlaylists(username);
console.log("data" ,data?.data.data.userPlaylist);
console.log("playlist" , data );
useEffect(() => {
  data?.data.data.userPlaylist.map((playlist) => {
    console.log("playlist" , playlist.name);
    
  })
})


    return (

      data?.data.data?.userPlaylist.length > 0  ? (
        <div class="grid gap-4 pt-2 sm:grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))]">

        { data?.data.data.userPlaylist.map((playlist) => (

          <Link to={`/videoList/playlist/${playlist._id}`} key={playlist._id}>
          <div class="w-full">
            <div class="relative mb-2 w-full pt-[56%]">
              <div class="absolute inset-0">
                <img
                  src={playlist.videos[0]?.thumbnail || noVideos } alt="React Mastery"
                  class="h-full w-full" />
                <div class="absolute inset-x-0 bottom-0">
                  <div class="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                    <div class="relative z-[1]">
                      <p class="flex justify-between">
                        <span class="inline-block">Playlist</span>
                        <span class="inline-block">{playlist.totalVideos} videos</span>
                      </p>
                      <p class="text-sm text-gray-200">{viewsFormatter(playlist.totalViews)} Views · {timeFormatter(playlist.createdAt)} </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h6 class="mb-1 font-semibold">{playlist.name}</h6>
            <p class="flex text-sm text-gray-200">{playlist.description || ""}</p>
          </div>      
        </Link>
        )
      )}
        </div>
      ) : (
      <div class="flex justify-center p-4">
      <div class="w-full max-w-sm text-center">
        <p class="mb-3 w-full">
          <span class="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
            <span class="inline-block w-6">
              <svg
                style={{ width: '100%' }}
                viewBox="0 0 22 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 5L10.8845 2.76892C10.5634 2.1268 10.4029 1.80573 10.1634 1.57116C9.95158 1.36373 9.69632 1.20597 9.41607 1.10931C9.09916 1 8.74021 1 8.02229 1H4.2C3.0799 1 2.51984 1 2.09202 1.21799C1.71569 1.40973 1.40973 1.71569 1.21799 2.09202C1 2.51984 1 3.0799 1 4.2V5M1 5H16.2C17.8802 5 18.7202 5 19.362 5.32698C19.9265 5.6146 20.3854 6.07354 20.673 6.63803C21 7.27976 21 8.11984 21 9.8V14.2C21 15.8802 21 16.7202 20.673 17.362C20.3854 17.9265 19.9265 18.3854 19.362 18.673C18.7202 19 17.8802 19 16.2 19H5.8C4.11984 19 3.27976 19 2.63803 18.673C2.07354 18.3854 1.6146 17.9265 1.32698 17.362C1 16.7202 1 15.8802 1 14.2V5Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"></path>
              </svg>
            </span>
          </span>
        </p>
        <h5 class="mb-2 font-semibold">No playlist created</h5>
        <p>There are no playlist created on this channel.</p>
      </div>
    </div>
    )
  );
};

export default ChannelPlaylist;