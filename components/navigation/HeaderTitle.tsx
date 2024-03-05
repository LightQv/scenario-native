import React from "react";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { FONTS, SIZING } from "@/constants/theme";
import { useThemeContext } from "@/app/context/ThemeContext";

type HeaderTitleProps = {
  offset: SharedValue<number>;
  title: string;
};

export default function HeaderTitle({ offset, title }: HeaderTitleProps) {
  const { THEME } = useThemeContext();

  //--- Animation ---//
  const headerTitleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        offset.value,
        [SIZING.image.height * 0.7, SIZING.image.height],
        [0, 1]
      ),
      transform: [
        {
          translateY: interpolate(
            offset.value,
            [SIZING.image.height * 0.7, SIZING.image.height],
            [20, 0],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <Animated.Text
      style={[
        {
          fontFamily: FONTS.abril,
          fontSize: 20,
          maxWidth: SIZING.device.width / 2,
          color: THEME?.color.primary,
        },
        headerTitleAnimatedStyle,
      ]}
      numberOfLines={1}
    >
      {title}
    </Animated.Text>
  );
}
