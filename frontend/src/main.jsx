import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import VideoPage from "./components/VideoPages/VideoPage.jsx";
import "./index.css";
import Header from "./components/Header/Header.jsx";
import SidePanel from "./components/SidePanel/SidePanel.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout.jsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import VideoDetailpage from "./components/VideoPages/VideoDetailpage.jsx";
import ChannelVideos from "./components/Channel/ChannelVideos.jsx";
import ChannelLayout from "./components/Channel/ChannelLayout.jsx";
import ChannelPlaylist from "./components/Channel/ChannelPlaylist.jsx";
import ChannelTweet from "./components/Channel/ChannelTweet.jsx";
import ChannelSubcribed from "./components/Channel/ChannelSubcribed.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<VideoPage />} />
      <Route path="watch/:videoId" element={<VideoDetailpage />} />
      <Route path="channel/c/:username" element={<ChannelLayout />}>
        <Route path="" element={<ChannelVideos />} />
        <Route path="videos" element={<ChannelVideos />} />
        <Route path="playlists" element={<ChannelPlaylist/>} />
        <Route path="tweets" element={<ChannelTweet/>} />
        <Route path="subscribed" element={<ChannelSubcribed/>} />
      </Route>
      <Route path="*" element={<div>404</div>} />
    </Route>
  )
);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
