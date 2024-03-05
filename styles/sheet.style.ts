import { StyleSheet } from "react-native";
import { FONTS, SIZING } from "../constants/theme";

const sheetStyles = StyleSheet.create({
  header: {
    borderBottomWidth: SIZING.border.md,
  },
  sheetTitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZING.font.xxl,
    paddingVertical: 10,
    textAlign: "center",
  },
  listContainer: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  listItem: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZING.font.lg,
  },
  item: {
    borderRadius: SIZING.radius.full,
    borderWidth: SIZING.border.lg,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default sheetStyles;
