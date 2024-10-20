import React, { useEffect } from "react";
import Header from "./components/Header/Header";
import { Outlet } from "react-router-dom";
import SidePanel from "./components/SidePanel/SidePanel";
import { useGetCurrentUser } from "./Utils/sharedQuaries/sharedGetCurrentUser";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "./Utils/functionalties/currentUserSlice";
import { login } from "./Utils/functionalties/isLoginSlice";

const Layout = () => {

    const isLogin = useSelector((state) => state.auth.isLogin);
    const { data } = useGetCurrentUser(true);
    const dispatch = useDispatch();
    useEffect(() => {
        console.log("data from layout", data);
        if (data) {
            dispatch(login());
            dispatch(setCurrentUser(data.data.data));
        }
    }, [data]);

  return (
    <>
      <div class="h-screen overflow-y-auto bg-[#121212] text-white">
        <Header />
        <div class=" flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
          <SidePanel />
          <Outlet />
          </div>
      </div>
    </>
  );
};

export default Layout;
