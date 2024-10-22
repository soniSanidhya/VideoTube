import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import viewsFormatter from '../../Utils/viewsFormatter';
import { useSelector } from 'react-redux';

const postSubcribe = (channelId) =>
  axios.post(`/api/subscriptions/c/${channelId}`);

const fetchSubscribedTo = (userId) => axios.get(`/api/subscriptions/u/${userId}`);

const SubscribedTo = () => {



const user = useSelector((state) => state.user.currentUser); 
// console.log(user);

  const queryClient = useQueryClient();
  const { mutate: postSubcribeMutation } = useMutation({
    mutationFn: (channelId) => postSubcribe(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries([
        "channel",
        user._id,
      ]);
      console.log("subscribed");
    },
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey : ["userSubcribedTo" , user._id],
    queryFn : () => fetchSubscribedTo(user._id)
  }
  );
  console.log(data);
  
    return (
      data?.data?.data?.length ? (
        <section class="w-full px-4 pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        <div class="flex flex-col gap-y-4 py-4">
        <div class="relative mb-2 rounded-lg bg-white py-2 pl-8 pr-3 text-black">
          <span class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              aria-hidden="true"
              class="h-5 w-5">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
            </svg>
          </span>
          <input
            class="w-full bg-transparent outline-none"
            placeholder="Search" />
        </div>
        { data?.data?.data?.map((subscriber) =>
          <div class="flex w-full justify-between">
          <div class="flex items-center gap-x-2">
            <div class="h-14 w-14 shrink-0">
              <img
                src={subscriber.avatar}
                alt={subscriber.username}
                class="h-full w-full rounded-full" />
            </div>
            <div class="block">
              <h6 class="font-semibold">{subscriber.fullName}</h6>
              <p class="text-sm text-gray-300">{viewsFormatter(subscriber.subcriberCount)} Subscribers</p>
            </div>
          </div>
          <div class="block">
            <button onClick={()=>{postSubcribeMutation(subscriber._id)}}  class={ subscriber.isSubscribed ?  "group/btn px-3 py-2 text-black bg-[#ae7aff] " : "group/btn px-3 py-2 text-black bg-white"}>
              { subscriber.isSubscribed ? <span class="">Subscribed</span> : <span class="">Subscribe</span>}
            </button>
          </div>
        </div>
        )}
        
      </div>
      </section>
      ) : (
        <section class="w-full px-4 pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">

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
                  class="w-6">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"></path>
                </svg>
              </span>
            </span>
          </p>
          <h5 class="mb-2 font-semibold">No people subscribers</h5>
          <p>
            This channel has yet to
            <strong>subscribe</strong>
            a new channel.
          </p>
        </div>
      </div>
      </section>
    )
    );
};

export default SubscribedTo;