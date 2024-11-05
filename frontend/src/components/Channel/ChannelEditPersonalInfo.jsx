import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const updatePersonalDetails =({fullName , email}) =>  axios.patch("/api/users/update-account" , {fullName , email} )

const ChannelEditPersonalInfo = () => {



  const user = useSelector(state => state.user.currentUser);
  const name = user?.fullName.split(" ");
  const [firstName , setFirstName] = useState( name[0] || "");
  const [lastName , setLastName] = useState(name[1] ||"");
  const [email , setEmail] = useState(user?.email || "");

  console.log(firstName , lastName , email);
  const queryClient = useQueryClient();
  const {mutate , isError , error} = useMutation(
    {
      mutationFn  : ({fullName , email}) => updatePersonalDetails({fullName , email}),
      onSuccess : (data) => {
        queryClient.invalidateQueries(["channel" , user?.username]);
        console.log(data);}
    }
  )

  const notify = (error) => toast(error);

  if (isError) {
      notify(error.response.data.message);
  }

    return (
        <div className="flex flex-wrap justify-center gap-y-4 py-4">
        <div className="w-full sm:w-1/2 lg:w-1/3">
          <h5 className="font-semibold">Personal Info</h5>
          <p className="text-gray-300">Update your photo and personal details.</p>
        </div>
        <div className="w-full sm:w-1/2 lg:w-2/3">
          <div className="rounded-lg border">
            <div className="flex flex-wrap gap-y-4 p-4">
              <div className="w-full lg:w-1/2 lg:pr-2">
                <label
                  htmlFor="firstname"
                  className="mb-1 inline-block">
                  First name
                </label>
                <input
                onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  className="w-full rounded-lg border bg-transparent px-2 py-1.5"
                  id="firstname"
                  placeholder="Enter first name"
                  value={firstName} />
              </div>
              <div className="w-full lg:w-1/2 lg:pl-2">
                <label
                  htmlFor="lastname"
                  className="mb-1 inline-block">
                  Last name
                </label>
                <input
                onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  className="w-full rounded-lg border bg-transparent px-2 py-1.5"
                  id="lastname"
                  placeholder="Enter last name"
                  value={lastName} />
              </div>
              <div className="w-full">
                <label
                  for="lastname"
                  className="mb-1 inline-block">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path>
                    </svg>
                  </div>
                  <input
                  onChange={(e)=>{setEmail(e.target.value)}}
                    type="email"
                    className="w-full rounded-lg border bg-transparent py-1.5 pl-10 pr-2"
                    id="lastname"
                    placeholder="Enter email address"
                    value={user?.email} />
                </div>
              </div>
            </div>
            <hr className="border border-gray-300" />
            <div className="flex items-center justify-end gap-4 p-4">
              <button className="inline-block rounded-lg border px-3 py-1.5 hover:bg-white/10">Cancel</button>
              <button onClick={()=>{mutate({fullName : firstName + ( lastName.length > 0 ? " " + lastName : "") , email})}} className="inline-block bg-[#ae7aff] px-3 py-1.5 text-black">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    );
};

export default ChannelEditPersonalInfo;