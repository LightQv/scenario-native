import { StyleSheet, View } from "react-native";
import React from "react";
import { SIZING } from "@/constants/theme";
import useStyle from "@/hooks/useStyle";

type SelectDotProps = {
  activeValue: string;
  value: string;
};

export default function SelectDot({ activeValue, value }: SelectDotProps) {
  const { backgroundPrimary, backgroundMain, borderThird, borderMain } =
    useStyle();

  const itemSelectedStyle = (value: string) => {
    return activeValue === value ? [backgroundMain, borderMain] : [borderThird];
  };

  return (
    <View style={[styles.item, itemSelectedStyle(value)]}>
      <View style={[styles.dot, backgroundPrimary]} />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderRadius: SIZING.radius.full,
    borderWidth: SIZING.border.lg,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    height: 9,
    width: 9,
    borderRadius: 999,
  },
});
