import { StyleSheet, View } from "react-native";
import React from "react";
import Animated, {
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useThemeContext } from "@/app/context/ThemeContext";
import { SIZING } from "@/constants/theme";
import useStyle from "@/hooks/useStyle";

type HeaderProps = {
  offset: SharedValue<number>;
  headerLeft?: JSX.Element;
  headerRight?: JSX.Element | undefined;
};

export default function DetailHeader({
  offset,
  headerLeft,
  headerRight,
}: HeaderProps) {
  const { THEME } = useThemeContext();
  const { borderBottomQuad } = useStyle();
  //--- Animation ---//
  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        offset.value,
        [0, SIZING.image.height / 1.5],
        ["transparent", THEME?.background.primary as string],
        "RGB",
        {
          gamma: 2.2,
        }
      ),
    };
  });

  /* Using borderBottom waiting for a fix as Shadow like TabHeader makes a Warning Error */
  const borderAnimatedStyle = useAnimatedStyle(() => {
    return {
      borderBottomWidth: interpolate(
        offset.value,
        [0, SIZING.image.height / 1.5],
        [0, SIZING.border.xs * 0.4]
      ),
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        borderBottomQuad,
        borderAnimatedStyle,
        backgroundAnimatedStyle,
      ]}
    >
      <View style={styles.headerLeft}>
        {headerLeft !== undefined && headerLeft}
      </View>
      <View style={styles.headerRight}>
        {headerRight !== undefined && headerRight}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: SIZING.device.width,
    height: SIZING.header.height + 60,
    paddingHorizontal: SIZING.margin.horizontal,
    paddingTop: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    zIndex: 9,
  },
  headerLeft: {
    flexBasis: "60%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignContent: "center",
  },
  headerRight: {
    flexBasis: "40%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    alignContent: "center",
  },
});
