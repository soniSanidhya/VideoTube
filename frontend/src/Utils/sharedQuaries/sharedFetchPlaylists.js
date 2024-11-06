import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "../axiosHelper";

const fetchChannelPlaylist = async (username) => {
    api.get(`/api/playlists/user/${username}`);
  }

export const useFetchPlaylists = (username) => {
    return useQuery({
        queryKey: ['channelPlaylist', username],
        queryFn: () => fetchChannelPlaylist(username),
        staleTime: 1000 * 60 * 5
      })
    
}