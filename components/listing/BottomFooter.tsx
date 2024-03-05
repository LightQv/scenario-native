import { SIZING } from "@/constants/theme";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

type BottomFooterProps = {
  actualPage: number;
  totalPage: number;
};

export default function BottomFooter({
  actualPage,
  totalPage,
}: BottomFooterProps) {
  if (actualPage < totalPage) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }
  if (actualPage === totalPage) {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZING.margin.horizontal,
    justifyContent: "center",
    alignItems: "center",
  },
});
