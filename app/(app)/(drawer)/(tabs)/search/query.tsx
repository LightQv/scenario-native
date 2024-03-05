import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FlatList, ListRenderItem, StyleSheet, Text, View } from "react-native";
import { useScrollToTop } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import i18n from "@/services/i18n";
import instanceTmdb from "@/services/instances";
import { notifyError } from "@/components/toasts/Toast";
import TmdbCard from "@/components/tmdb-components/card/TmdbCard";
import BottomFooter from "@/components/listing/BottomFooter";
import { useThemeContext } from "@/app/context/ThemeContext";
import TmdbSkeleton from "@/components/tmdb-components/card/TmdbSkeleton";
import SearchHeader from "@/components/navigation/SearchHeader";
import ItemSeparator from "@/components/listing/ItemSeparator";
import { useSearchHistory } from "@/app/context/SearchHistoryContext";
import HistoryCard from "@/components/api-components/card/HistoryCard";
import CloseSvg from "@/assets/svg/xmark.svg";
import { FONTS, SIZING } from "@/constants/theme";
import useStyle from "@/hooks/useStyle";
import Button from "@/components/ui/Button";

type fetchParams = {
  page: number;
};

export default function QueryScreen() {
  const { THEME } = useThemeContext();
  const { backgroundPrimary, backgroundMain, colorPrimary } = useStyle();
  const { searchHistory, onSaveHistory, onDeleteHistory } = useSearchHistory();
  //--- Fetch States ---//
  const defaultPage: number = 1;
  const [fetchParams, setFetchParams] = useState<fetchParams>({
    page: defaultPage,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<Array<TmdbData> | []>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [query, setQuery] = useState<string>("");

  //--- Fetch Query on TMDB ---//
  useEffect(() => {
    if (query !== "" && loading) {
      instanceTmdb
        .get(
          `/search/multi?query=${query}&include_adult=true&language=${i18n.locale}&page=${fetchParams.page}`
        )
        .then(({ data }) => {
          if (data.total_results > 0) {
            setResult(
              fetchParams.page === 1
                ? data.results
                : [...result, ...data.results]
            );
            setTotalPage(data.total_pages);
            setTotalResults(data.total_results);
          } else {
            setQuery("");
            setTotalPage(0);
            setTotalResults(0);
            notifyError(i18n.t("toast.errorQuery"));
          }
        })
        .finally(() => {
          setLoading(false);
        })
        .catch(() => {
          notifyError(i18n.t("toast.errorTMDB"));
        });
    }
  }, [loading, i18n.locale]);

  //--- One data are fetched, save Search on SecureStore ---//
  useEffect(() => {
    if (query !== "" && !loading) {
      onSaveHistory!({ query: query, total_results: totalResults });
    }
  }, [loading]);

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <SearchHeader
          query={query}
          setQuery={setQuery}
          onTextChange={handleSearchQuery}
        />
      ),
    });
  }, [navigation, query]);

  const handleSearchQuery = () => {
    setResult([]); /* Empty result Array before new initial fetch */
    setFetchParams({ ...fetchParams, page: 1 }); /* Reset page number to 1 */
    listRef.current?.scrollToOffset({
      animated: true,
      offset: 0,
    }); /* Reset scroll position */
    setLoading(true);
  };

  const handleHistoryQuery = (newQuery: string) => {
    setQuery(newQuery);
    setResult([]); /* Empty result Array before new initial fetch */
    setFetchParams({ ...fetchParams, page: 1 }); /* Reset page number to 1 */
    setLoading(true);
  };

  //--- FlatList ---//
  //--- Scroll to Top on Tab Press if active ---//
  const listRef = useRef<FlatList>(null);
  useScrollToTop(listRef);

  const renderRow: ListRenderItem<TmdbData> = ({ item }) => (
    <TmdbCard data={item} media_type={item.media_type} />
  );

  const renderEmptyRow = () => {
    return searchHistory && searchHistory.length > 0 && !loading ? (
      <>
        <View style={styles.header}>
          <Text style={[styles.title, colorPrimary]}>
            {i18n.t("screen.search.history")}
          </Text>
          <Button
            onPress={onDeleteHistory!}
            style={[styles.resetBtn, backgroundMain]}
          >
            <CloseSvg
              width={12}
              height={12}
              color={THEME?.background.primary}
            />
          </Button>
        </View>
        {searchHistory.map((el, i) => {
          return (
            <HistoryCard
              data={el}
              index={i}
              key={i}
              onPress={handleHistoryQuery}
            />
          );
        })}
      </>
    ) : (
      <TmdbSkeleton count={4} />
    );
  };

  const renderFooter = () => {
    return <BottomFooter actualPage={fetchParams.page} totalPage={totalPage} />;
  };

  /* NextPage, Refresh & Sort logic */
  const handleNextPage = () => {
    if (fetchParams.page < totalPage) {
      setFetchParams({ ...fetchParams, page: fetchParams.page + 1 });
      setLoading(true);
    }
  };

  return (
    <View style={[{ flex: 1 }, backgroundPrimary]}>
      <FlatList
        ref={listRef}
        showsVerticalScrollIndicator={false}
        data={result}
        renderItem={renderRow}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <ItemSeparator />}
        ListEmptyComponent={renderEmptyRow}
        ListFooterComponent={renderFooter}
        onEndReached={handleNextPage}
        onEndReachedThreshold={0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SIZING.margin.horizontal,
    paddingVertical: SIZING.margin.vertical,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: FONTS.abril,
    fontSize: SIZING.font.xxxl,
  },
  resetBtn: {
    height: 16,
    width: 16,
    borderRadius: SIZING.radius.full,
    justifyContent: "center",
    alignItems: "center",
  },
});
