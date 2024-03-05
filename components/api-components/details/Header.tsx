import { StyleSheet, Text, View } from "react-native";
import React, { Dispatch, RefObject, SetStateAction } from "react";
import i18n from "@/services/i18n";
import MediaFilter from "@/components/filter/MediaFilter";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import detailStyles from "@/styles/detail.style";
import useStyle from "@/hooks/useStyle";

type HeaderProps = {
  title: string | undefined;
  count: number | undefined;
  filterParams: {
    genre: string;
  };
  setSheetChildren: Dispatch<
    SetStateAction<{
      genre: boolean;
      shift: boolean;
    }>
  >;
  bottomSheetRef: RefObject<BottomSheetModal>;
};

export default function Header({
  title,
  count,
  filterParams,
  setSheetChildren,
  bottomSheetRef,
}: HeaderProps) {
  const { backgroundPrimary, colorPrimary, colorGray, borderBottomThird } =
    useStyle();

  return (
    <View
      style={[
        detailStyles.container,
        styles.container,
        backgroundPrimary,
        borderBottomThird,
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[detailStyles.title, colorPrimary]}>{title}</Text>
        <Text style={[detailStyles.subtitle, colorGray]}>
          {count}{" "}
          {count && count > 1
            ? i18n.t("screen.watchlist.count.plurial")
            : i18n.t("screen.watchlist.count.singular")}
        </Text>
      </View>
      <MediaFilter
        filterParams={filterParams}
        setSheetChildren={
          setSheetChildren as Dispatch<
            SetStateAction<{
              genre: boolean;
              shift: boolean;
            }>
          >
        }
        bottomSheetRef={bottomSheetRef}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
