import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import contentStyles from "@/styles/content.style";
import i18n from "@/services/i18n";
import { useAuth } from "@/app/context/AuthContext";
import { useViewContext } from "@/app/context/ViewContext";
import { instanceAPI } from "@/services/instances";
import { notifyError } from "@/components/toasts/Toast";
import { curveBasis, line, scaleLinear } from "d3";
import { SIZING } from "@/constants/theme";
import LineChart from "@/components/chart/LineChart";
import Animated from "react-native-reanimated";
import useStyle from "@/hooks/useStyle";

//--- Graph Setup ---//
const CARD_WIDTH = SIZING.device.width - SIZING.margin.horizontal * 2;
const GRAPH_WIDTH = CARD_WIDTH - SIZING.margin.horizontal * 2;
const CARD_HEIGHT = SIZING.image.height;
const GRAPH_HEIGHT = SIZING.image.height * 0.6;

export default function YearStat() {
  const {
    backgroundPrimary,
    backgroundSecondary,
    colorPrimary,
    borderBottomThird,
  } = useStyle();
  const { user } = useAuth();
  const { sendView } = useViewContext();
  const [movieView, setMovieView] = useState<MediaRelease[] | []>([]);
  const [tvView, setTvView] = useState<MediaRelease[] | []>([]);

  //--- Fetch User's Stats ---//
  useEffect(() => {
    const getViewByType = async () => {
      if (user && user.id) {
        try {
          const movieView = await instanceAPI.get(
            `/api/v1/stats/year/movie/${user.id}`
          );
          if (movieView) {
            setMovieView(movieView.data);
          } else throw new Error();

          const tvView = await instanceAPI.get(
            `/api/v1/stats/year/tv/${user.id}`
          );
          if (tvView) {
            setTvView(tvView.data);
          } else throw new Error();
        } catch (err: any) {
          console.warn(err);
          notifyError(i18n.t("toast.error"));
        }
      }
    };

    getViewByType();
  }, [user?.id, sendView]);

  //--- Return Min, Max & CurvedLine based on Data set ---//
  const makeGraph = (data: MediaRelease[]): GraphData => {
    const minY = Math.min(...data.map((el) => el._count));
    const maxY = Math.max(...data.map((el) => el._count));

    const minX = Math.min(...data.map((el) => el.release_year));
    const maxX = Math.max(...data.map((el) => el.release_year));

    const yAxis = scaleLinear().domain([0, maxY]).range([GRAPH_HEIGHT, 35]);
    const xAxis = scaleLinear()
      .domain([minX, maxX])
      .range([10, GRAPH_WIDTH - 10]);

    const curvedLine = line<MediaRelease>()
      .x((d) => xAxis(d.release_year))
      .y((d) => yAxis(d._count))
      .curve(curveBasis)(data);

    return {
      min: minY,
      max: maxY,
      curve: curvedLine!,
    };
  };

  /* Set Data */
  const graphData = [makeGraph(movieView), makeGraph(tvView)];

  return (
    <View
      style={[contentStyles.container, borderBottomThird, backgroundPrimary]}
    >
      <Text style={[contentStyles.categoryTitle, colorPrimary]}>
        {i18n.t("chart.decade.title")}
      </Text>

      <Animated.View style={[styles.graphCard, backgroundSecondary]}>
        <LineChart
          title={i18n.t("chart.decade.title")}
          height={GRAPH_HEIGHT}
          width={GRAPH_WIDTH}
          data={graphData}
          bottomPadding={20}
          leftPadding={0}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  graphCard: {
    alignSelf: "center",
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    borderRadius: SIZING.radius.sm,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
