import React, { useLayoutEffect } from "react";
import i18n from "@/services/i18n";
import Animated, {
  FadeInLeft,
  FadeOutRight,
  useAnimatedRef,
  useScrollViewOffset,
} from "react-native-reanimated";
import ProfileBanner from "@/components/api-components/profile/ProfileBanner";
import { StatusBar } from "expo-status-bar";
import ProfileHeader from "@/components/api-components/profile/ProfileHeader";
import { useNavigation } from "expo-router";
import BackAction from "@/components/action/BackAction";
import DetailHeader from "@/components/navigation/DetailHeader";
import HeaderTitle from "@/components/navigation/HeaderTitle";
import { View } from "react-native";
import screenStyles from "@/styles/screen.style";
import { useThemeContext } from "@/app/context/ThemeContext";
// import TypeStat from "@/components/api-components/profile/TypeStat";
// import YearStat from "@/components/api-components/profile/YearStat";
import useStyle from "@/hooks/useStyle";

export default function StatsScreen() {
  const { THEME } = useThemeContext();
  const { backgroundPrimary } = useStyle();

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
              <HeaderTitle
                offset={scrollOffset}
                title={i18n.t("navigation.drawer.link1")}
              />
            </View>
          }
        />
      ),
    });
  }, [navigation, THEME]);

  //--- ScrollView ---//
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  return (
    <View style={[{ flex: 1 }, backgroundPrimary]}>
      <StatusBar style="light" />
      <Animated.ScrollView
        style={screenStyles.noTabScreen}
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollEnabled={false} /* Enable when charts are done */
        entering={FadeInLeft}
        exiting={FadeOutRight}
      >
        <ProfileBanner offset={scrollOffset} />
        <ProfileHeader title={i18n.t("screen.profile.stats.header")} />
        {/* <TypeStat /> */}
        {/* <YearStat /> */}
      </Animated.ScrollView>
    </View>
  );
}
