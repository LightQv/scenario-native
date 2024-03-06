import { Dimensions, ListRenderItem, View } from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { instanceAPI } from "@/services/instances";
import i18n from "@/services/i18n";
import { notifyError } from "@/components/toasts/Toast";
import { BACKDROP, BLURHASH, SIZING } from "@/constants/theme";
import SelectFilter from "@/components/sheet-children/SelectFilter";
import Header from "@/components/api-components/details/Header";
import MediaCard from "@/components/api-components/card/MediaCard";
import Animated, {
  FadeInLeft,
  FadeOutRight,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useThemeContext } from "@/app/context/ThemeContext";
import { StatusBar, StatusBarStyle } from "expo-status-bar";
import Carousel, { CarouselRenderItem } from "react-native-reanimated-carousel";
import MediaSkeleton from "@/components/api-components/card/MediaSkeleton";
import EditMedia from "@/components/sheet-children/EditMedia";
import { useWatchlistContext } from "@/app/context/WatchlistContext";
import ItemSeparator from "@/components/listing/ItemSeparator";
import BackAction from "@/components/action/BackAction";
import DetailHeader from "@/components/navigation/DetailHeader";
import HeaderTitle from "@/components/navigation/HeaderTitle";
import screenStyles from "@/styles/screen.style";
import detailStyles from "@/styles/detail.style";
import { useScrollToTop } from "@react-navigation/native";
import { Image } from "expo-image";
import useStyle from "@/hooks/useStyle";

type fetchParams = {
  genre: string;
};

type sheetChildren = {
  genre: boolean;
  shift: boolean;
};

export default function WatchlistDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { THEME, darkTheme } = useThemeContext();
  const { backgroundPrimary, backgroundQuad, borderThird } = useStyle();
  const { updateWatchlist, setUpdateWatchlist } = useWatchlistContext();
  const dummyBanner: string = darkTheme
    ? "https://dummyimage.com/640x360/121212/121212"
    : "https://dummyimage.com/640x360/fff/fff";
  const defaultGenre: string = "";
  const [fetchParams, setFetchParams] = useState<fetchParams>({
    genre: defaultGenre,
  });
  const [sheetChildren, setSheetChildren] = useState<sheetChildren>({
    genre: false,
    shift: false,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [media, setMedia] = useState<Media | null>(null);
  const [mediaList, setMediaList] = useState<APIMedia[] | []>([]);
  const [selectedMedia, setSelectedMedia] = useState<APIMedia | null>(null);

  //--- Fetch API Watchlist's Medias ---//
  useEffect(() => {
    if (id) {
      instanceAPI
        .get(`/api/v1/user/watchlist/detail/${id}?genre=${fetchParams.genre}`)
        .then((res) => {
          setMedia(res.data);
          setMediaList(res.data.medias);
        })
        .finally(() => {
          setUpdateWatchlist!(false);
          setLoading(false);
        })
        .catch(() => notifyError(i18n.t("toast.error")));
    }
  }, [id, loading, updateWatchlist]);

  //--- Screen Header ---//
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <DetailHeader
          offset={scrollOffset}
          headerLeft={
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <BackAction />
              {media && (
                <HeaderTitle offset={scrollOffset} title={media?.title} />
              )}
            </View>
          }
        />
      ),
    });
  }, [navigation, media, THEME]);

  //--- FlatList ---//
  const listRef = useRef(null);
  const scrollOffset = useSharedValue(0);
  const [statusStyle, setStatusStyle] = useState<StatusBarStyle>(
    darkTheme ? "auto" : "inverted"
  );
  const toggleStatusBarStyle = (style: StatusBarStyle) => {
    setStatusStyle(style);
  }; /* Wrap setState for runOnJS */

  /* runOnJS call the setState wrapper to work on JS side */
  /* by default useAnimatedScrollHandler works on UI side */
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y; /* Update SharedValue */
      if (scrollOffset.value >= SIZING.header.height) {
        runOnJS(toggleStatusBarStyle)("auto");
      } else {
        darkTheme
          ? runOnJS(toggleStatusBarStyle)("auto")
          : runOnJS(toggleStatusBarStyle)("inverted");
      }
    },
  });
  useScrollToTop(listRef); /* ScrollToTop on Tab Press */

  const renderRow: ListRenderItem<APIMedia> = ({ item }) => (
    <MediaCard
      data={item}
      bottomSheetRef={bottomSheetRef}
      setSheetChildren={setSheetChildren}
      setSelectedMedia={setSelectedMedia}
    />
  );

  const renderCarouselRow: CarouselRenderItem<APIMedia> = ({ item, index }) => (
    <Image
      source={{
        uri: `https://image.tmdb.org/t/p/original/${item.backdrop_path}`,
      }}
      style={[
        detailStyles.image,
        {
          borderBottomWidth: SIZING.border.xs,
        },
      ]}
      alt={index.toString()}
      key={index.toString()}
      contentFit="cover"
      placeholder={BLURHASH.hash}
      transition={BLURHASH.transition}
    />
  );

  const renderHeader = () => {
    return (
      <>
        {media && media?.medias.length > 0 ? (
          <Carousel
            width={Dimensions.get("screen").width}
            height={SIZING.image.height}
            loop
            autoPlay={media.medias.length > 1}
            enabled={false}
            scrollAnimationDuration={1500}
            autoPlayInterval={5000}
            snapEnabled={false}
            data={media.medias}
            style={[imageAnimatedStyle, borderThird]}
            renderItem={renderCarouselRow}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 1,
              parallaxScrollingOffset: 0,
              parallaxAdjacentItemScale: 1,
            }}
          />
        ) : (
          <Animated.Image
            source={{
              uri: dummyBanner,
            }}
            style={[
              detailStyles.image,
              {
                borderBottomWidth: SIZING.border.xs,
              },
              borderThird,
              imageAnimatedStyle,
            ]}
            alt="profile_banner"
            resizeMode={"cover"}
            tintColor={
              media?.medias.length === 0 ? THEME?.color.main : undefined
            }
          />
        )}

        <Header
          title={media?.title}
          count={media?._count.medias}
          filterParams={fetchParams}
          setSheetChildren={setSheetChildren}
          bottomSheetRef={bottomSheetRef}
        />
      </>
    );
  };

  //--- Bottom Sheet ---//
  /* Sheet Cfg */
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["30%", "90%"], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={BACKDROP.opacity}
      />
    ),
    []
  );

  /* Children onPress Logic */
  const handleGenre = (newValue: string) => {
    setFetchParams({
      genre: newValue,
    }); /* Reset page number to 1 & update genre */
    bottomSheetRef.current?.close();
    setUpdateWatchlist!(true);
  };

  //--- Animation ---//
  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-SIZING.image.height, 0, SIZING.image.height],
            [-SIZING.image.height / 2, 0, SIZING.image.height * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-SIZING.image.height, 0, SIZING.image.height],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <View style={[{ flex: 1 }, backgroundPrimary]}>
      <StatusBar style={statusStyle} animated />
      <Animated.FlatList
        ref={listRef}
        scrollEventThrottle={16}
        scrollEnabled={mediaList.length > 1}
        entering={FadeInLeft}
        exiting={FadeOutRight}
        onScroll={scrollHandler}
        data={mediaList.sort((a, b) => a.title.localeCompare(b.title))}
        extraData={updateWatchlist}
        renderItem={renderRow}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <ItemSeparator />}
        ListEmptyComponent={<MediaSkeleton />}
        ListHeaderComponent={renderHeader()}
      />

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={0}
        backdropComponent={renderBackdrop}
        style={screenStyles.sheetContainer}
        backgroundStyle={backgroundPrimary}
        handleIndicatorStyle={backgroundQuad}
      >
        {sheetChildren.genre && (
          <SelectFilter
            title={i18n.t("filter.genre.title")}
            type={"all"}
            onPress={handleGenre}
            activeValue={fetchParams.genre}
          />
        )}
        {sheetChildren.shift && <EditMedia data={selectedMedia} />}
      </BottomSheetModal>
    </View>
  );
}
