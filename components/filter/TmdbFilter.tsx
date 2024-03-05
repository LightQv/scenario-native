import { ScrollView, Text, View } from "react-native";
import React, { Dispatch, RefObject, SetStateAction } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useGenreContext } from "@/app/context/GenreContext";
import { sortList, typeList } from "@/services/data";
import i18n from "@/services/i18n";
import ChevronDownSvg from "@/assets/svg/nav-arrow-down.svg";
import { useThemeContext } from "@/app/context/ThemeContext";
import filterStyles from "../../styles/filter.style";
import useStyle from "@/hooks/useStyle";
import Button from "../ui/Button";
import { SIZING } from "@/constants/theme";

type TmdbFilterProps = {
  fetchParams: {
    type: string;
    page: number;
    sort?: string;
    genre?: string;
  };
  bottomSheetRef: RefObject<BottomSheetModal>;
  setSheetChildren: Dispatch<
    SetStateAction<{
      type: boolean;
      sort?: boolean;
      genre?: boolean;
    }>
  >;
};

export default function TmdbFilter({
  fetchParams,
  bottomSheetRef,
  setSheetChildren,
}: TmdbFilterProps) {
  const { THEME } = useThemeContext();
  const { backgroundPrimary, backgroundThird, colorPrimary, borderThird } =
    useStyle();
  const { totalGenres } = useGenreContext();

  const openTypeSheet = () => {
    bottomSheetRef.current?.present();
    setSheetChildren({ type: true, sort: false, genre: false });
  };

  const openSortSheet = () => {
    bottomSheetRef.current?.present();
    setSheetChildren({ type: false, sort: true, genre: false });
  };

  const openGenreSheet = () => {
    bottomSheetRef.current?.present();
    setSheetChildren({ type: false, sort: false, genre: true });
  };

  return (
    <ScrollView
      horizontal
      contentContainerStyle={[
        filterStyles.container,
        { paddingHorizontal: SIZING.margin.horizontal },
        backgroundPrimary,
      ]}
      showsHorizontalScrollIndicator={false}
    >
      {fetchParams.type && (
        <Button
          onPress={openTypeSheet}
          style={[filterStyles.box, borderThird, backgroundThird]}
        >
          <View style={filterStyles.filterBox}>
            <Text style={[filterStyles.label, colorPrimary]}>
              {typeList.find((item) => item.value === fetchParams.type)?.label}
            </Text>
            <ChevronDownSvg
              width={18}
              height={18}
              color={THEME?.color.primary}
            />
          </View>
        </Button>
      )}
      {fetchParams.sort && (
        <Button
          onPress={openSortSheet}
          style={[
            filterStyles.box,
            borderThird,
            backgroundThird,
            { marginLeft: 8 },
          ]}
        >
          <View style={filterStyles.filterBox}>
            <Text style={[filterStyles.label, colorPrimary]}>
              {sortList.find((item) => item.value === fetchParams.sort)?.label}
            </Text>
            <ChevronDownSvg
              width={18}
              height={18}
              color={THEME?.color.primary}
            />
          </View>
        </Button>
      )}
      {fetchParams.genre !== undefined && (
        <Button
          onPress={openGenreSheet}
          style={[
            filterStyles.box,
            borderThird,
            backgroundThird,
            { marginLeft: 8 },
          ]}
        >
          <View style={filterStyles.filterBox}>
            <Text style={[filterStyles.label, colorPrimary]}>
              {totalGenres?.find(
                (item) => item.id.toString() === fetchParams.genre
              )?.name || i18n.t("filter.genre.every")}
            </Text>
            <ChevronDownSvg
              width={18}
              height={18}
              color={THEME?.color.primary}
            />
          </View>
        </Button>
      )}
    </ScrollView>
  );
}
