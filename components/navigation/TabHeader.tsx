import { StyleSheet, Text, View, Platform } from "react-native";
import React from "react";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { FONTS, SIZING } from "@/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useStyle from "@/hooks/useStyle";

type HeaderProps = {
  headerLeft?: JSX.Element;
  headerRight?: JSX.Element;
  title: string;
  offset: SharedValue<number>;
};

export default function TabHeader({
  headerLeft,
  headerRight,
  title,
  offset,
}: HeaderProps) {
  const { backgroundPrimary, colorPrimary, borderBottomQuad, shadowQuad } =
    useStyle();
  const maxOffset: number = SIZING.header.height / 2;
  const insets =
    useSafeAreaInsets(); /* Used to replace SafeAreaView causing Header Flickering on first render */

  //--- Animation ---//
  const shadowAnimatedStyle = useAnimatedStyle(() => {
    return {
      shadowOpacity:
        offset.value > maxOffset
          ? withTiming(0.2, {
              duration: 200,
              easing: Easing.in(Easing.linear),
            })
          : withTiming(0, {
              duration: 200,
              easing: Easing.in(Easing.linear),
            }),
    };
  });

  const borderAnimatedStyle = useAnimatedStyle(() => {
    return {
      borderBottomWidth:
        offset.value > maxOffset
          ? withTiming(SIZING.border.xs * 0.7, {
              duration: 200,
              easing: Easing.in(Easing.linear),
            })
          : withTiming(0, {
              duration: 200,
              easing: Easing.in(Easing.linear),
            }),
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity:
        offset.value > maxOffset
          ? withTiming(1, {
              duration: 200,
              easing: Easing.in(Easing.linear),
            })
          : withTiming(0, {
              duration: 200,
              easing: Easing.in(Easing.linear),
            }),
    };
  });

  return (
    <View
      style={[
        {
          paddingTop: insets.top,
          paddingBottom: 0,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        backgroundPrimary,
      ]}
    >
      <Animated.View
        style={[
          styles.container,
          backgroundPrimary,
          shadowAnimatedStyle,
          shadowQuad,
          borderAnimatedStyle,
          borderBottomQuad,
        ]}
      >
        <View style={styles.headerLeft}>
          {headerLeft !== undefined && headerLeft}
        </View>
        <Animated.View style={[styles.headerTitle, titleAnimatedStyle]}>
          <Text style={[styles.title, colorPrimary]}>{title}</Text>
        </Animated.View>
        <View style={styles.headerRight}>
          {headerRight !== undefined && headerRight}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: SIZING.device.width,
    height: SIZING.header.height,
    paddingHorizontal: SIZING.margin.horizontal,
    paddingBottom: SIZING.margin.vertical / 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",

    ...Platform.select({
      ios: {
        shadowRadius: 0,
        shadowOffset: {
          width: 0,
          height: SIZING.border.xs,
        },
        zIndex: 9,
      },
      android: {
        borderBottomWidth: 0,
      },
    }),
  },
  headerLeft: {
    flexBasis: "25%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignContent: "center",
  },
  headerTitle: {
    display: "flex",
    flexBasis: "50%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  headerRight: {
    flexBasis: "25%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    alignContent: "center",
  },
  title: {
    fontFamily: FONTS.abril,
    fontSize: 20,
    textAlign: "center",
  },
});
