import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchChannelPlaylist = async (username) => {
    return axios.get(`/api/playlists/user/${username}`);
  }

export const useFetchPlaylists = (username) => {
    return useQuery({
        queryKey: ['channelPlaylist', username],
        queryFn: () => fetchChannelPlaylist(username),
        staleTime: 1000 * 60 * 5
      })
    
}