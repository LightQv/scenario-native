import { Dimensions } from "react-native";

const deviceWidth = Math.round(Dimensions.get("window").width);

const BACKDROP = {
  opacity: 0.5,
};

const BLURHASH = {
  hash: "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[",
  transition: 100,
};

const BUTTON = {
  opacity: 0.6,
};

const FONTS = {
  abril: "AbrilFatface-Regular",
  dela: "DelaGothicOne-Regular",
  regular: "FiraSans-Regular",
  italic: "FiraSans-Italic",
  thin: "FiraSans-Thin",
  thinItalic: "FiraSans-ThinItalic",
  light: "FiraSans-Light",
  lightItalic: "FiraSans-Light",
  medium: "FiraSans-Medium",
  mediumItalic: "FiraSans-MediumItalic",
  bold: "FiraSans-Bold",
  boldItalic: "FiraSans-BoldItalic",
};

const SIZING = {
  device: {
    width: deviceWidth,
  },
  margin: {
    horizontal: 16,
    vertical: 10,
  },
  image: {
    height: 280,
  },
  header: {
    height: 45,
  },
  navigation: {
    icon: 26,
    button: 18,
  },
  card: {
    tmdb: {
      height: 120,
    },
    media: {
      height: 80,
    },
  },
  border: {
    xs: 0.5,
    md: 1,
    lg: 1.5,
    xl: 2,
  },
  radius: {
    xs: 0.5,
    sm: 6,
    md: 14,
    lg: 16,
    full: 999,
  },
  font: {
    xs: 11,
    sm: 12,
    md: 13,
    lg: 14,
    xl: 15,
    xxl: 16,
    xxxl: 18,
    title: 20,
    header: 32,
  },
};

const LIGHT: ColorTheme = {
  background: {
    primary: "#FFFFFF",
    secondary: "#F7F7F7",
    third: "#E5E7EB",
    quad: "#D1D5DB",
    alt: "#F7F7F7",
  },
  color: {
    primary: "#000000",
    secondary: "#FFFFFF",
    alt: "#000000",
    gray: "#D1D5DB",
    main: "#eab208",
    second: "#EA0B17",
  },
  grade: {
    excellent: "#549c47",
    good: "#adc178",
    average: "#eab208",
    bad: "#ef4444",
  },
  toast: {
    success: "#549c47",
    warning: "#fb8b24",
    error: "#ef4444",
    promise: "#eab208",
  },
};

const DARK: ColorTheme = {
  background: {
    primary: "#121212",
    secondary: "#16181C",
    third: "#1D1F23",
    quad: "#5a606c",
    alt: "#1D1F23",
  },
  color: {
    primary: "#E7E9EA",
    secondary: "#71767B",
    alt: "#71767B",
    gray: "#71767B",
    main: "#f9cd4a",
    second: "#c92c35",
  },
  grade: {
    excellent: "#82c177",
    good: "#c6d4a1",
    average: "#f9cd4a",
    bad: "#f47c7c",
  },
  toast: {
    success: "#82c177",
    warning: "#fcae66",
    error: "#f47c7c",
    promise: "#f9cd4a",
  },
};

export { BACKDROP, BLURHASH, BUTTON, FONTS, LIGHT, DARK, SIZING };
