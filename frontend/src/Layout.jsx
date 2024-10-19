import React, { useEffect } from "react";
import Header from "./components/Header/Header";
import { Outlet } from "react-router-dom";
import SidePanel from "./components/SidePanel/SidePanel";
import VideoPage from "./components/VideoPages/VideoPage";

const Layout = () => {

  useEffect(() => {
    console.log("Page refreshed");
    
  }, []);

  return (
    <>
      <div class="h-screen overflow-y-auto bg-[#121212] text-white">
        <Header />
        <div class="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
          <SidePanel />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
