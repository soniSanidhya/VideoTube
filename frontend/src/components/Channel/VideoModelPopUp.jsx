import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';

const postVideo = (form) => axios.post('/api/videos' , form);

const VideoModelPopUp = () => {
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');

    const [thumbnail, setThumbnail] = React.useState(null);
    const [video, setVideo] = React.useState(null);

    const handleTitle = (e) => {
        setTitle(e.target.value);
    }
    const handleDescription = (e) => {
        setDescription(e.target.value);
    }
    const handleThumbnail = (e) => {
        setThumbnail(e.target.files[0]);
    }

    const handleVideo = (e) => {
        setVideo(e.target.files[0]);
    }

    const {mutate} = useMutation({
        mutationFn: (form) => postVideo(form),
        onSuccess: () => {
            
            console.log('Video Uploaded');
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('title',title);
        form.append('description', description);
        form.append('thumbnail', thumbnail);
        form.append('videoFile', video);
        console.log( "form" ,
            title,
            description,
            thumbnail,
            video
        );
        
        console.log(form);
        
        mutate(form);
    }
    return (
        <div class="absolute inset-0 md:left-60 md:top-30  z-10 bg-black/50 px-4 pb-[86px] pt-4 sm:px-14 sm:py-8 top-20">
        <div class="h-[80%]  overflow-auto border bg-[#121212]">
            <form onSubmit={handleSubmit} >
          <div class="flex items-center justify-between border-b p-4">
            <h2 class="text-xl font-semibold">Upload Videos</h2>
            <button
                type="submit"
              class="group/btn mr-1 flex w-auto items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]">
              Save
            </button>
          </div>
          <div class="mx-auto flex w-full max-w-3xl flex-col gap-y-4 p-4">
            <div class="w-full border-2 border-dashed px-4 py-12 text-center">
              <span class="mb-4 inline-block w-24 rounded-full bg-[#E4D3FF] p-4 text-[#AE7AFF]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"></path>
                </svg>
              </span>
              <h6 class="mb-2 font-semibold">Drag and drop video files to upload</h6>
              <p class="text-gray-400">Your videos will be private untill you publish them.</p>
              <label
                for="upload-video"
                class="group/btn mt-4 inline-flex w-auto cursor-pointer items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]">
                <input
                onChange={handleVideo}
                  type="file"
                  id="upload-video"
                  class="sr-only" />
                Select Files
              </label>
            </div>
            <div class="w-full">
              <label
                for="thumbnail"
                class="mb-1 inline-block">
                Thumbnail
                <sup>*</sup>
              </label>
              <input
              onChange={handleThumbnail}
                id="thumbnail"
                type="file"
                class="w-full border p-1 file:mr-4 file:border-none file:bg-[#ae7aff] file:px-3 file:py-1.5" />
            </div>
            <div class="w-full">
              <label
                for="title"
                class="mb-1 inline-block">
                Title
                <sup>*</sup>
              </label>
              <input
                onChange={handleTitle}
                id="title"
                type="text"
                name="title"
                class="w-full border bg-transparent px-2 py-1 outline-none" />
                
            </div>
            <div class="w-full">
              <label
                for="desc"

                class="mb-1 inline-block">
                Description
                <sup>*</sup>
              </label>
              <textarea
              onChange={handleDescription}
                id="desc"
                name='description'
                class="h-40 w-full resize-none border bg-transparent px-2 py-1 outline-none"></textarea>
            </div>
          </div>
          </form>
        </div>
      </div>
    );
};

export default VideoModelPopUp;