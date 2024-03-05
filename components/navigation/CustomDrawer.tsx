import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import i18n from "@/services/i18n";
import { router, useNavigation, useSegments } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import { BUTTON, FONTS, SIZING } from "@/constants/theme";
import { useThemeContext } from "@/app/context/ThemeContext";
import StatSvg from "@/assets/svg/stats-up-square.svg";
import MovieViewSvg from "@/assets/svg/movie.svg";
import TvViewSvg from "@/assets/svg/modern-tv.svg";
import SettingsSvg from "@/assets/svg/settings.svg";
import LightSvg from "@/assets/svg/sun-light.svg";
import DarkSvg from "@/assets/svg/half-moon.svg";
import useStyle from "@/hooks/useStyle";
import { useRouterHistory } from "@/app/context/RouterHistoryContext";
import { useDrawerStatus } from "@react-navigation/drawer";

export default function CustomDrawer(props: any) {
  const { user } = useAuth();
  const { THEME, darkTheme } = useThemeContext();
  const { setHistory } = useRouterHistory();
  const routes = useNavigation().getState().routeNames;
  const pathname = useSegments();
  const drawerStatus = useDrawerStatus();
  const { backgroundPrimary, colorPrimary, borderTopAlt, borderBottomAlt } =
    useStyle();

  //--- Store last pathname to HistoryContext when navigate from Tabs Navigator to Profile Navigator ---//
  /* This is workaround until a native method from Expo Router is released */
  useEffect(() => {
    if (
      pathname.length > 0 &&
      routes.some((el) => el === "details/[id]") &&
      drawerStatus === "open"
    ) {
      setHistory!(`/${pathname.join("/")}`);
    }
  }, [drawerStatus]);

  return (
    <DrawerContentScrollView
      {...props}
      style={[backgroundPrimary]}
      contentContainerStyle={styles.drawerContainer}
      scrollEnabled={false}
    >
      <View style={styles.headerContainer}>
        <Text style={[styles.header, colorPrimary]}>
          {`Hey, ${user?.username as string}`}
        </Text>
      </View>
      <View style={[styles.drawerItemContainer, borderTopAlt, borderBottomAlt]}>
        <DrawerItem
          icon={() => (
            <StatSvg
              width={SIZING.navigation.icon}
              height={SIZING.navigation.icon}
              color={THEME?.color.primary}
            />
          )}
          label={i18n.t("navigation.drawer.link1")}
          labelStyle={[styles.label, colorPrimary]}
          style={{
            marginHorizontal: -SIZING.margin.horizontal / 2,
          }}
          onPress={() => router.push("profile")}
          pressOpacity={BUTTON.opacity}
        />
        <DrawerItem
          icon={() => (
            <MovieViewSvg
              width={SIZING.navigation.icon}
              height={SIZING.navigation.icon}
              color={THEME?.color.primary}
            />
          )}
          label={i18n.t("navigation.drawer.link2")}
          labelStyle={[styles.label, colorPrimary]}
          style={{
            marginHorizontal: -SIZING.margin.horizontal / 2,
          }}
          onPress={() =>
            router.push({
              pathname: "profile/[type]",
              params: { type: "movie" },
            })
          }
          pressOpacity={BUTTON.opacity}
        />
        <DrawerItem
          icon={() => (
            <TvViewSvg
              width={SIZING.navigation.icon}
              height={SIZING.navigation.icon}
              color={THEME?.color.primary}
            />
          )}
          label={i18n.t("navigation.drawer.link3")}
          labelStyle={[styles.label, colorPrimary]}
          style={{
            marginHorizontal: -SIZING.margin.horizontal / 2,
          }}
          onPress={() =>
            router.push({ pathname: "profile/[type]", params: { type: "tv" } })
          }
          pressOpacity={BUTTON.opacity}
        />
        <DrawerItem
          icon={() => (
            <SettingsSvg
              width={SIZING.navigation.icon}
              height={SIZING.navigation.icon}
              color={THEME?.color.primary}
            />
          )}
          label={i18n.t("navigation.drawer.link4")}
          labelStyle={[styles.label, colorPrimary]}
          style={{
            marginHorizontal: -SIZING.margin.horizontal / 2,
          }}
          onPress={() => router.push("profile/settings")}
          pressOpacity={BUTTON.opacity}
        />
      </View>

      <View style={styles.footerContainer}>
        {darkTheme ? (
          <DarkSvg
            width={SIZING.navigation.icon}
            height={SIZING.navigation.icon}
            color={THEME?.color.primary}
          />
        ) : (
          <LightSvg
            width={SIZING.navigation.icon}
            height={SIZING.navigation.icon}
            color={THEME?.color.primary}
          />
        )}
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    marginHorizontal: SIZING.margin.horizontal * 1.5,
  },
  headerContainer: {
    paddingTop: SIZING.margin.vertical * 2,
    paddingBottom: SIZING.margin.vertical * 4,
  },
  drawerItemContainer: {
    borderTopWidth: SIZING.border.lg,
    borderBottomWidth: SIZING.border.lg,
    paddingVertical: SIZING.margin.vertical * 2,
    gap: 6,
  },
  header: {
    fontFamily: FONTS.abril,
    fontSize: SIZING.font.title,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: SIZING.font.xl,
    marginHorizontal: -SIZING.margin.horizontal / 2,
  },
  footerContainer: {
    marginTop: "auto",
    marginBottom: SIZING.margin.vertical * 3.5,
  },
});
