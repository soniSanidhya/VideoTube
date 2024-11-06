import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "../axiosHelper";

const fetchChannelDetails = (username) => {
    return api.get(`/api/users/channel/${username}`);
  };

  const usesharedFetchChannelDetails = (username) => {
    return useQuery({
        queryKey: ["channel", username],
        queryFn: () => fetchChannelDetails(username),
        staleTime: 1000 * 60 * 5,
      });
  };

  export { usesharedFetchChannelDetails };