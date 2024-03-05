import { ListRenderItem, StyleSheet, Text, View } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
import { BLURHASH, FONTS, SIZING } from "@/constants/theme";
import contentStyles from "@/styles/content.style";
import { Image } from "expo-image";
import useStyle from "@/hooks/useStyle";

type ProviderBannerProps = {
  title: string;
  data: Array<ProviderDetails> | undefined;
};

export default function ProviderBanner({ title, data }: ProviderBannerProps) {
  const { colorPrimary, borderThird, borderBottomThird } = useStyle();

  const renderRow: ListRenderItem<ProviderDetails> = ({ item }) => (
    <View style={styles.providerContainer}>
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500/${item.logo_path}`,
        }}
        alt={item.provider_name}
        style={[styles.providerImg, borderThird]}
        contentFit="cover"
        placeholder={BLURHASH.hash}
        transition={BLURHASH.transition}
      />
      <Text style={[styles.providerTitle, colorPrimary]} numberOfLines={2}>
        {item.provider_name}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, borderBottomThird]}>
      <Text style={[styles.title, colorPrimary]}>{title}</Text>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={data}
        renderItem={renderRow}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={contentStyles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    width: "auto",
  },
  title: {
    marginHorizontal: 20,
    fontFamily: FONTS.medium,
    fontSize: SIZING.font.xl,
  },
  providerContainer: {
    width: 70,
    gap: 4,
    alignItems: "center",
  },
  providerImg: {
    width: 70,
    height: 70,
    borderWidth: SIZING.border.xs,
    borderRadius: SIZING.radius.sm,
  },
  providerTitle: {
    fontFamily: FONTS.regular,
    fontSize: SIZING.font.sm,
    textAlign: "center",
  },
});
