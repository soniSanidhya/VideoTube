import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect } from 'react';
import sizeFormatter from '../../Utils/sizeFormatter';

const postVideo = (form) => axios.post('/api/videos' , form);

const VideoModelPopUp = (uploaded) => {
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [isUploading, setIsUploading] = React.useState(false);
    const [isUploaded, setIsUploaded] = React.useState(false);
    const [thumbnail, setThumbnail] = React.useState(null);
    const [video, setVideo] = React.useState(null);
    console.log(uploaded);
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

    const {mutate , isPending , isSuccess} = useMutation({
        mutationFn: (form) => postVideo(form),
        onSuccess: () => {
            
            console.log('Video Uploaded');
        }
    })
    const form = new FormData();
    const handleSubmit = (e) => {
        e.preventDefault();
        
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
        
        console.log(form.get('videoFile'));
        console.log(form.get('videoFile').name);
        console.log(form.get('videoFile').size);
        
        
        
        mutate(form);
    }
    console.log(isPending);
    console.log(isSuccess);
    console.log("video",video);
    

  
      if(isPending){
        console.log('Uploading...');
        
        return <div class="absolute inset-x-0 top-0 z-10 flex h-[calc(100vh-66px)] items-center justify-center bg-black/50 px-4 pb-[86px] pt-4 sm:h-[calc(100vh-82px)] sm:px-14 sm:py-8">
        <div class="w-full max-w-lg overflow-auto rounded-lg border border-gray-700 bg-[#121212] p-4">
          <div class="mb-4 flex items-start justify-between">
            <h2 class="text-xl font-semibold">
              Uploading Video...
              <span class="block text-sm text-gray-300">Track your video uploading process.</span>
            </h2>
            <button class="h-6 w-6">
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
                  d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="mb-6 flex gap-x-2 border p-3">
            <div class="w-8 shrink-0">
              <span class="inline-block w-full rounded-full bg-[#E4D3FF] p-1 text-[#AE7AFF]">
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
                    d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"></path>
                </svg>
              </span>
            </div>
            <div class="flex flex-col">
              <h6>{video?.name}</h6>
              <p class="text-sm">{sizeFormatter(video?.size)}</p>
              <div class="mt-2">
                <svg
                  aria-hidden="true"
                  role="status"
                  class="mr-2 inline-block h-5 w-5 animate-spin text-gray-200"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"></path>
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="#AE7AFF"></path>
                </svg>
                Uploading...
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <button onClick={()=>{ uploaded.uploaded.uploaded();}} class="border px-4 py-3">Cancel</button>
            <button
              class="bg-[#ae7aff] px-4 py-3 text-black disabled:bg-[#E4D3FF]"
              disabled = ""
              >
              Finish
            </button>
          </div>
        </div>
      </div>
      }

   
    if(isSuccess){
        console.log('Uploaded...');
        return  <div class="absolute inset-x-0 top-0 z-10 flex h-[calc(100vh-66px)] items-center justify-center bg-black/50 px-4 pb-[86px] pt-4 sm:h-[calc(100vh-82px)] sm:px-14 sm:py-8">
        <div class="w-full max-w-lg overflow-auto rounded-lg border border-gray-700 bg-[#121212] p-4">
          <div class="mb-4 flex items-start justify-between">
            <h2 class="text-xl font-semibold">
              Uploaded Video
              <span class="block text-sm text-gray-300">Track your video uploading process.</span>
            </h2>
            <button class="h-6 w-6">
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
                  d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="mb-6 flex gap-x-2 border p-3">
            <div class="w-8 shrink-0">
              <span class="inline-block w-full rounded-full bg-[#E4D3FF] p-1 text-[#AE7AFF]">
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
                    d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"></path>
                </svg>
              </span>
            </div>
            <div class="flex flex-col">
            <h6>{video?.name}</h6>
            <p class="text-sm">{sizeFormatter(video?.size)}</p>
              <div class="mt-2 flex items-center">
                <span class="mr-2 inline-block w-6 text-[#ae7aff]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clip-rule="evenodd"></path>
                  </svg>
                </span>
                Uploaded Successfully
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <button onClick={()=>{   uploaded.uploaded();}} class="border px-4 py-3">Cancel</button>
            <button onClick={()=>{  uploaded.uploaded();}} class="bg-[#ae7aff] px-4 py-3 text-black disabled:bg-[#E4D3FF]">Finish</button>
          </div>
        </div>
      </div>
      }

    return (
        <div onClick={(e)=>{
          console.log("newvideo false");
          
          e.stopPropagation() ;
          uploaded.uploaded();
        }}   class="absolute inset-0 md:left-60 md:top-30  z-10 bg-black/50 px-4 pb-[86px] pt-4 sm:px-14 sm:py-8 top-20">
        <div onClick={(e) => {e.stopPropagation()}} class="h-[80%]  overflow-auto border bg-[#121212]">
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