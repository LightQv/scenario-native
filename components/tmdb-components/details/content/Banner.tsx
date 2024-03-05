import { Linking, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { setScoreColor } from "@/services/utils";
import { FONTS, LIGHT, SIZING } from "@/constants/theme";
import TrailerSvg from "@/assets/svg/play.svg";
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useThemeContext } from "@/app/context/ThemeContext";
import actionStyles from "@/styles/action.style";
import detailStyles from "@/styles/detail.style";
import useStyle from "@/hooks/useStyle";
import Button from "@/components/ui/Button";

type BannerProps = {
  src: string;
  alt: string;
  score: number;
  videos: Array<Video> | undefined;
  offset: SharedValue<number>;
};

export default function Banner({
  src,
  alt,
  score,
  videos,
  offset,
}: BannerProps) {
  const [trailerObj, setTrailerObj] = useState<Array<Video> | null>(null);
  const { THEME, darkTheme } = useThemeContext();
  const { backgroundPrimary, borderThird } = useStyle();

  useEffect(() => {
    if (videos) {
      setTrailerObj(
        videos?.filter(
          (el: Video) =>
            el.name.toUpperCase().includes("TRAILER") ||
            el.type.toUpperCase().includes("TRAILER")
        )
      );
    }
  }, [videos]);

  const handleExternalLink = async () => {
    if (trailerObj && trailerObj[0].key) {
      const url = `https://www.youtube.com/watch?v=${trailerObj[0].key}`;
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } else return;
  };

  //--- Animation ---//
  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            offset.value,
            [-SIZING.image.height, 0, SIZING.image.height],
            [-SIZING.image.height / 2, 0, SIZING.image.height * 0.75]
          ),
        },
        {
          scale: interpolate(
            offset.value,
            [-SIZING.image.height, 0, SIZING.image.height],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <View
      style={[
        detailStyles.imageContainer,
        {
          borderBottomWidth: SIZING.border.xs,
        },
        borderThird,
      ]}
    >
      <Animated.Image
        source={{ uri: `https://image.tmdb.org/t/p/original/${src}` }}
        style={[detailStyles.image, imageAnimatedStyle]}
        alt={alt}
        resizeMode={"cover"}
      />
      <View style={styles.absoluteContainer}>
        <View
          style={[
            styles.scoreContainer,
            {
              backgroundColor: setScoreColor(score, darkTheme as boolean),
            },
          ]}
        >
          <Text style={styles.score}>
            {Number(score.toFixed(1)) < 1 ? "?" : score.toFixed(1)}
          </Text>
        </View>
        {trailerObj && trailerObj.length > 0 && (
          <Button
            onPress={handleExternalLink}
            style={[
              styles.trailerContainer,
              actionStyles.btn,
              backgroundPrimary,
            ]}
          >
            <TrailerSvg
              width={SIZING.navigation.button}
              height={SIZING.navigation.button}
              color={THEME?.color.primary}
            />
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row-reverse",
    gap: 10,
    alignItems: "flex-end",
  },
  scoreContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
    borderRadius: SIZING.radius.full,
    shadowOffset: {
      width: 3,
      height: 10,
    },
    shadowColor: LIGHT.color.primary,
    shadowRadius: 15,
    shadowOpacity: 0.2,
  },
  score: {
    fontFamily: FONTS.abril,
    fontSize: SIZING.font.xl,
  },
  trailerContainer: {
    borderRadius: SIZING.radius.full,
    shadowOffset: {
      width: 3,
      height: 10,
    },
    shadowColor: LIGHT.color.primary,
    shadowRadius: 15,
    shadowOpacity: 0.2,
  },
});
