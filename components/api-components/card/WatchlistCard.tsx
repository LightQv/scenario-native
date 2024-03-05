import {
  Text,
  TouchableOpacity,
  View,
  Animated as nAnimated,
  Alert,
} from "react-native";
import React, { useRef } from "react";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useThemeContext } from "@/app/context/ThemeContext";
import { Link, router } from "expo-router";
import { BUTTON, LIGHT, SIZING } from "@/constants/theme";
import i18n from "@/services/i18n";
import GoSvg from "@/assets/svg/nav-arrow-right.svg";
import EditSvg from "@/assets/svg/edit-pencil.svg";
import BinSvg from "@/assets/svg/trash.svg";
import { instanceAPI } from "@/services/instances";
import { notifyError } from "@/components/toasts/Toast";
import { useWatchlistContext } from "@/app/context/WatchlistContext";
import cardStyles from "@/styles/card.style";
import useStyle from "@/hooks/useStyle";
import Button from "@/components/ui/Button";

type WatchlistCardProps = {
  data: Watchlist;
};

export default function WatchlistCard({ data }: WatchlistCardProps) {
  const { THEME } = useThemeContext();
  const {
    backgroundPrimary,
    backgroundSecond,
    backgroundMain,
    colorPrimary,
    colorAlt,
  } = useStyle();
  const { setUpdateWatchlist } = useWatchlistContext();
  const swipeRef = useRef<Swipeable>(null);

  const renderRightAction = (
    _progress: nAnimated.AnimatedInterpolation<number>,
    dragX: nAnimated.AnimatedInterpolation<number>
  ) => {
    const translationModify = dragX.interpolate({
      inputRange: [-SIZING.card.media.height * 2, 0],
      outputRange: [0, SIZING.card.media.height],
      extrapolate: "clamp",
    });

    const translationDelete = dragX.interpolate({
      inputRange: [-SIZING.card.media.height, 0],
      outputRange: [1, SIZING.card.media.height],
      extrapolate: "clamp",
    });

    return (
      <View style={[cardStyles.doubleSwipeContainer]}>
        <Button
          onPress={() => {
            router.push({
              pathname: "watchlist/(modals)/modify",
              params: { id: data.id },
            });
            swipeRef.current?.close();
          }}
          style={[cardStyles.swipeBtn, backgroundMain]}
        >
          <nAnimated.Text
            style={{
              transform: [{ translateX: translationModify }],
            }}
          >
            <EditSvg width={20} height={20} color={LIGHT.background.primary} />
          </nAnimated.Text>
        </Button>
        <Button
          onPress={openDelete}
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

  const openDelete = () => {
    Alert.alert(
      i18n.t("form.watchlist.delete.title"),
      i18n.t("form.watchlist.delete.warning"),
      [
        {
          text: i18n.t("form.watchlist.delete.submit"),
          onPress: () => deleteWatchlist(),
          style: "destructive",
        },
        {
          text: i18n.t("form.watchlist.delete.cancel"),
          style: "cancel",
        },
      ]
    );
    swipeRef.current?.close();
  };

  const deleteWatchlist = async () => {
    try {
      const res = await instanceAPI.delete(`/api/v1/watchlist/${data.id}`);
      if (res) {
        setUpdateWatchlist!(true);
      }
    } catch (err: any) {
      if (err.request?.status !== 403) {
        notifyError(i18n.t("toast.error"));
      }
    }
  };

  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRightAction}
      rightThreshold={40}
    >
      <View style={[{ alignItems: "center" }, backgroundPrimary]}>
        <Link
          href={{
            pathname: "watchlist/[id]",
            params: { id: data.id },
          }}
          asChild
        >
          <TouchableOpacity activeOpacity={BUTTON.opacity}>
            <View style={[cardStyles.cardContainer]}>
              <View style={{ gap: 1, flex: 1 }}>
                <Text
                  style={[cardStyles.title, colorPrimary]}
                  numberOfLines={1}
                >
                  {data.title}
                </Text>
                <Text style={[cardStyles.subtitle, colorAlt]}>
                  {data._count.medias}{" "}
                  {data._count.medias > 1
                    ? i18n.t("screen.watchlist.count.plurial")
                    : i18n.t("screen.watchlist.count.singular")}
                </Text>
              </View>
              <GoSvg width={18} height={18} color={THEME?.color.primary} />
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </Swipeable>
  );
}
