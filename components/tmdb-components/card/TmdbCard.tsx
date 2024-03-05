import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import useGenre from "@/hooks/useGenre";
import { useView } from "@/hooks/useView";
import { BLURHASH, BUTTON, FONTS, LIGHT, SIZING } from "@/constants/theme";
import { formatFullDate, setScoreColor } from "@/services/utils";
import i18n from "@/services/i18n";
import ViewSvg from "@/assets/svg/eye.svg";
import UnviewSvg from "@/assets/svg/eye-closed.svg";
import { Link } from "expo-router";
import PersonHighlight from "./PersonHighlight";
import { useThemeContext } from "@/app/context/ThemeContext";
import Animated, { FadeIn, Layout } from "react-native-reanimated";
import { Image } from "expo-image";
import useStyle from "@/hooks/useStyle";

type TmdbCardProps = {
  data: TmdbData;
  media_type?: string;
};

export default function TmdbCard({ data, media_type }: TmdbCardProps) {
  const genre = useGenre(data, media_type);
  const { viewed } = useView(data.id.toString(), media_type);
  const { THEME, darkTheme } = useThemeContext();
  const { backgroundThird, colorPrimary, colorAlt, borderThird } = useStyle();

  return (
    <View>
      <Link
        href={{
          pathname: "details/[id]",
          params: { type: data.media_type || media_type, id: data.id },
        }}
        asChild
        style={[styles.cardContainer]}
      >
        <TouchableOpacity activeOpacity={BUTTON.opacity}>
          <View style={styles.cardBody}>
            <View style={styles.cardHeader}>
              <Animated.Text
                layout={Layout}
                entering={FadeIn.duration(500)}
                style={[styles.title, colorPrimary]}
                numberOfLines={1}
              >
                {data.title || data.name}
              </Animated.Text>
              {viewed ? (
                <ViewSvg width={18} height={18} color={THEME?.color.main} />
              ) : (
                <UnviewSvg width={18} height={18} color={THEME?.color.gray} />
              )}
            </View>
            <Animated.Text
              layout={Layout}
              entering={FadeIn.duration(500)}
              style={[styles.subtitle, colorAlt]}
            >
              {data.media_type !== "person"
                ? formatFullDate(
                    (data.release_date as string) ||
                      (data.first_air_date as string)
                  )
                : data.known_for_department}
            </Animated.Text>
            {data.media_type !== "person" ? (
              <Animated.Text
                layout={Layout}
                entering={FadeIn.duration(500)}
                style={[styles.description, colorAlt]}
                numberOfLines={4}
              >
                {data.overview ? data.overview : i18n.t("error.noSynopsis")}
              </Animated.Text>
            ) : (
              <View style={styles.personContainer}>
                {data.known_for.slice(0, 2).map((el, i) => (
                  <PersonHighlight key={i} el={el} />
                ))}
              </View>
            )}
            {data.media_type !== "person" && (
              <View style={styles.genreContainer}>
                {genre?.slice(0, 2).map((genre, i) => (
                  <Animated.Text
                    key={i}
                    layout={Layout}
                    entering={FadeIn.duration(500)}
                    style={[
                      styles.genreElement,
                      borderThird,
                      backgroundThird,
                      colorPrimary,
                      i === 1 ? { flexShrink: 2 } : { flexShrink: 0 },
                    ]}
                    numberOfLines={1}
                  >
                    {genre}
                  </Animated.Text>
                ))}
              </View>
            )}
          </View>
          <View style={styles.cardImage}>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500/${
                  data.poster_path || data.profile_path
                }`,
              }}
              alt={data.name}
              style={[styles.image, borderThird]}
              contentFit="cover"
              placeholder={BLURHASH.hash}
            />
          </View>
          {data.media_type !== "person" && (
            <View
              style={[
                styles.scoreContainer,
                {
                  backgroundColor: setScoreColor(
                    data.vote_average,
                    darkTheme as boolean
                  ),
                },
              ]}
            >
              <Animated.Text
                layout={Layout}
                entering={FadeIn.duration(500)}
                style={styles.score}
              >
                {Number(data.vote_average?.toFixed(1)) < 1
                  ? "?"
                  : data.vote_average?.toFixed(1)}
              </Animated.Text>
            </View>
          )}
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    height: 210,
    width: SIZING.device.width - SIZING.margin.horizontal * 2,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    paddingVertical: SIZING.margin.vertical * 2,
    alignSelf: "center",
  },
  cardBody: {
    flex: 2,
    gap: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontFamily: FONTS.abril,
    fontSize: SIZING.font.xxxl,
    flex: 2,
  },
  subtitle: {
    fontFamily: FONTS.italic,
    fontSize: SIZING.font.md,
  },
  description: {
    marginTop: 4,
    fontFamily: FONTS.regular,
    fontSize: SIZING.font.md,
    lineHeight: 19,
  },
  personContainer: {
    marginTop: "auto",
    gap: 2,
  },
  genreContainer: {
    marginTop: "auto",
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },
  genreElement: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontFamily: FONTS.regular,
    fontSize: SIZING.font.sm,
    borderRadius: SIZING.radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardImage: {
    flex: 1,
    height: "100%",
    position: "relative",
  },
  image: {
    borderRadius: SIZING.radius.sm,
    borderWidth: SIZING.border.xs,
    height: "100%",
  },
  scoreContainer: {
    position: "absolute",
    bottom: 10,
    right: -8,
    justifyContent: "center",
    alignItems: "center",
    height: 45,
    width: 45,
    borderRadius: SIZING.radius.full,
    shadowOffset: {
      width: 3,
      height: 10,
    },
    shadowColor: LIGHT.color.primary,
    shadowRadius: 15,
    shadowOpacity: 0.1,
  },
  score: {
    fontFamily: FONTS.abril,
    fontSize: SIZING.font.lg,
  },
});
