import { ListRenderItem, Text, View } from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useThemeContext } from "@/app/context/ThemeContext";
import { useAuth } from "@/app/context/AuthContext";
import { instanceAPI } from "@/services/instances";
import { notifyError } from "@/components/toasts/Toast";
import i18n from "@/services/i18n";
import { router, useNavigation } from "expo-router";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { SIZING } from "@/constants/theme";
import WatchlistCard from "@/components/api-components/card/WatchlistCard";
import WatchlistSkeleton from "@/components/api-components/card/WatchlistSkeleton";
import PlusSvg from "@/assets/svg/plus.svg";
import { useWatchlistContext } from "@/app/context/WatchlistContext";
import ItemSeparator from "@/components/listing/ItemSeparator";
import TabHeader from "@/components/navigation/TabHeader";
import OpenDrawer from "@/components/action/OpenDrawer";
import screenStyles from "@/styles/screen.style";
import { useScrollToTop } from "@react-navigation/native";
import useStyle from "@/hooks/useStyle";
import Button from "@/components/ui/Button";

export default function WatchlistScreen() {
  const { THEME } = useThemeContext();
  const {
    backgroundPrimary,
    colorPrimary,
    colorAlt,
    colorMain,
    borderBottomAlt,
  } = useStyle();
  const { updateWatchlist, setUpdateWatchlist } = useWatchlistContext();
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<Watchlist[] | []>([]);

  //--- Fetch API User's Watchlists ---//
  useEffect(() => {
    if (user && user.id) {
      instanceAPI
        .get(`/api/v1/user/watchlist/${user.id}`)
        .then((res) => {
          setWatchlist(res.data);
        })
        .finally(() => setUpdateWatchlist!(false))
        .catch(() => notifyError(i18n.t("toast.error")));
    }
  }, [user?.id, updateWatchlist]);

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
          title={i18n.t("navigation.tabs.link4")}
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

  const renderRow: ListRenderItem<Watchlist> = ({ item }) => (
    <WatchlistCard data={item} />
  );

  const renderHeader = () => {
    return (
      <View
        style={{
          paddingHorizontal: SIZING.margin.horizontal,
        }}
      >
        <View>
          <Text style={[screenStyles.header, colorPrimary]}>
            {i18n.t("navigation.tabs.link4")}
          </Text>
          <Text style={[screenStyles.subHeader, colorAlt]}>
            {i18n.t("screen.watchlist.subtitle")}
          </Text>
        </View>
        <View style={[{ alignItems: "center" }, backgroundPrimary]}>
          <Button
            onPress={() =>
              router.push({
                pathname: "watchlist/(modals)/create",
              })
            }
          >
            <View style={[screenStyles.cardContainer, borderBottomAlt]}>
              <View style={{ gap: 1 }}>
                <Text style={[screenStyles.cardTitle, colorMain]}>
                  {i18n.t("form.watchlist.create.title")}
                </Text>
              </View>
              <PlusSvg width={18} height={18} color={THEME?.color.main} />
            </View>
          </Button>
        </View>
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
        data={watchlist.sort((a, b) => a.title.localeCompare(b.title))}
        extraData={updateWatchlist}
        renderItem={renderRow}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <ItemSeparator />}
        ListEmptyComponent={<WatchlistSkeleton />}
        ListHeaderComponent={renderHeader}
      />
    </View>
  );
}
