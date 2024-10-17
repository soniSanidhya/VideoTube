import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const fetchLikes = (postId) => {
  return axios.get(`/api/likes/${postId}`);
};

const toggleLike = (postId , post) => {
  return axios.post(`/api/like/toggle/${post}/${postId}`);
};

const getLikes = (postId) => {
    return useQuery({
      queryKey: ["likes", postId],
      queryFn: ()=> fetchLikes(postId),
      staleTime: 1000 * 60 * 2,
    });
  };

  const toggleLikes = (postId , post) => {
    return useQuery({
      queryKey: ["toggleLikes", postId],
      queryFn: ()=> toggleLike(postId , post),
      enabled: false,
    });
  }

  export {getLikes , toggleLikes}


