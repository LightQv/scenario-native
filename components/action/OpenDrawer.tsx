import React from "react";
import ProfileSvg from "@/assets/svg/user.svg";
import { useThemeContext } from "@/app/context/ThemeContext";
import { useNavigation } from "expo-router/src/useNavigation";
import { DrawerActions } from "@react-navigation/native";
import { SIZING } from "@/constants/theme";
import Button from "../ui/Button";

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
