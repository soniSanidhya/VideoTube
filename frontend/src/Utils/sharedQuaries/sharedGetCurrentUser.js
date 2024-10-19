import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getCurrentUser = () => axios.get("/api/users/current-user");

export const useGetCurrentUser = (isLogin) => useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: isLogin,
  })
