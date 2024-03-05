import { FONTS, SIZING } from "@/constants/theme";
import { StyleSheet } from "react-native";

const cardStyles = StyleSheet.create({
  cardContainer: {
    height: SIZING.card.media.height,
    width: SIZING.device.width - SIZING.margin.horizontal * 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    gap: 20,
    paddingVertical: SIZING.margin.vertical,
  },
  cardBody: {
    flex: 7.5,
    gap: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: FONTS.abril,
    fontSize: SIZING.font.xxxl,
  },
  subtitle: {
    fontFamily: FONTS.italic,
    fontSize: SIZING.font.md,
  },
  cardImage: {
    flex: 1,
    height: "100%",
    position: "relative",
  },
  image: {
    borderRadius: SIZING.radius.xs,
    borderWidth: SIZING.border.xs,
    height: "100%",
  },

  /* Swipe */
  swipeBtn: {
    justifyContent: "center",
    alignItems: "center",
    width: SIZING.card.media.height,
    height: "100%",
  },
  simpleSwipContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: SIZING.card.media.height,
  },
  doubleSwipeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: SIZING.card.media.height * 2,
  },
});

export default cardStyles;
