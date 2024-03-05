import { Text, View } from "react-native";
import React, { Dispatch, RefObject, SetStateAction } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useGenreContext } from "@/app/context/GenreContext";
import i18n from "@/services/i18n";
import ChevronDownSvg from "@/assets/svg/nav-arrow-down.svg";
import { useThemeContext } from "@/app/context/ThemeContext";
import filterStyles from "../../styles/filter.style";
import useStyle from "@/hooks/useStyle";
import Button from "../ui/Button";

type MediaFilterProps = {
  filterParams: {
    genre: string;
  };
  bottomSheetRef: RefObject<BottomSheetModal>;
  setSheetChildren: Dispatch<
    SetStateAction<{ genre: boolean; shift: boolean }>
  >;
};

export default function MediaFilter({
  filterParams,
  bottomSheetRef,
  setSheetChildren,
}: MediaFilterProps) {
  const { THEME } = useThemeContext();
  const { backgroundPrimary, backgroundThird, colorPrimary, borderThird } =
    useStyle();
  const { totalGenres } = useGenreContext();

  const openGenreSheet = () => {
    bottomSheetRef.current?.present();
    setSheetChildren({ genre: true, shift: false });
  };

  return (
    <View style={[backgroundPrimary]}>
      <Button
        onPress={openGenreSheet}
        style={[filterStyles.box, backgroundThird, borderThird]}
      >
        <View style={filterStyles.filterBox}>
          <Text style={[filterStyles.label, colorPrimary]}>
            {totalGenres?.find(
              (item) => item.id.toString() === filterParams.genre
            )?.name || i18n.t("filter.genre.every")}
          </Text>
          <ChevronDownSvg width={16} height={16} color={THEME?.color.primary} />
        </View>
      </Button>
    </View>
  );
}
