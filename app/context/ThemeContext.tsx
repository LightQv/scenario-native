import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { DARK, LIGHT } from "@/constants/theme";

interface IThemeProps {
  THEME?: ColorTheme;
  darkTheme?: boolean;
}

const ThemeContext = createContext<IThemeProps>({});

export const useThemeContext = () => {
  return useContext(ThemeContext);
};

export function ThemeProvider({ children }: ContextProps) {
  const deviceTheme = useColorScheme();
  const initialTheme = deviceTheme === "dark" ? DARK : LIGHT;
  const darkTheme = useColorScheme() === "dark";
  const [theme, setTheme] = useState(initialTheme);

  const themeObj = useMemo(() => {
    return {
      THEME: theme,
      darkTheme,
    };
  }, [theme]);

  useEffect(() => {
    if (deviceTheme === "light") {
      setTheme(LIGHT);
    }
    if (deviceTheme === "dark") {
      setTheme(DARK);
    }
  }, [deviceTheme]);

  return (
    <ThemeContext.Provider value={themeObj}>{children}</ThemeContext.Provider>
  );
}
