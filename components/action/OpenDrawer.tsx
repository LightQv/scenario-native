import React from "react";
import ProfileSvg from "@/assets/svg/user.svg";
import { useThemeContext } from "@/app/context/ThemeContext";
import { DrawerActions } from "@react-navigation/native";
import { SIZING } from "@/constants/theme";
import Button from "../ui/Button";
import { useNavigation } from "expo-router";

export default function OpenDrawer() {
  const { THEME } = useThemeContext();
  const navigation = useNavigation();
  return (
    <Button onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
      <ProfileSvg
        width={SIZING.navigation.icon}
        height={SIZING.navigation.icon}
        color={THEME?.color.primary}
      />
    </Button>
  );
}
