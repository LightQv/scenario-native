import { View } from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import instanceTmdb from "@/services/instances";
import i18n from "@/services/i18n";
import { notifyError } from "@/components/toasts/Toast";
import { BACKDROP } from "@/constants/theme";
import Banner from "@/components/tmdb-components/details/content/Banner";
import Header from "@/components/tmdb-components/details/content/Header";
import List from "@/components/tmdb-components/details/content/List";
import Screenshot from "@/components/tmdb-components/details/content/Screenshot";
import Provider from "@/components/tmdb-components/details/content/Provider";
import Recommandation from "@/components/tmdb-components/details/content/Recommandation";
import Bio from "@/components/tmdb-components/details/person/Bio";
import KnownFor from "@/components/tmdb-components/details/person/KnownFor";
import ViewAction from "@/components/action/ViewAction";
import Animated, {
  FadeInLeft,
  FadeOutRight,
  useAnimatedRef,
  useScrollViewOffset,
} from "react-native-reanimated";
import ShareMedia from "@/components/action/ShareMedia";
import { useThemeContext } from "@/app/context/ThemeContext";
import BackAction from "@/components/action/BackAction";
import AddToWatchlist from "@/components/action/AddToWatchlist";
import DetailHeader from "@/components/navigation/DetailHeader";
import HeaderTitle from "@/components/navigation/HeaderTitle";
import { StatusBar } from "expo-status-bar";
import screenStyles from "@/styles/screen.style";
import CreateMedia from "@/components/sheet-children/CreateMedia";
import useStyle from "@/hooks/useStyle";

export default function DetailsScreen() {
  const { id, type } = useLocalSearchParams();
  const { THEME } = useThemeContext();
  const { backgroundPrimary, backgroundQuad } = useStyle();
  const [data, setData] = useState<TmdbDetails | null>(null);
  const [person, setPerson] = useState<TmdbDetails | null>(null);

  //--- Fetch Data's details based on type Params ---//
  useEffect(() => {
    if (type && id) {
      setData(null);
      setPerson(null);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      instanceTmdb
        .get(`/${type}/${id}?language=${i18n.locale}&append_to_response=videos`)
        .then(({ data }) => {
          if (type === "person") {
            setPerson(data);
          } else setData(data);
        })
        .catch(() => {
          notifyError(i18n.t("toast.errorTMDB"));
        });
    }
  }, [type, id, i18n]);

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
              {(data || person) && (
                <HeaderTitle
                  offset={scrollOffset}
                  title={
                    (data?.title as string) ||
                    (data?.name as string) ||
                    (person?.name as string)
                  }
                />
              )}
            </View>
          }
          headerRight={
            <View style={{ flexDirection: "row", gap: 10 }}>
              {data && type !== "person" && (
                <>
                  <ShareMedia title={data?.title || data?.name} />
                  <AddToWatchlist bottomSheetRef={bottomSheetRef} />
                  <ViewAction data={data} />
                </>
              )}
              {person && type === "person" && (
                <ShareMedia
                  title={(data?.title as string) || (data?.name as string)}
                />
              )}
            </View>
          }
        />
      ),
    });
  }, [navigation, data, person, type, THEME]);

  //--- ScrollView ---//
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

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
  return (
    <View style={[{ flex: 1 }, backgroundPrimary]}>
      <StatusBar style={type === "person" ? "auto" : "light"} />
      <Animated.ScrollView
        style={screenStyles.noTabScreen}
        ref={scrollRef}
        scrollEventThrottle={16}
        entering={FadeInLeft}
        exiting={FadeOutRight}
      >
        {type !== "person" && data && (
          <>
            <Banner
              src={data.backdrop_path}
              alt={data.title}
              score={data.vote_average}
              videos={data.videos?.results}
              offset={scrollOffset}
            />
            <Header
              title={data.title || data.name}
              original_title={data.original_title || data.original_name}
              genres={data.genres}
              release={data.release_date}
              runtime={data.runtime}
              synopsis={data.overview}
              status={data.status}
              start={data.first_air_date}
              end={data.last_air_date}
              seasonsNumber={data.number_of_seasons}
              episodesNumber={data.number_of_episodes}
            />
            <List title={i18n.t("screen.detail.media.cast")} />
            {type === "tv" && (
              <List
                title={i18n.t("screen.detail.media.seasons.title")}
                data={data.seasons}
              />
            )}
            <Screenshot contentId={data.id} />
            <Provider contentId={data.id} />
            <Recommandation contentId={data.id} />
          </>
        )}
        {type === "person" && person && (
          <>
            <Bio
              src={person.profile_path}
              alt={person.name}
              name={person.name}
              job={person.known_for_department}
              bio={person.biography}
            />
            <KnownFor />
          </>
        )}
      </Animated.ScrollView>
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={0}
        backdropComponent={renderBackdrop}
        style={screenStyles.sheetContainer}
        backgroundStyle={backgroundPrimary}
        handleIndicatorStyle={backgroundQuad}
      >
        {data && <CreateMedia data={data} />}
      </BottomSheetModal>
    </View>
  );
}
