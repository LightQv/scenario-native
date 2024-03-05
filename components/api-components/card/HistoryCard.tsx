import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated as nAnimated,
} from "react-native";
import React, { useRef } from "react";
import cardStyles from "@/styles/card.style";
import i18n from "@/services/i18n";
import BinSvg from "@/assets/svg/trash.svg";
import { BUTTON, LIGHT, SIZING } from "@/constants/theme";
import { useSearchHistory } from "@/app/context/SearchHistoryContext";
import { Swipeable } from "react-native-gesture-handler";
import useStyle from "@/hooks/useStyle";
import Button from "@/components/ui/Button";

type HistoryCardProps = {
  data: SearchHistory;
  index: number;
  onPress: (newQuery: string) => void;
};

export default function HistoryCard({
  data,
  index,
  onPress,
}: HistoryCardProps) {
  const {
    backgroundPrimary,
    backgroundSecond,
    colorPrimary,
    colorAlt,
    borderBottomAlt,
  } = useStyle();
  const { onDeleteHistoryItem } = useSearchHistory();
  const swipeRef = useRef<Swipeable>(null);

  const renderRightAction = (
    _progress: nAnimated.AnimatedInterpolation<number>,
    dragX: nAnimated.AnimatedInterpolation<number>
  ) => {
    const translationDelete = dragX.interpolate({
      inputRange: [-SIZING.card.media.height, 0],
      outputRange: [1, SIZING.card.media.height],
      extrapolate: "clamp",
    });

    return (
      <View style={[cardStyles.simpleSwipContainer]}>
        <Button
          onPress={() => {
            onDeleteHistoryItem!(index);
            swipeRef.current?.close();
          }}
          style={[cardStyles.swipeBtn, backgroundSecond]}
        >
          <nAnimated.Text
            style={{
              transform: [{ translateX: translationDelete }],
            }}
          >
            <BinSvg width={20} height={20} color={LIGHT.background.primary} />
          </nAnimated.Text>
        </Button>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRightAction}
      rightThreshold={40}
    >
      <View style={[{ alignItems: "center" }, backgroundPrimary]}>
        <Pressable
          style={({ pressed }) => [{ opacity: pressed ? BUTTON.opacity : 1 }]}
          onPress={() => onPress(data.query)}
        >
          <View
            style={[
              cardStyles.cardContainer,
              styles.container,
              borderBottomAlt,
            ]}
          >
            <View style={{ gap: 1 }}>
              <Text style={[cardStyles.title, colorPrimary]}>{data.query}</Text>
              <Text style={[cardStyles.subtitle, colorAlt]}>
                {data.total_results}{" "}
                {data.total_results > 1
                  ? i18n.t("screen.search.result.plurial")
                  : i18n.t("screen.search.result.singular")}
              </Text>
            </View>
          </View>
        </Pressable>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: SIZING.border.md,
  },
});
