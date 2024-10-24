import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import viewsFormatter from "../../Utils/viewsFormatter";
import { useSelector } from "react-redux";

const postSubcribe = (channelId) =>
  axios.post(`/api/subscriptions/c/${channelId}`);

const fetchSubscribedTo = (userId) =>
  axios.get(`/api/subscriptions/u/${userId}`);

const SubscribedTo = () => {
  const isLogin = useSelector((state) => state.auth.isLogin);
  const [search, setSearch] = useState("");
  const [mainData, setMainData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const user = useSelector((state) => state.user.currentUser);
  // // console.log(user);

  const queryClient = useQueryClient();
  const { mutate: postSubcribeMutation } = useMutation({
    mutationFn: (channelId) => postSubcribe(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries(["channel", user._id]);
      // console.log("subscribed");
    },
  });

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["userSubcribedTo", user._id],
    queryFn: () => fetchSubscribedTo(user._id),
  });

    useEffect(() => {
      if (data) {
        setMainData(data.data.data);
        setFilteredData(data.data.data);
      }
    }, [data]);

  useEffect(() => {
    if (search !== "") {
      // console.log(search);
      setFilteredData(
        mainData.filter((subscriber) =>
          subscriber.fullName.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      // console.log("no search");
      if (isSuccess) {
        setFilteredData(mainData);
      }
    }
  }, [search, mainData, isSuccess]);
  

  // console.log(data);

  return isLogin ? (
    data?.data?.data?.length ? (
      <section className="w-full px-4 pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        <div className="flex flex-col gap-y-4 py-4">
          <div className="relative mb-2 rounded-lg bg-white py-2 pl-8 pr-3 text-black">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
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
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                ></path>
              </svg>
            </span>
              <input type="text" 
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none"
              placeholder="Search"
            />
          </div>
          {filteredData?.map((subscriber) => (
            <div key={subscriber._id} className="flex w-full justify-between">
              <div className="flex items-center gap-x-2">
                <div className="h-14 w-14 shrink-0">
                  <img
                    src={subscriber.avatar}
                    alt={subscriber.username}
                    className="h-full w-full rounded-full"
                  />
                </div>
                <div className="block">
                  <h6 className="font-semibold">{subscriber.fullName}</h6>
                  <p className="text-sm text-gray-300">
                    {viewsFormatter(subscriber.subcriberCount)} Subscribers
                  </p>
                </div>
              </div>
              <div className="block">
                <button
                  onClick={() => {
                    postSubcribeMutation(subscriber._id);
                  }}
                  className={
                    subscriber.isSubscribed
                      ? "group/btn px-3 py-2 text-black bg-[#ae7aff] "
                      : "group/btn px-3 py-2 text-black bg-white"
                  }
                >
                  {subscriber.isSubscribed ? (
                    <span className="">Subscribed</span>
                  ) : (
                    <span className="">Subscribe</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    ) : (
      <section className="w-full px-4 pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
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
            <h5 className="mb-2 font-semibold">No people subscribers</h5>
            <p>
              This channel has yet to
              <strong>subscribe</strong>a new channel.
            </p>
          </div>
        </div>
      </section>
    )
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

export default SubscribedTo;
