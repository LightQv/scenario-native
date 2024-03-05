import { FONTS, SIZING } from "@/constants/theme";
import { StyleSheet } from "react-native";

const contentStyles = StyleSheet.create({
  container: {
    paddingVertical: SIZING.margin.vertical * 1.5,
    gap: 12,
    borderBottomWidth: SIZING.border.md,
  },
  categoryTitle: {
    marginHorizontal: 20,
    fontFamily: FONTS.abril,
    fontSize: SIZING.font.title,
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
});

export default contentStyles;
