import { StyleSheet, View } from "react-native";
import React from "react";
import { SIZING } from "@/constants/theme";
import useStyle from "@/hooks/useStyle";

export default function ItemSeparator() {
  const { backgroundPrimary, backgroundAlt } = useStyle();

  return (
    <View style={[styles.container, backgroundPrimary]}>
      <View style={[styles.separator, backgroundAlt]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZING.device.width,
    height: SIZING.border.lg,
    alignItems: "center",
  },
  separator: {
    width: SIZING.device.width - SIZING.margin.horizontal * 2,
    height: "100%",
    paddingHorizontal: SIZING.margin.horizontal * 2,
  },
});
