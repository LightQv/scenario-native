import {
  FlatList,
  Image,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import instanceTmdb from "@/services/instances";
import i18n from "@/services/i18n";
import { formatFullDate } from "@/services/utils";
import contentStyles from "@/styles/content.style";
import useStyle from "@/hooks/useStyle";
import detailStyles from "@/styles/detail.style";

export default function KnownFor() {
  const { type, id } = useLocalSearchParams();
  const { colorPrimary, colorAlt, borderThird, borderBottomThird } = useStyle();
  const [creditList, setCreditList] = useState<PersonDatasList | null>(null);

  //--- Fetch Movies & TV Shows the person's been credited for ---//
  useEffect(() => {
    if (type === "person") {
      instanceTmdb
        .get(`/${type}/${id}/combined_credits?language=${i18n.locale}'`)
        .then(({ data }) => {
          setCreditList(data);
        })
        .catch((err) => console.warn(err));
    }
  }, [type, id, i18n.locale]);

  const creditsByPopularity = creditList?.cast
    ?.sort((a, b) => b.vote_count - a.vote_count)
    ?.filter((el) => el?.vote_count >= 500)
    .slice(0, 10);

  const renderRow: ListRenderItem<PersonDataList> = ({ item }) => (
    <View style={styles.cardContainer}>
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
            resizeMode="cover"
            style={[detailStyles.listImage, borderThird]}
          />
          <View style={detailStyles.infoContainer}>
            <Text
              style={[detailStyles.cardHeader, colorPrimary]}
              numberOfLines={1}
            >
              {item.character}
            </Text>
            <Text style={[detailStyles.cardTitle, colorAlt]} numberOfLines={1}>
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
    </View>
  );

  if (!creditsByPopularity) return null;
  return (
    <View style={[contentStyles.container, borderBottomThird]}>
      <Text style={[contentStyles.categoryTitle, colorPrimary]}>
        {i18n.t("screen.person.title")}
      </Text>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={creditsByPopularity}
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
