import axios from "axios";
import {
  EXPO_TMDB_API_TOKEN,
  EXPO_BACKEND_URL_ANDROID,
  EXPO_BACKEND_URL_IOS,
  EXPO_BACKEND_URL,
  EXPO_ENV,
} from "@env";
import { Platform } from "react-native";

const instanceTmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${EXPO_TMDB_API_TOKEN}`,
  },
});

export const instanceAPI = axios.create({
  baseURL:
    EXPO_ENV === "PROD"
      ? EXPO_BACKEND_URL
      : Platform.OS === "ios"
        ? EXPO_BACKEND_URL_IOS
        : EXPO_BACKEND_URL_ANDROID,
  withCredentials: true,
});

export default instanceTmdb;
