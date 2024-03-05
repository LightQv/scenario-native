import React, { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Redirect, SplashScreen, Stack } from "expo-router";
import { instanceAPI } from "@/services/instances";

SplashScreen.preventAutoHideAsync();

//--- Verify if User's Logged in, if not, redirect to Sign-in ---//
const AppLayout = () => {
  const { authState, onExpired } = useAuth();

  useEffect(() => {
    if (!authState?.loading) {
      SplashScreen.hideAsync();
    }
  }, [authState?.loading]);

  if (authState?.loading) {
    return null;
  }

  //--- Logout in case of 403 error ---//
  instanceAPI.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 403) {
        onExpired!();
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  );

  if (!authState?.authenticated) {
    return <Redirect href={"/sign-in"} />;
  }

  return (
    <Stack>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen
        name="details/[id]"
        options={{ headerTitle: "", headerTransparent: true }}
      />
    </Stack>
  );
};

export default AppLayout;
