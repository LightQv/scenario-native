import { Text, View } from "react-native";
import React from "react";
import { useThemeContext } from "@/app/context/ThemeContext";
import GoSvg from "@/assets/svg/nav-arrow-right.svg";
import { Skeleton } from "moti/skeleton";
import usePlaceholder from "@/hooks/usePlaceholder";
import cardStyles from "@/styles/card.style";
import useStyle from "@/hooks/useStyle";

export default function WatchlistSkeleton() {
  const { THEME, darkTheme } = useThemeContext();
  const { colorPrimary, colorAlt, borderBottomAlt } = useStyle();
  const placeholder = usePlaceholder(6);

  const SkeletonCommonProps = {
    colorMode: darkTheme ? "dark" : "light",
  } as const;

  return (
    <Skeleton.Group show>
      {placeholder.map((_, i) => (
        <View key={i} style={{ alignItems: "center" }}>
          <View style={[cardStyles.cardContainer, borderBottomAlt]}>
            <View style={{ gap: 1 }}>
              <Skeleton {...SkeletonCommonProps} width={"70%"}>
                <Text style={[colorPrimary]}>{""}</Text>
              </Skeleton>
              <View style={{ height: 2 }} />
              <Skeleton {...SkeletonCommonProps} width={"40%"}>
                <Text style={[colorAlt]}>{""}</Text>
              </Skeleton>
            </View>
            <Skeleton
              {...SkeletonCommonProps}
              width={18}
              height={18}
              radius={"round"}
            >
              <GoSvg width={18} height={18} color={THEME?.color.primary} />
            </Skeleton>
          </View>
        </View>
      ))}
    </Skeleton.Group>
  );
}
