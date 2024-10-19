import { useQueries } from '@tanstack/react-query';
import axios from 'axios';

const fetchVideo = (videoId) => {
    return axios.get(`/api/videos/v/${videoId}`);
  };
  
  const fetchComments = (videoId) => {
    return axios.get(`/api/comments/${videoId}`);
  };
  
  const fetchLikes = (videoId) => (
    axios.get(`/api/likes/getLikes/${videoId}`)
  )
  
  const fetchDisLikes = (videoId) => (
    axios.get(`/api/likes/getDisLikes/${videoId}`)
  )

export const useCombinedVideoData = (videoId) => {
  const queryFunctions = [fetchVideo, fetchComments, fetchLikes, fetchDisLikes];
  const queryKeys = ['video', 'comments', 'likes', 'dislikes'];

  const combinedQueries = useQueries({
    queries: queryFunctions.map((queryFn, index) => ({
      queryKey: [queryKeys[index], videoId],
      queryFn: () => queryFn(videoId),
    })),
    combine: (results) => {
      return {
        data: {
          video: results[0].data?.data,
          comments: results[1].data?.data,
          likes: results[2].data?.data,
          dislikes: results[3].data?.data,
        },
        isLoading: results.some((result) => result.isLoading),
        isError: results.some((result) => result.isError),
        error: results.find((result) => result.error)?.error,
      };
    },
  });

  return combinedQueries;
};