import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

import {
  EXPO_FIREBASE_API_KEY,
  EXPO_FIREBASE_AUTH_DOMAIN,
  EXPO_FIREBASE_PROJECT_ID,
  EXPO_FIREBASE_STORAGE_BUCKET,
  EXPO_FIREBASE_MESSAGE_SENDER_ID,
  EXPO_FIREBASE_APP_ID,
} from "@env";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: EXPO_FIREBASE_API_KEY,
  authDomain: EXPO_FIREBASE_AUTH_DOMAIN,
  projectId: EXPO_FIREBASE_PROJECT_ID,
  storageBucket: EXPO_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: EXPO_FIREBASE_MESSAGE_SENDER_ID,
  appId: EXPO_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);
export default storage;
