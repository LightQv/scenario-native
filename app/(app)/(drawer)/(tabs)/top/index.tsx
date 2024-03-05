import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ListRenderItem, Text, View } from "react-native";
import { useNavigation } from "expo-router";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import i18n from "@/services/i18n";
import instanceTmdb from "@/services/instances";
import { BACKDROP, SIZING } from "@/constants/theme";
import { notifyError } from "@/components/toasts/Toast";
import TmdbFilter from "@/components/filter/TmdbFilter";
import TmdbCard from "@/components/tmdb-components/card/TmdbCard";
import SelectFilter from "@/components/sheet-children/SelectFilter";
import BottomFooter from "@/components/listing/BottomFooter";
import { typeList } from "@/services/data";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import TmdbSkeleton from "@/components/tmdb-components/card/TmdbSkeleton";
import ItemSeparator from "@/components/listing/ItemSeparator";
import TabHeader from "@/components/navigation/TabHeader";
import OpenDrawer from "@/components/action/OpenDrawer";
import screenStyles from "@/styles/screen.style";
import { useScrollToTop } from "@react-navigation/native";
import useStyle from "@/hooks/useStyle";

type fetchParams = {
  type: string;
  page: number;
};

type sheetChildren = {
  type: boolean;
};

export default function TopScreen() {
  const { backgroundPrimary, backgroundQuad, colorPrimary } = useStyle();
  //--- Fetch States ---//
  const defaultType: string = "movie";
  const defaultPage: number = 1;
  const [fetchParams, setFetchParams] = useState<fetchParams>({
    type: defaultType,
    page: defaultPage,
  });
  const [sheetChildren, setSheetChildren] = useState<sheetChildren>({
    type: false,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<Array<TmdbData> | []>([]);
  const [totalPage, setTotalPage] = useState<number>(0);

  //--- Fetch TMDB Discover data ---//
  useEffect(() => {
    if (loading) {
      instanceTmdb
        .get(
          `/${fetchParams.type}/top_rated?language=${i18n.locale}&page=${fetchParams.page}`
        )
        .then(({ data }) => {
          setResult(
            fetchParams.page === 1 ? data.results : [...result, ...data.results]
          );
          setTotalPage(data.total_pages);
        })
        .finally(() => setLoading(false))
        .catch(() => {
          notifyError(i18n.t("toast.errorTMDB"));
        });
    }
  }, [loading, i18n.locale]);

  //--- Screen Header ---//
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <TabHeader
          offset={scrollOffset}
          headerRight={
            <View style={{ marginRight: -1 }}>
              <OpenDrawer />
            </View>
          }
          title={i18n.t("navigation.tabs.link2")}
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
  useScrollToTop(listRef); /* ScrollToTop on Tab Press */

  const renderRow: ListRenderItem<TmdbData> = ({ item }) => (
    <TmdbCard data={item} media_type={fetchParams.type} />
  );

  const renderHeader = () => {
    return (
      <View>
        <Text
          style={[
            screenStyles.header,
            { paddingHorizontal: SIZING.margin.horizontal },
            colorPrimary,
          ]}
        >
          {i18n.t("navigation.tabs.link2")}
        </Text>
        <TmdbFilter
          fetchParams={fetchParams}
          setSheetChildren={setSheetChildren}
          bottomSheetRef={bottomSheetRef}
        />
      </View>
    );
  };

  const renderFooter = () => {
    return <BottomFooter actualPage={fetchParams.page} totalPage={totalPage} />;
  };

  /* NextPage logic */
  const handleNextPage = () => {
    if (fetchParams.page < totalPage) {
      setFetchParams({ ...fetchParams, page: fetchParams.page + 1 });
      setLoading(true);
    }
  };

  //--- Bottom Sheet ---//
  /* Sheet Cfg */
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["30%"], []);

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
  const handleType = (newValue: string) => {
    setFetchParams({
      ...fetchParams,
      page: 1,
      type: newValue,
    }); /* Reset page number to 1 & update type */
    setResult([]); /* Empty result Array before new initial fetch */
    bottomSheetRef.current?.close();
    setLoading(true);
  };

  return (
    <View style={[{ flex: 1 }, backgroundPrimary]}>
      <Animated.FlatList
        ref={listRef}
        contentContainerStyle={screenStyles.flatlistContainer}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        data={result}
        renderItem={renderRow}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <ItemSeparator />}
        ListEmptyComponent={<TmdbSkeleton count={3} />}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={handleNextPage}
        onEndReachedThreshold={0}
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
        {sheetChildren.type && (
          <SelectFilter
            title={i18n.t("filter.type.title")}
            data={typeList}
            onPress={handleType}
            activeValue={fetchParams.type}
          />
        )}
      </BottomSheetModal>
    </View>
  );
}
