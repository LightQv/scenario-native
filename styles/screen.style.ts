import { Platform, StyleSheet } from "react-native";

import { FONTS, SIZING } from "@/constants/theme";

const screenStyles = StyleSheet.create({
  screenLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatlistContainer: {
    marginTop: SIZING.header.height * 2.2,
    paddingBottom: SIZING.header.height * 2.2,
  },
  noTabScreen: {
    marginBottom: Platform.OS === "ios" ? SIZING.margin.vertical * 2 : 0,
  },
  header: {
    fontFamily: FONTS.abril,
    fontSize: 35,
  },
  subHeader: {
    fontFamily: FONTS.regular,
    fontSize: SIZING.font.md,
    paddingVertical: SIZING.margin.vertical,
  },
  sheetContainer: {
    width: SIZING.device.width,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: SIZING.margin.horizontal,
    paddingVertical: 4,
  },

  /* New Watchlist based on components/card/WatchlistCard.tsx */
  cardContainer: {
    height: SIZING.card.media.height,
    width: SIZING.device.width - SIZING.margin.horizontal * 2,
    borderBottomWidth: SIZING.border.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SIZING.margin.vertical * 2,
    alignItems: "center",
  },
  cardTitle: {
    fontFamily: FONTS.abril,
    fontSize: SIZING.font.xxxl,
  },
});

export default screenStyles;
