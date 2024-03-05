import { View, Text, Image } from "react-native";
import React from "react";
import { useThemeContext } from "@/app/context/ThemeContext";
import usePlaceholder from "@/hooks/usePlaceholder";
import { Skeleton } from "moti/skeleton";
import cardStyles from "@/styles/card.style";
import useStyle from "@/hooks/useStyle";

export default function MediaSkeleton() {
  const { darkTheme } = useThemeContext();
  const {
    backgroundPrimary,
    colorPrimary,
    colorAlt,
    borderThird,
    borderBottomAlt,
  } = useStyle();
  const placeholder = usePlaceholder(4);

  const SkeletonCommonProps = {
    colorMode: darkTheme ? "dark" : "light",
  } as const;

  return (
    <Skeleton.Group show>
      {placeholder.map((_, i) => (
        <View key={i} style={[{ alignItems: "center" }, backgroundPrimary]}>
          <View style={[cardStyles.cardContainer, borderBottomAlt]}>
            <View
              style={[
                cardStyles.cardBody,
                {
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  gap: 6,
                },
              ]}
            >
              <Skeleton {...SkeletonCommonProps} width={"55%"}>
                <Text style={[cardStyles.title, colorPrimary]}>{""}</Text>
              </Skeleton>
              <Skeleton {...SkeletonCommonProps} width={"30%"}>
                <Text style={[cardStyles.subtitle, colorAlt]}>{""}</Text>
              </Skeleton>
            </View>
            <View style={cardStyles.cardImage}>
              <Skeleton {...SkeletonCommonProps}>
                <Image
                  source={{
                    uri: undefined,
                  }}
                  alt={undefined}
                  style={[cardStyles.image, borderThird]}
                  resizeMode="cover"
                />
              </Skeleton>
            </View>
          </View>
        </View>
      ))}
    </Skeleton.Group>
  );
}
