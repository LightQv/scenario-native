import { Pressable, Text, View } from "react-native";
import React from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import { useView } from "@/hooks/useView";
import { BUTTON } from "@/constants/theme";
import ViewSvg from "@/assets/svg/eye.svg";
import { durationConvert, formatFullDate } from "@/services/utils";
import i18n from "@/services/i18n";
import { useThemeContext } from "@/app/context/ThemeContext";
import detailStyles from "@/styles/detail.style";
import useStyle from "@/hooks/useStyle";

type HeaderProps = {
  /* Overall type */
  title: string;
  original_title: string;
  genres: Array<Genre>;
  synopsis: string;

  /* Movie type */
  release?: string;
  runtime?: number;

  /* TV type */
  status?: string;
  start?: string;
  end?: string | null;
  seasonsNumber?: number;
  episodesNumber?: number;
};

export default function Header({
  title,
  original_title,
  genres,
  release,
  runtime,
  status,
  start,
  end,
  seasonsNumber,
  episodesNumber,
  synopsis,
}: HeaderProps) {
  const { id, type } = useLocalSearchParams();
  const { user } = useAuth();
  const { viewed } = useView(id as string, type as string);
  const { THEME } = useThemeContext();
  const {
    backgroundPrimary,
    backgroundThird,
    colorPrimary,
    colorAlt,
    colorGray,
    borderThird,
    borderBottomThird,
  } = useStyle();

  return (
    <View
      style={[detailStyles.container, backgroundPrimary, borderBottomThird]}
    >
      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[detailStyles.title, colorPrimary]}>{title}</Text>
          {user && user.id && type !== "person" && viewed && (
            <ViewSvg width={22} height={22} color={THEME?.color.main} />
          )}
        </View>
        <Text style={[detailStyles.subtitle, colorGray]}>{original_title}</Text>
      </View>
      <View style={detailStyles.pillContainer}>
        {genres?.slice(0, 3).map((genre) => (
          <Link
            href={{
              pathname: `/discover`,
              params: { type: type, genre: genre.id },
            }}
            key={genre.id}
            asChild
          >
            <Pressable
              style={({ pressed }) => [
                { opacity: pressed ? BUTTON.opacity : 1 },
              ]}
            >
              <Text
                style={[
                  detailStyles.pillElement,
                  backgroundThird,
                  borderThird,
                  colorPrimary,
                ]}
              >
                {genre.name}
              </Text>
            </Pressable>
          </Link>
        ))}
      </View>
      {type === "movie" && (
        <Text style={[detailStyles.info, colorAlt]}>
          {formatFullDate(release as string)} •{" "}
          {durationConvert(runtime as number)}
        </Text>
      )}
      {type === "tv" && (
        <Text style={[detailStyles.info, colorAlt]}>
          {`${status} • ${formatFullDate(start as string)} ${
            end ? `- ${formatFullDate(end)}` : ""
          } • ${seasonsNumber} ${
            seasonsNumber && seasonsNumber > 1
              ? i18n.t("screen.detail.media.seasons.season.plurial")
              : i18n.t("screen.detail.media.seasons.season.singular")
          } • ${episodesNumber} ${
            episodesNumber && episodesNumber > 1
              ? i18n.t("screen.detail.media.seasons.episode.plurial")
              : i18n.t("screen.detail.media.seasons.episode.singular")
          }`}
        </Text>
      )}
      <Text style={[detailStyles.description, colorAlt]}>
        {synopsis
          ? `${"   "}${synopsis}`
          : `${"   "}${i18n.t("error.noSynopsis")}`}
      </Text>
    </View>
  );
}
