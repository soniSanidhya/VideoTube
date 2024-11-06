import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../../Utils/axiosHelper";
const patchVideo = ({form , videoId})=> api.patch(`/api/videos/v/${videoId}`, form);

const EditVideoPopup = ({ video }) => {

  const [thumbnail, setThumbnail] = useState();
  const [title, setTitle] = useState(video?.editVideoDetails.title);
  const [description, setDescription] = useState(video?.editVideoDetails.description);

  const form = new FormData();
  const handleSubmit = (e) => {
    e.preventDefault();
    form.append("thumbnail", thumbnail);
    form.append("title", title);
    form.append("description", description);

    // console.log("FORMDATA", form.get("title"));
    updateVideoMutation({form, videoId : video.editVideoDetails._id});
  }
  
  const {mutate : updateVideoMutation} = useMutation({
    mutationFn: ({videoId , form})=> patchVideo({form, videoId}),
    onSuccess: (data)=>{
      toast.success("Video Updated Successfully");
      // console.log("SUCCESS", data);
    },
  })

  // console.log("EDITFN", video);

  return (
    <div className=" absolute inset-0 top-[calc(66px)] z-10 flex flex-col bg-black/50 px-4 pb-[86px] pt-4 sm:top-[calc(82px)] sm:px-14 sm:py-8">
      <div className="mx-auto w-full max-w-lg overflow-auto rounded-lg border border-gray-700 bg-[#121212] p-4">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-xl font-semibold">
            Edit Video
            <span className="block text-sm text-gray-300">
              Share where you&#x27;ve worked on your profile.
            </span>
          </h2>
          <button onClick={()=>{video.edited()}} className="h-6 w-6">
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
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <label htmlFor="thumbnail" className="mb-1 inline-block">
          Thumbnail
          <sup>*</sup>
        </label>
        <label
          className="relative mb-4 block cursor-pointer border border-dashed p-2 after:absolute after:inset-0 after:bg-transparent hover:after:bg-black/10"
          htmlFor="thumbnail"
        >
          <input onChange={(e)=>{setThumbnail(e.target.value)}} type="file" className="sr-only" id="thumbnail" />
          <img
            src={video?.editVideoDetails.thumbnail}
            alt={video?.editVideoDetails.title}
          />
        </label>
        <div className="mb-6 flex flex-col gap-y-4">
          <div className="w-full">
            <label htmlFor="title" className="mb-1 inline-block">
              Title
              <sup>*</sup>
            </label>
            <input
              onChange={(e)=>{setTitle(e.target.value)}}
              id="title"
              type="text"
              className="w-full border bg-transparent px-2 py-1 outline-none"
              value={title}
            />
          </div>
          <div className="w-full">
            <label htmlFor="desc" className="mb-1 inline-block">
              Description
              <sup>*</sup>
            </label>
            <textarea
              onChange={(e)=>{setDescription(e.target.value)}}
              id="desc"
              className="h-40 w-full resize-none border bg-transparent px-2 py-1 outline-none"
            >
              {video.editVideoDetails.description}
            </textarea>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={()=>{ video.edited() }} className="border px-4 py-3">Cancel</button>
          <button onClick={handleSubmit} className="bg-[#ae7aff] px-4 py-3 text-black disabled:bg-[#E4D3FF]">
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditVideoPopup;
