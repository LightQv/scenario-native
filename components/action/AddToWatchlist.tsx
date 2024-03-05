import React, { RefObject } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { SIZING } from "@/constants/theme";
import WatchlistSvg from "@/assets/svg/list-select.svg";
import { useThemeContext } from "@/app/context/ThemeContext";
import actionStyles from "../../styles/action.style";
import useStyle from "@/hooks/useStyle";
import Button from "../ui/Button";

type AddToWatchlistProps = {
  bottomSheetRef: RefObject<BottomSheetModal>;
};

export default function AddToWatchlist({
  bottomSheetRef,
}: AddToWatchlistProps) {
  const { THEME } = useThemeContext();
  const { backgroundPrimary } = useStyle();

  return (
    <Button
      onPress={() => bottomSheetRef.current?.present()}
      style={[backgroundPrimary, actionStyles.btn]}
    >
      <WatchlistSvg
        width={SIZING.navigation.button}
        height={SIZING.navigation.button}
        color={THEME?.color.primary}
      />
    </Button>
  );
}
