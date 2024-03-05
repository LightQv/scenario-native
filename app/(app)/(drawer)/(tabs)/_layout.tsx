import React from "react";
import { Tabs } from "expo-router";
import SearchSvg from "@/assets/svg/search.svg";
import StatSvg from "@/assets/svg/stat-up.svg";
import DiscoverSvg from "@/assets/svg/cinema-old.svg";
import WatchlistSvg from "@/assets/svg/list-select.svg";
import { useThemeContext } from "@/app/context/ThemeContext";
import { SIZING } from "@/constants/theme";

const TabsLayout = () => {
  const { THEME } = useThemeContext();

  return (
    <Tabs
      initialRouteName="index"
      backBehavior="history"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: THEME?.background.primary,
          borderTopColor: THEME?.background.quad,
          borderTopWidth: SIZING.border.xs * 0.7,
        },
        tabBarInactiveTintColor: THEME?.color.primary,
        tabBarActiveTintColor: THEME?.color.main,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color }) => (
            <SearchSvg
              width={SIZING.navigation.icon}
              height={SIZING.navigation.icon}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="top"
        options={{
          tabBarIcon: ({ color }) => (
            <StatSvg
              width={SIZING.navigation.icon}
              height={SIZING.navigation.icon}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <DiscoverSvg
              width={SIZING.navigation.icon}
              height={SIZING.navigation.icon}
              color={color}
            />
          ),

          headerTransparent: true,
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          tabBarIcon: ({ color }) => (
            <WatchlistSvg
              width={SIZING.navigation.icon}
              height={SIZING.navigation.icon}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
