import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import contentStyles from "@/styles/content.style";
import { useThemeContext } from "@/app/context/ThemeContext";
import i18n from "@/services/i18n";
import { useAuth } from "@/app/context/AuthContext";
import { useViewContext } from "@/app/context/ViewContext";
import { instanceAPI } from "@/services/instances";
import { notifyError } from "@/components/toasts/Toast";
import { FONTS, SIZING } from "@/constants/theme";
import useStyle from "@/hooks/useStyle";

export default function TypeStat() {
  const { THEME } = useThemeContext();
  const { backgroundPrimary, colorPrimary, borderBottomThird } = useStyle();
  const { user } = useAuth();
  const { sendView } = useViewContext();
  const [movieCount, setMovieCount] = useState<number>(0);
  const [tvCount, setTvCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  //--- Fetch User's Stats ---//
  useEffect(() => {
    getViewCount();
  }, [user?.id, sendView]);

  const getViewCount = async () => {
    if (user && user.id) {
      try {
        const movieCount = await instanceAPI.get(
          `/api/v1/user/view/count/movie/${user.id}`
        );
        if (movieCount) {
          setMovieCount(movieCount.data[0]._count);
        } else throw new Error();

        const tvCount = await instanceAPI.get(
          `/api/v1/user/view/count/tv/${user.id}`
        );
        if (tvCount) {
          setTvCount(tvCount.data[0]._count);
        } else throw new Error();
      } catch (err: any) {
        if (err.request.status !== 403) {
          notifyError(i18n.t("toast.error"));
        }
      }
    }
  };

  useEffect(() => {
    setTotalCount(movieCount + tvCount);
  }, [movieCount, tvCount]);

  const data = {
    labels: [i18n.t("chart.percentage.movie"), i18n.t("chart.percentage.tv")],
    datasets: [
      {
        data: [(movieCount * 100) / totalCount, (tvCount * 100) / totalCount],
        colors: [() => THEME!.color.main, () => THEME!.color.second],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: THEME?.background.secondary,
    backgroundGradientTo: THEME?.background.secondary,
    color: () => THEME!.color.primary,
    decimalPlaces: 0,
    barPercentage: 2,
    propsForBackgroundLines: {
      stroke: THEME?.background.third,
      strokeWidth: SIZING.border.md,
      strokeDasharray: "0",
    },
    propsForLabels: {
      fontFamily: FONTS.abril,
      fontSize: SIZING.font.sm,
    },
  };

  return (
    <View
      style={[contentStyles.container, borderBottomThird, backgroundPrimary]}
    >
      <Text style={[contentStyles.categoryTitle, colorPrimary]}>
        {i18n.t("chart.percentage.title")}
      </Text>

      <View style={styles.graph}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  graph: {
    alignItems: "center",
  },
});
