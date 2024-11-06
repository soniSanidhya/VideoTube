import axios from 'axios';

const api = axios.create({
  baseURL: 'https://video-tube-eight.vercel.app',  // Your backend URL
  withCredentials: true  // Sets withCredentials for all requests
});

export default api;
