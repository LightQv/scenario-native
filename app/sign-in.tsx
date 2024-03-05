import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import React, { useCallback } from "react";
import { Link, useFocusEffect, useLocalSearchParams } from "expo-router";
import { FONTS, LIGHT, SIZING } from "@/constants/theme";
import homeLight from "@/assets/images/home_bg_red.jpg";
import homeDark from "@/assets/images/home_bg_dark.jpg";
import i18n from "@/services/i18n";
import { notifyError } from "@/components/toasts/Toast";
import { StatusBar } from "expo-status-bar";
import Button from "@/components/ui/Button";

export default function SignIn() {
  const darkTheme = useColorScheme() === "dark";
  const params = useLocalSearchParams();

  useFocusEffect(
    useCallback(() => {
      if (params && params.session === "expired") {
        notifyError(i18n.t("toast.expired"));
      }
    }, [params])
  );

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ImageBackground
        source={darkTheme ? homeDark : homeLight}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.container}>
          <Text style={styles.title}>シナリオへようこそ</Text>
          <Text style={styles.subtitle}>{i18n.t("screen.home.title")}</Text>
        </View>
        <View style={styles.authContainer}>
          <Link href={"/(modals)/login"} style={styles.button} asChild>
            <Pressable>
              <Text
                style={[
                  styles.buttonTxt,
                  {
                    textTransform: "uppercase",
                  },
                ]}
              >
                {i18n.t("form.auth.submit.login")}
              </Text>
            </Pressable>
          </Link>
          <Link href={"/(modals)/register"}>
            <Button>
              <Text style={styles.buttonTxt}>
                {i18n.t("screen.home.signup")}
              </Text>
            </Button>
          </Link>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  image: {
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: FONTS.dela,
    fontSize: 110,
    lineHeight: 115,
    color: LIGHT.color.secondary,
  },
  subtitle: {
    fontFamily: FONTS.abril,
    fontSize: SIZING.font.title,
    lineHeight: 20,
    color: LIGHT.color.secondary,
    textTransform: "uppercase",
  },
  authContainer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    width: "100%",
  },
  button: {
    borderWidth: SIZING.border.xl,
    borderColor: LIGHT.color.secondary,
    borderRadius: SIZING.radius.sm,
    paddingVertical: SIZING.margin.horizontal / 2,
    paddingHorizontal: SIZING.margin.horizontal,
  },
  buttonTxt: {
    fontFamily: FONTS.medium,
    fontSize: SIZING.font.lg,
    color: LIGHT.color.secondary,
  },
});
