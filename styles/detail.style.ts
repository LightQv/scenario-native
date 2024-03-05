import { FONTS, SIZING } from "@/constants/theme";
import { StyleSheet } from "react-native";

const detailStyles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZING.margin.horizontal + 4,
    paddingVertical: SIZING.margin.vertical * 1.5,
    gap: 12,
    borderBottomWidth: SIZING.border.md,
  },
  imageContainer: {
    width: "100%",
  },
  image: {
    width: "100%",
    height: SIZING.image.height,
  },
  title: {
    fontFamily: FONTS.abril,
    fontSize: 28,
    lineHeight: 30,
    marginTop: 10,
  },
  subtitle: {
    marginTop: 6,
    fontFamily: FONTS.mediumItalic,
    fontSize: SIZING.font.xl,
  },
  pillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pillElement: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    fontFamily: FONTS.regular,
    fontSize: SIZING.font.sm,
    borderRadius: SIZING.radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  info: {
    marginTop: 4,
    fontFamily: FONTS.italic,
    fontSize: SIZING.font.md,
  },
  description: {
    marginBottom: 4,
    fontFamily: FONTS.regular,
    fontSize: SIZING.font.md,
    lineHeight: 20,
    textAlign: "justify",
  },

  /* List */
  listImage: {
    width: "100%",
    aspectRatio: 4 / 6,
    borderRadius: SIZING.radius.sm,
    borderWidth: SIZING.border.md,
  },
  infoContainer: {
    width: "100%",
    paddingHorizontal: 4,
    paddingTop: 6,
  },
  cardHeader: {
    fontFamily: FONTS.bold,
    fontSize: SIZING.font.xl,
  },
  cardTitle: {
    fontFamily: FONTS.regular,
    fontSize: SIZING.font.md,
  },
  cardDescription: {
    fontFamily: FONTS.italic,
    fontSize: SIZING.font.sm,
  },
});

export default detailStyles;
