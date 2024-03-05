import React from "react";
import { router } from "expo-router";
import { useThemeContext } from "@/app/context/ThemeContext";
import CloseSvg from "@/assets/svg/xmark.svg";
import Button from "../ui/Button";

export default function CloseModal() {
  const { THEME } = useThemeContext();
  return (
    <Button onPress={() => router.back()}>
      <CloseSvg width={26} height={26} color={THEME?.color.primary} />
    </Button>
  );
}
