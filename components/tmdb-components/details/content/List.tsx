import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { notifyError } from "@/components/toasts/Toast";
import i18n from "@/services/i18n";
import instanceTmdb from "@/services/instances";
import { BLURHASH } from "@/constants/theme";
import { formatFullDate } from "@/services/utils";
import contentStyles from "@/styles/content.style";
import { Image } from "expo-image";
import useStyle from "@/hooks/useStyle";
import detailStyles from "@/styles/detail.style";

type ListProps = {
  title: string;
  data?: Array<Season>;
};

export default function List({ title, data }: ListProps) {
  const { type, id } = useLocalSearchParams();
  const {
    backgroundPrimary,
    colorPrimary,
    colorAlt,
    borderThird,
    borderBottomThird,
  } = useStyle();
  const [credits, setCredits] = useState<Credit | null>(null);

  useEffect(() => {
    if (title === i18n.t("screen.detail.media.cast")) {
      instanceTmdb
        .get(`/${type}/${id}/credits?language=${i18n.locale}`)
        .then(({ data }) => {
          setCredits(data);
        })
        .catch(() => {
          notifyError(i18n.t("toast.error"));
        });
    }
  }, [type, id, title, i18n.locale]);

  const renderCreditRow: ListRenderItem<Cast> = ({ item }) => (
    <Link
      href={{
        pathname: "/details/[id]",
        params: { type: "person", id: item.id },
      }}
      asChild
      style={styles.cardContainer}
    >
      <Pressable>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500/${item.profile_path}`,
          }}
          contentFit="cover"
          style={[detailStyles.listImage, borderThird]}
          placeholder={BLURHASH.hash}
          transition={BLURHASH.transition}
        />
        <View style={detailStyles.infoContainer}>
          <Text
            style={[detailStyles.cardHeader, colorPrimary]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={[detailStyles.cardTitle, colorAlt]} numberOfLines={1}>
            {item.character}
          </Text>
          <Text
            style={[detailStyles.cardDescription, colorAlt]}
            numberOfLines={1}
          >
            {item.known_for_department}
          </Text>
        </View>
      </Pressable>
    </Link>
  );

  const renderSeasonRow: ListRenderItem<Season> = ({ item }) => (
    <View style={styles.cardContainer}>
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
        }}
        contentFit="cover"
        style={[detailStyles.listImage, borderThird]}
        placeholder={BLURHASH.hash}
        transition={BLURHASH.transition}
      />
      <View style={detailStyles.infoContainer}>
        <Text style={[detailStyles.cardHeader, colorPrimary]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text
          style={[detailStyles.cardDescription, colorAlt]}
          numberOfLines={1}
        >
          {`${formatFullDate(item.air_date as string)} • ${
            item.episode_count
          } ${
            item.episode_count && item.episode_count > 1
              ? i18n.t("screen.detail.media.seasons.episode.plurial")
              : i18n.t("screen.detail.media.seasons.episode.singular")
          }`}
        </Text>
      </View>
    </View>
  );

  return (
    <View
      style={[contentStyles.container, borderBottomThird, backgroundPrimary]}
    >
      <Text style={[contentStyles.categoryTitle, colorPrimary]}>{title}</Text>
      {title === i18n.t("screen.detail.media.cast") &&
        credits &&
        credits?.cast.length > 0 && (
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={credits.cast.slice(0, 10)}
            renderItem={renderCreditRow}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={contentStyles.listContainer}
          />
        )}
      {type === "tv" && data && (
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={data}
          renderItem={renderSeasonRow}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={contentStyles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 170,
  },
});
