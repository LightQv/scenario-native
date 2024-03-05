import { Pressable, Text, View } from "react-native";
import React from "react";
import { DARK } from "@/constants/theme";
import i18n from "@/services/i18n";
import { router } from "expo-router";
import SearchSvg from "@/assets/svg/search.svg";
import filterStyles from "@/styles/filter.style";
import useStyle from "@/hooks/useStyle";

export default function OpenSearch() {
  const { backgroundPrimary, backgroundThird, borderThird } = useStyle();

  return (
    <View
      style={[
        filterStyles.container,
        {
          minWidth: "100%",
        },
        backgroundPrimary,
      ]}
    >
      <Pressable
        style={[filterStyles.searchBar, borderThird, backgroundThird]}
        onPress={() => router.push("/(app)/(drawer)/(tabs)/search/query")}
      >
        <SearchSvg width={18} height={18} color={DARK.color.gray} />
        {/* Here's a fake TextInput because Android TextInput's size is different than iOS */}
        {/* Threfore, create a gap with other's screens filter bar */}
        <Text style={[filterStyles.placeholder, { color: DARK.color.gray }]}>
          {i18n.t("screen.search.placeholder")}
        </Text>
      </Pressable>
    </View>
  );
}
