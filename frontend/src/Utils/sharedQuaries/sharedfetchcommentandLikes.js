import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchLikes = (videoId) => (
  axios.get(`/api/likes/getLikes/${videoId}`)
)

const fetchDisLikes = (videoId) => (
  axios.get(`/api/likes/getDisLikes/${videoId}`)
)

const fetchComments = (videoId) => (
  axios.get(`/api/comments/${videoId}`)
)
const useFetchLikesAndDislikes = (videoId , enabled = false)=>{
  const {data : like , isError : isErrorinLike , refetch} = useQuery({
    queryKey : ["likes" , videoId],
    queryFn : ()=>fetchLikes(videoId),
    staleTime : 1000 * 60 * 2,
    enabled
  });

  const {data : dislikes , isError : isErrorinDisLikes} = useQuery({
    queryKey : ["dislikes" , videoId],
    queryFn : ()=>fetchDisLikes(videoId),
    staleTime : 1000 * 60 * 2
  });

  const data = {
    like : like?.data,
    dislikes : dislikes?.data
  }
  const isError = isErrorinLike || isErrorinDisLikes;

  return {data , isError , refetch};
}

const useFetchComments = (videoId)=>{
  return useQuery({
    queryKey : ["comments" , videoId],
    queryFn : ()=>fetchComments(videoId),
    staleTime : 1000 * 60 * 2
  })
}

export  {useFetchLikesAndDislikes , useFetchComments};