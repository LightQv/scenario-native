import {
  Alert,
  TouchableOpacity,
  Animated as nAnimated,
  View,
} from "react-native";
import React, { Dispatch, RefObject, SetStateAction, useRef } from "react";
import { Link } from "expo-router";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useView } from "@/hooks/useView";
import i18n from "@/services/i18n";
import { BLURHASH, BUTTON, LIGHT, SIZING } from "@/constants/theme";
import { durationConvert, formatFullDate } from "@/services/utils";
import { useThemeContext } from "@/app/context/ThemeContext";
import Animated, { FadeIn, Layout } from "react-native-reanimated";
import ViewSvg from "@/assets/svg/eye.svg";
import UnviewSvg from "@/assets/svg/eye-closed.svg";
import ShiftSvg from "@/assets/svg/data-transfer-both.svg";
import BinSvg from "@/assets/svg/trash.svg";
import { instanceAPI } from "@/services/instances";
import { notifyError } from "@/components/toasts/Toast";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useViewContext } from "@/app/context/ViewContext";
import { useAuth } from "@/app/context/AuthContext";
import { useWatchlistContext } from "@/app/context/WatchlistContext";
import cardStyles from "@/styles/card.style";
import { Image } from "expo-image";
import useStyle from "@/hooks/useStyle";
import Button from "@/components/ui/Button";

type MediaCardProps = {
  data: APIMedia;
  bottomSheetRef: RefObject<BottomSheetModal>;
  setSheetChildren: Dispatch<
    SetStateAction<{ genre: boolean; shift: boolean }>
  >;
  setSelectedMedia: Dispatch<SetStateAction<APIMedia | null>>;
};

export default function MediaCard({
  data,
  bottomSheetRef,
  setSheetChildren,
  setSelectedMedia,
}: MediaCardProps) {
  const { viewed, viewObj } = useView(data.tmdb_id.toString(), data.media_type);
  const { setSendView } = useViewContext();
  const { setUpdateWatchlist } = useWatchlistContext();
  const { user } = useAuth();
  const { THEME } = useThemeContext();
  const {
    backgroundPrimary,
    backgroundSecond,
    backgroundMain,
    colorPrimary,
    colorAlt,
    borderThird,
  } = useStyle();
  const swipeRef = useRef<Swipeable>(null);

  const renderLeftAction = (
    _progress: nAnimated.AnimatedInterpolation<number>,
    dragX: nAnimated.AnimatedInterpolation<number>
  ) => {
    const translationView = dragX.interpolate({
      inputRange: [0, SIZING.card.media.height],
      outputRange: [-SIZING.card.media.height, 1],
      extrapolate: "clamp",
    });

    return (
      <View style={[cardStyles.simpleSwipContainer]}>
        <Button
          onPress={handleView}
          style={[cardStyles.swipeBtn, backgroundMain]}
        >
          <nAnimated.Text
            style={{
              transform: [{ translateX: translationView }],
            }}
          >
            {viewed ? (
              <ViewSvg
                width={20}
                height={20}
                color={LIGHT.background.primary}
              />
            ) : (
              <UnviewSvg
                width={20}
                height={20}
                color={LIGHT.background.primary}
              />
            )}
          </nAnimated.Text>
        </Button>
      </View>
    );
  };

  const handleView = () => {
    if (viewed && viewObj) {
      instanceAPI
        .delete(`/api/v1/views/${viewObj.id}`)
        .then(() => {
          setSendView?.(true);
          swipeRef.current?.close();
        })
        .catch(() => notifyError(i18n.t("toast.error")));
    } else {
      instanceAPI
        .post(`/api/v1/view`, {
          tmdb_id: data.tmdb_id,
          genre_ids: data.genre_ids,
          poster_path: data.poster_path,
          backdrop_path: data.backdrop_path,
          release_date: data.release_date,
          release_year: data.release_date?.slice(0, 4),
          runtime: data.runtime,
          title: data.title,
          media_type: data.media_type,
          viewerId: user?.id,
        })
        .then(() => {
          setSendView?.(true);
          swipeRef.current?.close();
        })
        .catch(() => notifyError(i18n.t("toast.error")));
    }
  };

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
          onPress={openShift}
          style={[cardStyles.swipeBtn, backgroundMain]}
        >
          <nAnimated.Text
            style={{
              transform: [{ translateX: translationModify }],
            }}
          >
            <ShiftSvg width={20} height={20} color={LIGHT.background.primary} />
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

  const openShift = () => {
    setSelectedMedia(data);
    swipeRef.current?.close();
    bottomSheetRef.current?.present();
    setSheetChildren({ genre: false, shift: true });
  };

  const openDelete = () => {
    Alert.alert(
      i18n.t("form.media.delete.title"),
      i18n.t("form.media.delete.warning"),
      [
        {
          text: i18n.t("form.media.delete.submit"),
          onPress: () => deleteMedia(),
          style: "destructive",
        },
        {
          text: i18n.t("form.media.delete.cancel"),
          style: "cancel",
        },
      ]
    );
    swipeRef.current?.close();
  };

  const deleteMedia = async () => {
    try {
      const res = await instanceAPI.delete(`/api/v1/medias/${data.id}`);
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
      renderLeftActions={renderLeftAction}
      renderRightActions={renderRightAction}
      leftThreshold={40}
      rightThreshold={40}
    >
      <View style={[{ alignItems: "center" }, backgroundPrimary]}>
        <Link
          href={{
            pathname: "details/[id]",
            params: { type: data.media_type, id: data.tmdb_id },
          }}
          asChild
        >
          <TouchableOpacity activeOpacity={BUTTON.opacity}>
            <View style={cardStyles.cardContainer}>
              <View style={cardStyles.cardBody}>
                <View style={{ width: "90%" }}>
                  <Animated.Text
                    layout={Layout}
                    entering={FadeIn.duration(500)}
                    style={[cardStyles.title, colorPrimary]}
                    numberOfLines={1}
                  >
                    {data.title}
                  </Animated.Text>
                  <Animated.Text
                    layout={Layout}
                    entering={FadeIn.duration(500)}
                    style={[cardStyles.subtitle, colorAlt]}
                  >
                    {data.media_type === "movie" &&
                      `${formatFullDate(data.release_date)} • ${durationConvert(
                        data.runtime
                      )}`}
                    {data.media_type === "tv" &&
                      `${formatFullDate(data.release_date)} • ${
                        data.runtime > 1
                          ? `${data.runtime} ${i18n.t(
                              "screen.detail.media.seasons.episode.plurial"
                            )}`
                          : `${data.runtime} ${i18n.t(
                              "screen.detail.media.seasons.episode.singular"
                            )}`
                      }`}
                  </Animated.Text>
                </View>
                {viewed ? (
                  <ViewSvg width={18} height={18} color={THEME?.color.main} />
                ) : (
                  <UnviewSvg width={18} height={18} color={THEME?.color.gray} />
                )}
              </View>
              <View style={cardStyles.cardImage}>
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w200/${data.poster_path}`,
                  }}
                  alt={data.title}
                  style={[cardStyles.image, borderThird]}
                  contentFit="cover"
                  placeholder={BLURHASH.hash}
                  transition={BLURHASH.transition}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </Swipeable>
  );
}
