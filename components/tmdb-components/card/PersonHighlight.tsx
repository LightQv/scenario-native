import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { formatFullDate } from "@/services/utils";
import { BLURHASH, FONTS, SIZING } from "@/constants/theme";
import { Image } from "expo-image";
import useStyle from "@/hooks/useStyle";

type PersonCardProps = {
  el: PersonKnownFor;
};

export default function PersonHighlight({ el }: PersonCardProps) {
  const { colorPrimary, colorAlt, borderThird } = useStyle();

  return (
    <View>
      <Link
        href={{
          pathname: "details/[id]",
          params: { type: el.media_type, id: el.id },
        }}
        asChild
        style={styles.listContainer}
      >
        <Pressable>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500/${
                el.poster_path || el.profile_path
              }`,
            }}
            alt={el.name}
            style={[styles.cardImage, borderThird]}
            contentFit="cover"
            placeholder={BLURHASH.hash}
            transition={BLURHASH.transition}
          />
          <View style={styles.cardBody}>
            <Text style={[styles.title, colorPrimary]} numberOfLines={1}>
              {el.title || el.name}
            </Text>
            <Text style={[styles.subtitle, colorAlt]} numberOfLines={1}>
              {formatFullDate(el.release_date as string) ||
                (el.first_air_date as string)}
            </Text>
          </View>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  cardImage: {
    flex: 1,
    flexGrow: 1,
    borderRadius: 2,
    borderWidth: SIZING.radius.xs,
    aspectRatio: 2 / 3,
  },
  cardBody: {
    flex: 5,
  },
  title: {
    fontFamily: FONTS.medium,
    fontSize: SIZING.font.md,
  },
  subtitle: {
    fontFamily: FONTS.italic,
    fontSize: SIZING.font.xs,
  },
});
