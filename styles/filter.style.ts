import { FONTS, SIZING } from "@/constants/theme";
import { StyleSheet } from "react-native";

const filterStyles = StyleSheet.create({
  container: {
    paddingTop: SIZING.margin.vertical,
  },
  box: {
    borderWidth: SIZING.border.md,
    borderRadius: SIZING.radius.sm,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  filterBox: {
    paddingHorizontal: SIZING.margin.horizontal / 1.5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
  },
  label: {
    fontFamily: FONTS.regular,
    fontSize: SIZING.font.md,
  },
  searchBar: {
    flexShrink: 1,
    flexGrow: 1,
    borderWidth: SIZING.border.md,
    borderRadius: SIZING.radius.sm,
    paddingVertical: 8,
    paddingHorizontal: SIZING.margin.horizontal / 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "flex-start",
  },
  placeholder: {
    fontFamily: FONTS.regular,
    fontSize: SIZING.font.md,
    flexShrink: 1,
    flexGrow: 1,
  },
});

export default filterStyles;
