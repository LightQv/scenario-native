import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ListRenderItem, Text, View } from "react-native";
import { useNavigation } from "expo-router";
import TabHeader from "@/components/navigation/TabHeader";
import OpenDrawer from "@/components/action/OpenDrawer";
import i18n from "@/services/i18n";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useScrollToTop } from "@react-navigation/native";
import screenStyles from "@/styles/screen.style";
import ItemSeparator from "@/components/listing/ItemSeparator";
import { SIZING } from "@/constants/theme";
import OpenSearch from "@/components/filter/OpenSearch";
import TmdbCard from "@/components/tmdb-components/card/TmdbCard";
import { notifyError } from "@/components/toasts/Toast";
import instanceTmdb from "@/services/instances";
import TmdbSkeleton from "@/components/tmdb-components/card/TmdbSkeleton";
import useStyle from "@/hooks/useStyle";

export default function SearchScreen() {
  const { backgroundPrimary, colorPrimary } = useStyle();
  const [loading, setLoading] = useState<boolean>(true);
  const [suggestion, setSuggestion] = useState<Array<TmdbData> | []>([]);

  //--- Fetch TMDB Trending data ---//
  useEffect(() => {
    if (loading) {
      instanceTmdb
        .get(`trending/all/day?language=${i18n.locale}`)
        .then(({ data }) => {
          setSuggestion(data.results);
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
          title={i18n.t("navigation.tabs.link1")}
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
    <TmdbCard data={item} media_type={item.media_type} />
  );

  const renderHeader = () => {
    return (
      <View
        style={{
          paddingHorizontal: SIZING.margin.horizontal,
        }}
      >
        <Text style={[screenStyles.header, colorPrimary]}>
          {i18n.t("navigation.tabs.link1")}
        </Text>
        <OpenSearch />
      </View>
    );
  };

  return (
    <View style={[{ flex: 1 }, backgroundPrimary]}>
      <Animated.FlatList
        ref={listRef}
        contentContainerStyle={screenStyles.flatlistContainer}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        data={suggestion.slice(0, 10)}
        renderItem={renderRow}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <ItemSeparator />}
        ListEmptyComponent={<TmdbSkeleton count={3} />}
        ListHeaderComponent={renderHeader}
      />
    </View>
  );
}
