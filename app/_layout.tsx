import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "react-native-reanimated";
import "react-native-gesture-handler";
import { AuthProvider } from "@/app/context/AuthContext";
import { GenreProvider } from "@/app/context/GenreContext";
import { ViewProvider } from "@/app/context/ViewContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Toasts } from "@backpackapp-io/react-native-toast";
import AbrilFatface_Regular from "@/assets/fonts/AbrilFatface-Regular.ttf";
import DelaGothicOne_Regular from "@/assets/fonts/DelaGothicOne-Regular.ttf";
import FiraSans_Regular from "@/assets/fonts/FiraSans-Regular.ttf";
import FiraSans_Italic from "@/assets/fonts/FiraSans-Italic.ttf";
import FiraSans_Thin from "@/assets/fonts/FiraSans-Thin.ttf";
import FiraSans_ThinItalic from "@/assets/fonts/FiraSans-ThinItalic.ttf";
import FiraSans_Light from "@/assets/fonts/FiraSans-Light.ttf";
import FiraSans_LightItalic from "@/assets/fonts/FiraSans-LightItalic.ttf";
import FiraSans_Medium from "@/assets/fonts/FiraSans-Medium.ttf";
import FiraSans_MediumItalic from "@/assets/fonts/FiraSans-MediumItalic.ttf";
import FiraSans_Bold from "@/assets/fonts/FiraSans-Bold.ttf";
import FiraSans_BoldItalic from "@/assets/fonts/FiraSans-BoldItalic.ttf";
import { useColorScheme } from "react-native";
import { ThemeProvider } from "@/app/context/ThemeContext";
import { WatchlistProvider } from "@/app/context/WatchlistContext";
import CloseModal from "@/components/action/CloseModal";
import { BannerProvider } from "./context/BannerContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RouterHistoryProvider } from "./context/RouterHistoryContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    "AbrilFatface-Regular": AbrilFatface_Regular,
    "DelaGothicOne-Regular": DelaGothicOne_Regular,
    "FiraSans-Regular": FiraSans_Regular,
    "FiraSans-Italic": FiraSans_Italic,
    "FiraSans-Thin": FiraSans_Thin,
    "FiraSans-ThinItalic": FiraSans_ThinItalic,
    "FiraSans-Light": FiraSans_Light,
    "FiraSans-LightItalic": FiraSans_LightItalic,
    "FiraSans-Medium": FiraSans_Medium,
    "FiraSans-MediumItalic": FiraSans_MediumItalic,
    "FiraSans-Bold": FiraSans_Bold,
    "FiraSans-BoldItalic": FiraSans_BoldItalic,
  });

  const darkTheme = useColorScheme() === "dark";

  if (!fontsLoaded) return null;
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterHistoryProvider>
          <GenreProvider>
            <BannerProvider>
              <WatchlistProvider>
                <ViewProvider>
                  <BottomSheetModalProvider>
                    <GestureHandlerRootView
                      style={{ height: "100%", width: "100%" }}
                    >
                      <RootLayout />
                    </GestureHandlerRootView>
                    <Toasts overrideDarkMode={!darkTheme} />
                  </BottomSheetModalProvider>
                </ViewProvider>
              </WatchlistProvider>
            </BannerProvider>
          </GenreProvider>
        </RouterHistoryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modals)/login"
        options={{
          title: "",
          headerTransparent: true,
          presentation: "modal",
          headerRight: () => <CloseModal />,
        }}
      />
      <Stack.Screen
        name="(modals)/register"
        options={{
          title: "",
          headerTransparent: true,
          presentation: "modal",
          headerRight: () => <CloseModal />,
        }}
      />
      <Stack.Screen
        name="(modals)/forgot"
        options={{
          title: "",
          headerTransparent: true,
          presentation: "modal",
          headerRight: () => <CloseModal />,
        }}
      />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}
