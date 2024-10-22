import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import errorFormatter from '../../Utils/errorFormatter';

const updatePassword = ({oldPassword , newPassword}) => axios.patch("/api/users/changePassword" , {oldPassword , newPassword});

const ChannelChangePassword = () => {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    console.log(oldPassword , newPassword , confirmPassword);
    
    const {mutate , isError , error} = useMutation(
        {
            mutationFn : ({oldPassword , newPassword}) => updatePassword({oldPassword , newPassword}),
            onSuccess : (data) => {
              toast.success("Password changed successfully" , {toastId : "passwordSuccess"});
                console.log("changed");
            },
            onError : (error) => {
              toast.error(errorFormatter(error) , { toastId : "passwordError"});
            }
        }
    )
   



    const checks = ()=>{
      if (oldPassword.length < 4 || newPassword.length < 4 || confirmPassword.length < 4) {
        toast.error("Password must be more than 4 characters" , {toastId : "passwordError"});
        return false;
    }
    if (newPassword !== confirmPassword) {
        toast.error("Password does not match" , {toastId : "passwordError"});
        return false;

    }
    if (newPassword === oldPassword) {
        toast.error("New password must be different from old password" , {toastId : "passwordError"});
        return false;

    }
    return true;
    }



    return (
        <div class="flex flex-wrap justify-center gap-y-4 py-4">

        <div class="w-full sm:w-1/2 lg:w-1/3">
          <h5 class="font-semibold">Password</h5>
          <p class="text-gray-300">Please enter your current password to change your password.</p>
        </div>
        <div class="w-full sm:w-1/2 lg:w-2/3">
          <div class="rounded-lg border">
            <div class="flex flex-wrap gap-y-4 p-4">
              <div class="w-full">
                <label
                  class="mb-1 inline-block"
                  for="old-pwd">
                  Current password
                </label>
                <input
                    onChange={(e) => setOldPassword(e.target.value)}
                  type="password"
                  class="w-full rounded-lg border bg-transparent px-2 py-1.5"
                  id="old-pwd"
                  placeholder="Current password" />
              </div>
              <div class="w-full">
                <label
                  class="mb-1 inline-block"
                  for="new-pwd">
                  New password
                </label>
                <input
                onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                  class="w-full rounded-lg border bg-transparent px-2 py-1.5"
                  id="new-pwd"
                  placeholder="New password" />
                <p class="mt-0.5 text-sm text-gray-300">Your new password must be more than 8 characters.</p>
              </div>
              <div class="w-full">
                <label
                  class="mb-1 inline-block"
                  for="cnfrm-pwd">
                  Confirm password
                </label>
                <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  class="w-full rounded-lg border bg-transparent px-2 py-1.5"
                  id="cnfrm-pwd"
                  placeholder="Confirm password" />
              </div>
            </div>
            <hr class="border border-gray-300" />
            <div class="flex items-center justify-end gap-4 p-4">
              <button class="inline-block rounded-lg border px-3 py-1.5 hover:bg-white/10">Cancel</button>
              <button onClick={()=>{
                checks() && mutate({oldPassword , newPassword});
              }} class="inline-block bg-[#ae7aff] px-3 py-1.5 text-black">Update Password</button>
            </div>
          </div>
        </div>
        </div>
    );
};

export default ChannelChangePassword;