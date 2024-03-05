import axios from "axios";
import { VITE_TMDB_API_TOKEN, VITE_BACKEND_URL } from "@env";

const instanceTmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${VITE_TMDB_API_TOKEN}`,
  },
});

export const instanceAPI = axios.create({
  baseURL: VITE_BACKEND_URL,
  withCredentials: true,
});

export default instanceTmdb;
