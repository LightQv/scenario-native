import { TouchableOpacity, Animated as nAnimated, View } from "react-native";
import React, { Dispatch, RefObject, SetStateAction, useRef } from "react";
import { Link } from "expo-router";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useView } from "@/hooks/useView";
import i18n from "@/services/i18n";
import { BLURHASH, BUTTON, LIGHT, SIZING } from "@/constants/theme";
import { durationConvert, formatFullDate } from "@/services/utils";
import Animated, { FadeIn, Layout } from "react-native-reanimated";
import WatchlistSvg from "@/assets/svg/list-select.svg";
import UnviewSvg from "@/assets/svg/eye-closed.svg";
import { instanceAPI } from "@/services/instances";
import { notifyError } from "@/components/toasts/Toast";
import { useViewContext } from "@/app/context/ViewContext";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import cardStyles from "@/styles/card.style";
import { Image } from "expo-image";
import useStyle from "@/hooks/useStyle";
import Button from "@/components/ui/Button";

type ViewCardProps = {
  data: APIMedia;
  bottomSheetRef: RefObject<BottomSheetModal>;
  setSheetChildren: Dispatch<
    SetStateAction<{ genre: boolean; watchlist: boolean }>
  >;
  setSelectedMedia: Dispatch<SetStateAction<APIMedia | null>>;
};

export default function ViewCard({
  data,
  bottomSheetRef,
  setSheetChildren,
  setSelectedMedia,
}: ViewCardProps) {
  const { viewObj } = useView(data.tmdb_id.toString(), data.media_type);
  const { setSendView } = useViewContext();
  const {
    backgroundPrimary,
    backgroundSecond,
    backgroundMain,
    colorPrimary,
    colorAlt,
    borderThird,
  } = useStyle();
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
          onPress={openWatchlist}
          style={[cardStyles.swipeBtn, backgroundMain]}
        >
          <nAnimated.Text
            style={{
              transform: [{ translateX: translationModify }],
            }}
          >
            <WatchlistSvg
              width={20}
              height={20}
              color={LIGHT.background.primary}
            />
          </nAnimated.Text>
        </Button>
        <Button
          onPress={deleteView}
          style={[cardStyles.swipeBtn, backgroundSecond]}
        >
          <nAnimated.Text
            style={{
              transform: [{ translateX: translationDelete }],
            }}
          >
            <UnviewSvg
              width={20}
              height={20}
              color={LIGHT.background.primary}
            />
          </nAnimated.Text>
        </Button>
      </View>
    );
  };

  const openWatchlist = () => {
    setSelectedMedia(data);
    setSheetChildren({ genre: false, watchlist: true });
    bottomSheetRef.current?.present();
    swipeRef.current?.close();
  };

  const deleteView = async () => {
    if (viewObj) {
      try {
        const res = await instanceAPI.delete(`/api/v1/view/${viewObj.id}`);
        if (res) {
          setSendView!(true);
          swipeRef.current?.close();
        }
      } catch (err: any) {
        if (err.request?.status !== 403) {
          notifyError(i18n.t("toast.error"));
        }
      }
    }
  };

  return (
    <Swipeable
      ref={swipeRef}
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
