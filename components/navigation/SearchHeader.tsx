import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { DARK, FONTS, SIZING } from "@/constants/theme";
import { useThemeContext } from "@/app/context/ThemeContext";
import i18n from "@/services/i18n";
import SearchSvg from "@/assets/svg/search.svg";
import { router } from "expo-router";
import CloseSvg from "@/assets/svg/xmark.svg";
import useStyle from "@/hooks/useStyle";
import Button from "../ui/Button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import filterStyles from "@/styles/filter.style";

type HeaderProps = {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  onTextChange: (event: any) => void;
};

export default function SearchHeader({
  query,
  setQuery,
  onTextChange,
}: HeaderProps) {
  const { THEME } = useThemeContext();
  const {
    backgroundPrimary,
    backgroundThird,
    backgroundMain,
    colorPrimary,
    borderThird,
    borderBottomQuad,
    shadowQuad,
  } = useStyle();
  const insets =
    useSafeAreaInsets(); /* Used to replace SafeAreaView causing Header Flickering on first render */

  return (
    <View
      style={[
        {
          paddingTop: insets.top,
          paddingBottom: 0,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        backgroundPrimary,
      ]}
    >
      <View
        style={[
          styles.container,
          backgroundPrimary,
          shadowQuad,
          borderBottomQuad,
        ]}
      >
        <View style={[filterStyles.searchBar, borderThird, backgroundThird]}>
          <SearchSvg width={18} height={18} color={DARK.color.gray} />
          <TextInput
            autoFocus
            autoCapitalize="none"
            placeholder={i18n.t("screen.search.placeholder")}
            placeholderTextColor={DARK.color.gray}
            style={[filterStyles.placeholder, colorPrimary]}
            onChangeText={(text: string) => setQuery(text)}
            onSubmitEditing={onTextChange}
            numberOfLines={1}
            value={query}
            cursorColor={THEME?.color.main}
            selectionColor={THEME?.color.main}
            enablesReturnKeyAutomatically
            returnKeyType="search"
          />
          {query !== "" && (
            <Pressable
              style={[styles.resetBtn, backgroundMain]}
              onPress={() => setQuery("")}
            >
              <CloseSvg
                width={12}
                height={12}
                color={THEME?.background.primary}
              />
            </Pressable>
          )}
        </View>
        <Button onPress={() => router.back()}>
          <Text style={[styles.cancelTxt, colorPrimary]}>
            {i18n.t("screen.search.cancel")}
          </Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZING.device.width,
    height: SIZING.header.height,
    paddingHorizontal: SIZING.margin.horizontal,
    paddingBottom: SIZING.margin.vertical / 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,

    ...Platform.select({
      ios: {
        shadowRadius: 0,
        shadowOffset: {
          width: 0,
          height: SIZING.border.xs,
        },
        zIndex: 9,
      },
      android: {
        borderBottomWidth: SIZING.border.xs * 0.7,
      },
    }),
  },
  resetBtn: {
    marginLeft: "auto",
    height: 16,
    width: 16,
    borderRadius: SIZING.radius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelTxt: {
    fontFamily: FONTS.regular,
    fontSize: SIZING.font.xl,
  },
});
