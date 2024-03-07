import { ListRenderItem, Text, View } from "react-native";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import Animated, {
  FadeInLeft,
  FadeOutRight,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import ViewCard from "@/components/api-components/card/ViewCard";
import ItemSeparator from "@/components/listing/ItemSeparator";
import ViewSkeleton from "@/components/api-components/card/ViewSkeleton";
import TabHeader from "@/components/navigation/TabHeader";
import BackAction from "@/components/action/BackAction";
import i18n from "@/services/i18n";
import { BACKDROP, SIZING } from "@/constants/theme";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import SelectFilter from "@/components/sheet-children/SelectFilter";
import screenStyles from "@/styles/screen.style";
import { notifyError } from "@/components/toasts/Toast";
import { instanceAPI } from "@/services/instances";
import { useAuth } from "@/app/context/AuthContext";
import { useViewContext } from "@/app/context/ViewContext";
import AddMedia from "@/components/sheet-children/AddMedia";
import ViewFilter from "@/components/filter/ViewFilter";
import useStyle from "@/hooks/useStyle";

type fetchParams = {
  genre: string;
};

type sheetChildren = {
  genre: boolean;
  watchlist: boolean;
};

export default function ViewsScreen() {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const { backgroundPrimary, backgroundQuad, colorPrimary } = useStyle();
  const { sendView } = useViewContext();
  const defaultGenre: string = "";
  const [fetchParams, setFetchParams] = useState<fetchParams>({
    genre: defaultGenre,
  });
  const [sheetChildren, setSheetChildren] = useState<sheetChildren>({
    genre: false,
    watchlist: false,
  });
  const [view, setView] = useState<APIMedia[] | []>([]);
  const [selectedMedia, setSelectedMedia] = useState<APIMedia | null>(null);

  useEffect(() => {
    if (user?.id && params.type) {
      instanceAPI
        .get(
          `/api/v1/views/${params.type}/${user.id}?genre=${fetchParams.genre}`
        )
        .then(({ data }) => {
          setView(data);
        })
        .catch((err: any) => {
          if (err.request.status !== 403) {
            notifyError(i18n.t("toast.error"));
          }
        });
    }
  }, [params, fetchParams.genre, sendView]);

  //--- Screen Header ---//
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <TabHeader
          offset={scrollOffset}
          headerLeft={
            <View style={{ marginRight: -1 }}>
              <BackAction />
            </View>
          }
          title={
            ((params.type === "movie" &&
              i18n.t("screen.profile.views.header.movie")) as string) ||
            ((params.type === "tv" &&
              i18n.t("screen.profile.views.header.tv")) as string)
          }
        />
      ),
    });
  }, [navigation]);

  //--- FlatList ---//
  const listRef = useRef(null);
  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  const renderRow: ListRenderItem<APIMedia> = ({ item }) => (
    <ViewCard
      data={item}
      bottomSheetRef={bottomSheetRef}
      setSheetChildren={setSheetChildren}
      setSelectedMedia={setSelectedMedia}
    />
  );

  const renderHeader = () => {
    return (
      <View style={{ paddingHorizontal: SIZING.margin.horizontal }}>
        <Text style={[screenStyles.header, colorPrimary]}>
          {params.type === "movie" &&
            i18n.t("screen.profile.views.header.movie")}
          {params.type === "tv" && i18n.t("screen.profile.views.header.tv")}
        </Text>
        <ViewFilter
          fetchParams={fetchParams}
          setSheetChildren={
            setSheetChildren as Dispatch<
              SetStateAction<{
                genre: boolean;
                shift?: boolean;
                watchlist?: boolean;
              }>
            >
          }
          bottomSheetRef={bottomSheetRef}
        />
      </View>
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
    setView([]); /* Clean Flatlist before Type change */
    setFetchParams({
      genre: newValue,
    }); /* Reset page number to 1 & update genre */
    bottomSheetRef.current?.close();
  };

  return (
    <View style={[{ flex: 1 }, backgroundPrimary]}>
      <Animated.FlatList
        ref={listRef}
        style={screenStyles.noTabScreen}
        contentContainerStyle={screenStyles.flatlistContainer}
        scrollEventThrottle={16}
        entering={FadeInLeft}
        exiting={FadeOutRight}
        onScroll={scrollHandler}
        data={view?.sort((a, b) => a.title.localeCompare(b.title))}
        extraData={sendView}
        renderItem={renderRow}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <ItemSeparator />}
        ListEmptyComponent={<ViewSkeleton />}
        ListHeaderComponent={renderHeader}
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
            type={params.type as string}
            onPress={handleGenre}
            activeValue={fetchParams.genre}
          />
        )}
        {sheetChildren.watchlist && selectedMedia && (
          <AddMedia data={selectedMedia} />
        )}
      </BottomSheetModal>
    </View>
  );
}
