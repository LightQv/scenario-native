import { useEffect, useState } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import i18n from "@/services/i18n";
import instanceTmdb from "@/services/instances";
import { notifyError } from "@/components/toasts/Toast";
import {
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BLURHASH } from "@/constants/theme";
import { FlatList } from "react-native-gesture-handler";
import { formatFullDate } from "@/services/utils";
import contentStyles from "@/styles/content.style";
import { Image } from "expo-image";
import useStyle from "@/hooks/useStyle";
import detailStyles from "@/styles/detail.style";

type RecommandationProps = {
  contentId: number;
};

export default function Recommandation({ contentId }: RecommandationProps) {
  const { type } = useLocalSearchParams();
  const { colorPrimary, colorAlt, borderThird, borderBottomThird } = useStyle();
  const [recommendations, setRecommendations] =
    useState<Array<TmdbData> | null>(null);

  useEffect(() => {
    if (contentId) {
      instanceTmdb
        .get(
          `/${type}/${contentId}/recommendations?language=${i18n.locale}&page=1`
        )
        .then(({ data }) => {
          setRecommendations(data.results);
        })
        .catch(() => {
          notifyError(i18n.t("toast.error"));
        });
    }
  }, [type, contentId, i18n.locale]);

  const renderRow: ListRenderItem<TmdbData> = ({ item }) => (
    <Link
      href={{
        pathname: "/details/[id]",
        params: { type: item.media_type, id: item.id },
      }}
      asChild
      style={styles.cardContainer}
    >
      <Pressable>
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
          <Text
            style={[detailStyles.cardHeader, colorPrimary]}
            numberOfLines={1}
          >
            {item.title || item.name}
          </Text>
          <Text
            style={[detailStyles.cardDescription, colorAlt]}
            numberOfLines={1}
          >
            {formatFullDate(
              (item.release_date as string) || (item.first_air_date as string)
            )}
          </Text>
        </View>
      </Pressable>
    </Link>
  );

  if (recommendations?.length === 0) return null;
  return (
    <View style={[contentStyles.container, borderBottomThird]}>
      <Text style={[contentStyles.categoryTitle, colorPrimary]}>
        {i18n.t("screen.detail.media.recommandations")}
      </Text>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={recommendations
          ?.sort((a, b) => b.vote_count - a.vote_count)
          .slice(0, 10)}
        renderItem={renderRow}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={contentStyles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 170,
  },
});
