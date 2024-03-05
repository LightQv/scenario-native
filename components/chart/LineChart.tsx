import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Animated from "react-native-reanimated";
import { FONTS, SIZING } from "@/constants/theme";
import { G, Line, Path, Svg } from "react-native-svg";
import { useThemeContext } from "@/app/context/ThemeContext";
import i18n from "@/services/i18n";
import formStyles from "@/styles/form.style";
import useStyle from "@/hooks/useStyle";
import Button from "../ui/Button";

type LineChartProps = {
  data: GraphData[];
  title: string;
  height: number;
  width: number;
  bottomPadding: number;
  leftPadding: number;
};

export default function LineChart({
  data,
  title,
  height,
  width,
  bottomPadding,
  leftPadding,
}: LineChartProps) {
  const { THEME } = useThemeContext();
  const { colorPrimary, colorMain, borderPrimary, borderMain } = useStyle();
  const [curveIndex, setCurveIndex] = useState<number>(0);

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={[styles.titleTxt, colorPrimary]}>{title}</Text>
      </View>
      <Animated.View style={styles.chartContainer}>
        <Svg width={width} height={height} stroke={THEME?.color.main}>
          <G y={-bottomPadding}>
            <Line
              x1={leftPadding}
              y1={height}
              x2={width}
              y2={height}
              stroke={THEME?.background.third}
              strokeWidth="1"
            />
            <Line
              x1={leftPadding}
              y1={height * 0.8}
              x2={width}
              y2={height * 0.8}
              stroke={THEME?.background.third}
              strokeWidth="1"
            />
            <Line
              x1={leftPadding}
              y1={height * 0.6}
              x2={width}
              y2={height * 0.6}
              stroke={THEME?.background.third}
              strokeWidth="1"
            />
            <Line
              x1={leftPadding}
              y1={height * 0.4}
              x2={width}
              y2={height * 0.4}
              stroke={THEME?.background.third}
              strokeWidth="1"
            />
            <Line
              x1={leftPadding}
              y1={height * 0.2}
              x2={width}
              y2={height * 0.2}
              stroke={THEME?.background.third}
              strokeWidth="1"
            />
            <Path
              d={data[curveIndex].curve}
              strokeWidth={2}
              fill={"transparent"}
            />
          </G>
        </Svg>
      </Animated.View>
      <View style={[styles.buttonContainer]}>
        <Button
          onPress={() => setCurveIndex(0)}
          style={[
            formStyles.borderBtn,
            {
              width: 90,
              alignItems: "center",
            },
            curveIndex === 0 ? borderMain : borderPrimary,
          ]}
          // disabled={curveIndex === 0}
        >
          <Text
            style={[
              styles.buttonTxt,
              curveIndex === 0 ? colorMain : colorPrimary,
            ]}
          >
            {i18n.t("chart.decade.movie").toUpperCase()}
          </Text>
        </Button>
        <Button
          onPress={() => setCurveIndex(1)}
          style={[
            formStyles.borderBtn,
            { width: 90 },
            curveIndex === 1 ? borderMain : borderPrimary,
          ]}
          // disabled={curveIndex === 1}
        >
          <Text
            style={[
              styles.buttonTxt,
              curveIndex === 1 ? colorMain : colorPrimary,
            ]}
          >
            {i18n.t("chart.decade.tv").toUpperCase()}
          </Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginVertical: SIZING.margin.vertical,
    marginHorizontal: SIZING.margin.horizontal * 1.5,
  },
  titleTxt: {
    fontFamily: FONTS.medium,
    fontSize: SIZING.font.xxxl,
    marginTop: 10,
  },
  chartContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  buttonTxt: {
    fontFamily: FONTS.regular,
    fontSize: SIZING.font.sm,
  },
});
