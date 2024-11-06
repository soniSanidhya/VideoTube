import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchVideos = () => {
    return axios.get("/api/videos" , { withCredentials: true });
}

export const useSharedVideoQuery = () => {
    return useQuery({
        queryKey: ["videos"],
        queryFn: fetchVideos,
        staleTime: 1000 * 60 * 2,
    });
}