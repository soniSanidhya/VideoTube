import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchChannelDetails = (username) => {
    return axios.get(`https://video-tube-eight.vercel.app/api/users/channel/${username}`);
  };

  const usesharedFetchChannelDetails = (username) => {
    return useQuery({
        queryKey: ["channel", username],
        queryFn: () => fetchChannelDetails(username),
        staleTime: 1000 * 60 * 5,
      });
  };

  export { usesharedFetchChannelDetails };