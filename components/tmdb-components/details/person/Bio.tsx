import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { BLURHASH, SIZING } from "@/constants/theme";
import i18n from "@/services/i18n";
import useStyle from "@/hooks/useStyle";
import detailStyles from "@/styles/detail.style";
import { Image } from "expo-image";

type BioProps = {
  src: string | undefined;
  alt: string | undefined;
  name: string;
  job: string;
  bio: string;
};

export default function Bio({ src, alt, name, job, bio }: BioProps) {
  const { colorPrimary, colorAlt, borderThird, borderBottomThird } = useStyle();

  return (
    <View>
      <View
        style={[
          detailStyles.imageContainer,
          {
            marginTop: 100,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500/${src}`,
          }}
          alt={alt}
          contentFit="cover"
          style={[styles.image, borderThird]}
          placeholder={BLURHASH.hash}
          transition={BLURHASH.transition}
        />
      </View>
      <View style={[detailStyles.container, borderBottomThird]}>
        <View>
          <Text style={[detailStyles.title, colorPrimary]}>{name}</Text>
          <Text style={[detailStyles.info, colorAlt]}>{job}</Text>
        </View>
        <Text style={[detailStyles.description, colorAlt]}>
          {bio ? `${"   "}${bio}` : `${"   "}${i18n.t("error.noBiography")}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: SIZING.image.height / 1.4,
    aspectRatio: 4 / 6,
    borderRadius: SIZING.radius.sm,
    borderWidth: 1,
  },
});
