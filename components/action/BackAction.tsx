import React from "react";
import BackSvg from "@/assets/svg/arrow-left.svg";
import { useThemeContext } from "@/app/context/ThemeContext";
import { router } from "expo-router";
import { SIZING } from "@/constants/theme";
import actionStyles from "../../styles/action.style";
import useStyle from "@/hooks/useStyle";
import Button from "../ui/Button";

export default function BackAction() {
  const { THEME } = useThemeContext();
  const { backgroundPrimary } = useStyle();

  return (
    <Button
      onPress={() => router.back()}
      style={[backgroundPrimary, actionStyles.btn]}
    >
      <BackSvg
        width={SIZING.navigation.button}
        height={SIZING.navigation.button}
        color={THEME?.color.primary}
      />
    </Button>
  );
}
