import { useThemeContext } from "@/app/context/ThemeContext";

export default function useStyle() {
  const { THEME } = useThemeContext();

  //--- Background ---//
  const backgroundPrimary = { backgroundColor: THEME?.background.primary };
  const backgroundSecondary = { backgroundColor: THEME?.background.secondary };
  const backgroundThird = { backgroundColor: THEME?.background.third };
  const backgroundQuad = { backgroundColor: THEME?.background.quad };
  const backgroundAlt = { backgroundColor: THEME?.background.alt };
  const backgroundMain = { backgroundColor: THEME?.color.main };
  const backgroundSecond = { backgroundColor: THEME?.color.second };

  //--- Color ---//
  const colorPrimary = { color: THEME?.color.primary };
  const colorGray = { color: THEME?.color.gray };
  const colorAlt = { color: THEME?.color.alt };
  const colorMain = { color: THEME?.color.main };
  const colorSecond = { color: THEME?.color.second };
  const colorError = { color: THEME?.toast.error };

  //--- Border ---//
  const borderPrimary = { borderColor: THEME?.color.primary };
  const borderThird = { borderColor: THEME?.background.third };
  const borderAlt = { borderColor: THEME?.color.alt };
  const borderMain = { borderColor: THEME?.color.main };

  //--- Border Top ---//
  const borderTopAlt = { borderTopColor: THEME?.background.alt };

  //--- Border Bottom ---//
  const borderBottomThird = { borderBottomColor: THEME?.background.third };
  const borderBottomQuad = { borderBottomColor: THEME?.background.quad };
  const borderBottomAlt = { borderBottomColor: THEME?.background.alt };

  //--- Shadow ---//
  const shadowQuad = { shadowColor: THEME?.background.quad };

  return {
    backgroundPrimary,
    backgroundSecondary,
    backgroundThird,
    backgroundQuad,
    backgroundAlt,
    backgroundMain,
    backgroundSecond,
    colorPrimary,
    colorGray,
    colorAlt,
    colorMain,
    colorSecond,
    colorError,
    borderPrimary,
    borderThird,
    borderAlt,
    borderMain,
    borderTopAlt,
    borderBottomThird,
    borderBottomQuad,
    borderBottomAlt,
    shadowQuad,
  };
}
