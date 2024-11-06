import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import api from "../axiosHelper";

const fetchVideos = () => {
    return api.get("/api/videos" );
    
}
// return axios.get("https://video-tube-eight.vercel.apphttps://video-tube-eight.vercel.app/api/videos" );

export const useSharedVideoQuery = () => {
    return useQuery({
        queryKey: ["videos"],
        queryFn: fetchVideos,
        staleTime: 1000 * 60 * 2,
    });
}