import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "../axiosHelper";

const getCurrentUser = () => api.get("/api/users/current-user" , {
  withCredentials: true,
});

export const useGetCurrentUser = (isLogin) => useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: isLogin,
    staleTime : 1000*60*5
  })
