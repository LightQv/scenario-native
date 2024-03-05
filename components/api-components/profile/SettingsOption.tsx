import { Text, View } from "react-native";
import React from "react";
import { useThemeContext } from "@/app/context/ThemeContext";
import GoSvg from "@/assets/svg/nav-arrow-right.svg";
import cardStyles from "../../../styles/card.style";
import { FONTS, SIZING } from "@/constants/theme";
import useStyle from "@/hooks/useStyle";
import Button from "@/components/ui/Button";

type SettingsOptionProps = {
  icon: JSX.Element;
  title: string;
  onPress: () => void;
};

export default function SettingsOption({
  icon,
  title,
  onPress,
}: SettingsOptionProps) {
  const { THEME } = useThemeContext();
  const { backgroundPrimary, colorPrimary, borderBottomAlt } = useStyle();

  return (
    <View style={[{ alignItems: "center" }, backgroundPrimary]}>
      <Button onPress={onPress}>
        <View
          style={[
            cardStyles.cardContainer,
            borderBottomAlt,
            {
              borderBottomWidth: SIZING.border.lg,
              height: SIZING.card.media.height / 1.5,
            },
          ]}
        >
          <View style={{ gap: 15, flexDirection: "row", alignItems: "center" }}>
            {icon}
            <Text
              style={[
                cardStyles.title,
                colorPrimary,
                {
                  fontFamily: FONTS.medium,
                  fontSize: SIZING.font.xl,
                },
              ]}
            >
              {title}
            </Text>
          </View>
          <GoSvg width={18} height={18} color={THEME?.color.primary} />
        </View>
      </Button>
    </View>
  );
}
