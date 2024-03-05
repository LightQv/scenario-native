import { Text, View } from "react-native";
import React from "react";
import { useGenreContext } from "@/app/context/GenreContext";
import i18n from "@/services/i18n";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import SelectDot from "@/components/filter/SelectDot";
import sheetStyles from "@/styles/sheet.style";
import useStyle from "@/hooks/useStyle";
import Button from "../ui/Button";

type SelectFilterProps = {
  title: string;
  data?: { id: number; value: string; label: string }[];
  type?: string;
  onPress: (arg: string) => void;
  activeValue: string;
};

export default function SelectFilter({
  title,
  data,
  type,
  onPress,
  activeValue,
}: SelectFilterProps) {
  const { backgroundPrimary, colorPrimary, borderBottomThird } = useStyle();
  const { movieGenres, tvGenres, totalGenres } = useGenreContext();

  const chooseDataType = () => {
    if (type === "movie" && movieGenres)
      return movieGenres.sort((a, b) => a.name.localeCompare(b.name));
    if (type === "tv" && tvGenres)
      return tvGenres.sort((a, b) => a.name.localeCompare(b.name));
    if (type === "all" && totalGenres)
      return totalGenres.sort((a, b) => a.name.localeCompare(b.name));
  };

  if (!movieGenres || !tvGenres) return null;
  return (
    <BottomSheetScrollView
      style={backgroundPrimary}
      showsVerticalScrollIndicator={false}
    >
      <View style={[sheetStyles.header, borderBottomThird]}>
        <Text style={[sheetStyles.sheetTitle, colorPrimary]}>{title}</Text>
      </View>
      <View style={sheetStyles.listContainer}>
        {!type && data && (
          <>
            {data.map((item) => (
              <Button
                key={item.id}
                onPress={() => onPress(item.value)}
                disabled={activeValue === item.value}
              >
                <View style={[sheetStyles.listItem]}>
                  <Text style={[sheetStyles.listLabel, colorPrimary]}>
                    {item.label}
                  </Text>
                  <SelectDot activeValue={activeValue} value={item.value} />
                </View>
              </Button>
            ))}
          </>
        )}
        {type && (
          <>
            <Button onPress={() => onPress("")} disabled={activeValue === ""}>
              <View style={[sheetStyles.listItem]}>
                <Text style={[sheetStyles.listLabel, colorPrimary]}>
                  {i18n.t("filter.genre.every")}
                </Text>
                <SelectDot activeValue={activeValue} value="" />
              </View>
            </Button>
            {chooseDataType()?.map((item) => (
              <Button
                key={item.id}
                onPress={() => onPress(item.id.toString())}
                disabled={activeValue === item.id.toString()}
              >
                <View style={[sheetStyles.listItem]}>
                  <Text style={[sheetStyles.listLabel, colorPrimary]}>
                    {item.name}
                  </Text>
                  <SelectDot
                    activeValue={activeValue}
                    value={item.id.toString()}
                  />
                </View>
              </Button>
            ))}
          </>
        )}
      </View>
    </BottomSheetScrollView>
  );
}
