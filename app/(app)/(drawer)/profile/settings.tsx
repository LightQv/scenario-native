import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Animated, {
  FadeInLeft,
  FadeOutRight,
  useAnimatedRef,
  useScrollViewOffset,
} from "react-native-reanimated";
import i18n from "@/services/i18n";
import BackAction from "@/components/action/BackAction";
import TabHeader from "@/components/navigation/TabHeader";
import { useNavigation } from "expo-router/src/useNavigation";
import { useThemeContext } from "@/app/context/ThemeContext";
import screenStyles from "../../../../styles/screen.style";
import { FONTS, SIZING } from "@/constants/theme";
import SettingsOption from "@/components/api-components/profile/SettingsOption";
import EditBannerSvg from "@/assets/svg/media-image-plus.svg";
import EditMailSvg from "@/assets/svg/at-sign.svg";
import EditPwSvg from "@/assets/svg/lock.svg";
import LogoutSvg from "@/assets/svg/log-out.svg";
import { router } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import * as Application from "expo-application";
import useStyle from "@/hooks/useStyle";
import Button from "@/components/ui/Button";

export default function SettingsScreen() {
  const { THEME } = useThemeContext();
  const { backgroundPrimary, colorPrimary, colorAlt, colorSecond } = useStyle();
  const { onLogout } = useAuth();

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
          title={i18n.t("screen.profile.settings.header")}
        />
      ),
    });
  }, [navigation]);

  //--- ScrollView ---//
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  return (
    <View style={[{ flex: 1 }, backgroundPrimary]}>
      <StatusBar style="light" />
      <Animated.ScrollView
        style={[screenStyles.noTabScreen, screenStyles.flatlistContainer]}
        ref={scrollRef}
        scrollEventThrottle={16}
        entering={FadeInLeft}
        exiting={FadeOutRight}
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: SIZING.margin.horizontal,
          }}
        >
          <Text style={[screenStyles.header, colorPrimary]}>
            {i18n.t("screen.profile.settings.header")}
          </Text>
          <Text style={[screenStyles.subHeader, colorAlt]}>
            {i18n.t("screen.profile.settings.description")}
          </Text>
        </View>

        {/* Option list opennings Modals */}
        <SettingsOption
          icon={
            <EditBannerSvg
              width={24}
              height={24}
              color={THEME?.color.primary}
            />
          }
          title={i18n.t("screen.profile.settings.list.option1")}
          onPress={() =>
            router.push({
              pathname: "profile/(modals)/banner",
            })
          }
        />
        <SettingsOption
          icon={
            <EditMailSvg width={24} height={24} color={THEME?.color.primary} />
          }
          title={i18n.t("screen.profile.settings.list.option2")}
          onPress={() =>
            router.push({
              pathname: "profile/(modals)/email",
            })
          }
        />
        <SettingsOption
          icon={
            <EditPwSvg width={24} height={24} color={THEME?.color.primary} />
          }
          title={i18n.t("screen.profile.settings.list.option3")}
          onPress={() =>
            router.push({
              pathname: "profile/(modals)/password",
            })
          }
        />
        <SettingsOption
          icon={
            <LogoutSvg width={24} height={24} color={THEME?.color.second} />
          }
          title={i18n.t("navigation.drawer.logout")}
          onPress={() => onLogout!()}
        />

        {/* Opening delete account Modal */}
        <View style={styles.footerContainer}>
          <Button
            onPress={() =>
              router.push({
                pathname: "profile/(modals)/delete",
              })
            }
          >
            <Text style={[styles.deleteTxt, colorSecond]}>
              {i18n.t("screen.profile.settings.list.option4")}
            </Text>
          </Button>
          <Text style={[styles.appText, colorAlt]}>
            {Application.applicationName} - Version{" "}
            {Application.nativeBuildVersion}
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: SIZING.margin.vertical * 1.5,
    marginHorizontal: SIZING.margin.horizontal,
  },
  deleteTxt: {
    fontFamily: FONTS.medium,
    fontSize: SIZING.font.md,
  },
  appText: {
    marginTop: SIZING.margin.vertical,
    fontFamily: FONTS.regular,
    fontSize: SIZING.font.lg,
  },
});
