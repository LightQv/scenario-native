import { Share } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { SIZING } from "@/constants/theme";
import ShareSvg from "@/assets/svg/share-ios.svg";
import { useThemeContext } from "@/app/context/ThemeContext";
import actionStyles from "../../styles/action.style";
import useStyle from "@/hooks/useStyle";
import Button from "../ui/Button";

type ShareMediaProps = {
  title: string;
};

export default function ShareMedia({ title }: ShareMediaProps) {
  const { type, id } = useLocalSearchParams();
  const { THEME } = useThemeContext();
  const { backgroundPrimary } = useStyle();

  const shareMedia = async () => {
    try {
      await Share.share({
        title: title,
        url: `https://scenario.vivianquerenet.com/details/${type}/${id}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button onPress={shareMedia} style={[backgroundPrimary, actionStyles.btn]}>
      <ShareSvg
        width={SIZING.navigation.button}
        height={SIZING.navigation.button}
        color={THEME?.color.primary}
      />
    </Button>
  );
}
