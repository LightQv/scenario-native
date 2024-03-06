import BackSvg from "@/assets/svg/arrow-left.svg";
import { useThemeContext } from "@/app/context/ThemeContext";
import { router, useNavigation } from "expo-router";
import { SIZING } from "@/constants/theme";
import actionStyles from "../../styles/action.style";
import useStyle from "@/hooks/useStyle";
import Button from "../ui/Button";
import { useRouterHistory } from "@/app/context/RouterHistoryContext";

export default function BackAction() {
  const { THEME } = useThemeContext();
  const { backgroundPrimary } = useStyle();
  const routes = useNavigation().getState().routeNames;
  const { history } = useRouterHistory();

  //--- Return from Profile Navigator to last screen on Tabs Navigator ---//
  /* This is workaround until a native method from Expo Router is released */
  const handleGoBack = () => {
    if (routes.some((el) => el === "(modals)/banner")) {
      router.navigate({
        pathname: history,
      });
    } else router.back();
  };

  return (
    <Button
      onPress={handleGoBack}
      style={[backgroundPrimary, actionStyles.btn]}
    >
      <BackSvg
        width={SIZING.navigation.button}
        height={SIZING.navigation.button}
        color={THEME?.color.primary}
      />
    </Button>
  );
}
