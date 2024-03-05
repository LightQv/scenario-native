import { StyleSheet } from "react-native";

import { FONTS, SIZING } from "@/constants/theme";

const formStyles = StyleSheet.create({
  backBtn: {
    fontFamily: FONTS.medium,
    fontSize: SIZING.font.xl,
  },
  form: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
    width: "100%",
  },
  titleContainer: {
    width: "85%",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontFamily: FONTS.abril,
    fontSize: SIZING.font.header,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: FONTS.light,
    fontSize: SIZING.font.xl,
    textAlign: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    width: "70%",
  },
  labelContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
  },
  label: {
    fontFamily: FONTS.regular,
    fontSize: SIZING.font.lg,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: SIZING.border.md,
    width: "100%",
  },
  input: {
    paddingVertical: 10,
    textAlign: "left",
    flexBasis: 1,
    flexGrow: 1,
  },
  error: {
    fontFamily: FONTS.medium,
    fontSize: SIZING.font.lg,
  },
  borderBtn: {
    borderWidth: SIZING.border.md,
    borderRadius: SIZING.radius.sm,
    paddingVertical: 8,
    paddingHorizontal: SIZING.margin.horizontal,
    position: "relative",
    overflow: "hidden",
  },
  btnText: {
    fontFamily: FONTS.medium,
    textTransform: "uppercase",
  },
  switchContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  underlineBtn: {
    borderBottomWidth: SIZING.border.md,
    paddingBottom: 4,
  },
  switchBtn: {
    fontFamily: FONTS.medium,
    fontSize: SIZING.font.lg,
  },
  forgotBtn: {
    fontFamily: FONTS.regular,
    fontSize: SIZING.font.xl,
  },
  loader: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 3,
  },
});

export default formStyles;
