import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getCurrentUser = () => axios.get("https://video-tube-eight.vercel.app/api/users/current-user" , {
  withCredentials: true,
});

export const useGetCurrentUser = (isLogin) => useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: isLogin,
    staleTime : 1000*60*5
  })
