import React, { Dispatch, SetStateAction } from "react";
import { SIZING } from "@/constants/theme";
import { useThemeContext } from "@/app/context/ThemeContext";
import ShownSvg from "@/assets/svg/eye.svg";
import HiddenSvg from "@/assets/svg/eye-closed.svg";
import Button from "../ui/Button";

type ShowPasswordProps = {
  hidePassword: boolean;
  setHidePassword: Dispatch<SetStateAction<boolean>>;
};

export default function ShowPassword({
  hidePassword,
  setHidePassword,
}: ShowPasswordProps) {
  const { THEME } = useThemeContext();

  return (
    <Button onPress={() => setHidePassword(!hidePassword)}>
      {hidePassword ? (
        <HiddenSvg
          width={SIZING.navigation.button}
          height={SIZING.navigation.button}
          color={THEME?.color.gray}
        />
      ) : (
        <ShownSvg
          width={SIZING.navigation.button}
          height={SIZING.navigation.button}
          color={THEME?.color.main}
        />
      )}
    </Button>
  );
}
