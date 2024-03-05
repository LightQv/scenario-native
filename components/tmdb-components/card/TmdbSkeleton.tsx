import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { FONTS, SIZING } from "@/constants/theme";
import { useThemeContext } from "@/app/context/ThemeContext";
import { Skeleton } from "moti/skeleton";
import usePlaceholder from "@/hooks/usePlaceholder";
import useStyle from "@/hooks/useStyle";

type TmdbSkeletonProps = {
  count: number;
};

export default function TmdbSkeleton({ count }: TmdbSkeletonProps) {
  const { darkTheme } = useThemeContext();
  const {
    backgroundThird,
    colorPrimary,
    colorAlt,
    borderThird,
    borderBottomAlt,
  } = useStyle();
  const placeholder = usePlaceholder(count);

  const SkeletonCommonProps = {
    colorMode: darkTheme ? "dark" : "light",
  } as const;

  return (
    <Skeleton.Group show>
      {placeholder.map((_, i) => (
        <View key={i} style={[styles.cardContainer, borderBottomAlt]}>
          <View style={styles.cardBody}>
            <Skeleton {...SkeletonCommonProps} width={"90%"}>
              <Text style={[styles.title, colorPrimary]} numberOfLines={1}>
                {""}
              </Text>
            </Skeleton>
            <View style={{ height: 2 }} />
            <Skeleton {...SkeletonCommonProps} width={"30%"}>
              <Text style={[styles.subtitle, colorAlt]}>{""}</Text>
            </Skeleton>
            <View style={{ height: 2 }} />
            <Skeleton {...SkeletonCommonProps} height={80}>
              <Text style={[styles.description, colorAlt]} numberOfLines={4}>
                {""}
              </Text>
            </Skeleton>
            <View style={styles.genreContainer}>
              {placeholder.slice(0, 2).map((_, i) => (
                <Skeleton key={i} {...SkeletonCommonProps} width={70}>
                  <Text
                    style={[
                      styles.genreElement,
                      borderThird,
                      backgroundThird,
                      colorPrimary,
                    ]}
                    numberOfLines={1}
                  >
                    {""}
                  </Text>
                </Skeleton>
              ))}
            </View>
          </View>
          <View style={styles.cardImage}>
            <Skeleton {...SkeletonCommonProps}>
              <Image
                source={{
                  uri: undefined,
                }}
                alt={undefined}
                resizeMode="cover"
                style={[styles.image, borderThird]}
              />
            </Skeleton>
          </View>
        </View>
      ))}
    </Skeleton.Group>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    height: 210,
    width: SIZING.device.width - 32,
    borderBottomWidth: SIZING.border.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    paddingVertical: 20,
    alignSelf: "center",
  },
  cardBody: {
    flex: 2,
    gap: 2,
  },
  title: {
    fontFamily: FONTS.abril,
    fontSize: SIZING.font.xxxl,
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
});
