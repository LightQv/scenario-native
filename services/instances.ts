import axios from "axios";
import {
  VITE_TMDB_API_TOKEN,
  VITE_BACKEND_URL_IOS,
  VITE_BACKEND_URL_ANDROID,
} from "@env";
import { Platform } from "react-native";

const instanceTmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${VITE_TMDB_API_TOKEN}`,
  },
});

export const instanceAPI = axios.create({
  baseURL:
    Platform.OS === "ios" ? VITE_BACKEND_URL_IOS : VITE_BACKEND_URL_ANDROID,
  withCredentials: true,
});

export default instanceTmdb;
