import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import i18n from "@/services/i18n";
import { runtimeConvert } from "@/services/utils";
import { getTotalRuntime } from "@/services/utils";
import { useAuth } from "@/app/context/AuthContext";
import { instanceAPI } from "@/services/instances";
import { notifyError } from "@/components/toasts/Toast";
import { useViewContext } from "@/app/context/ViewContext";
import detailStyles from "@/styles/detail.style";
import useStyle from "@/hooks/useStyle";

type ProfileHeaderProps = {
  title: string;
};

export default function ProfileHeader({ title }: ProfileHeaderProps) {
  const {
    backgroundPrimary,
    backgroundThird,
    colorPrimary,
    colorAlt,
    borderThird,
    borderBottomThird,
  } = useStyle();
  const { user } = useAuth();
  const { sendView } = useViewContext();
  const [movieCount, setMovieCount] = useState<number>(0);
  const [tvCount, setTvCount] = useState<number>(0);
  const [movieRuntime, setMovieRuntime] = useState<number>(0);
  const [tvRuntime, setTvRuntime] = useState<number>(0);

  //--- Fetch User's Stats ---//
  useEffect(() => {
    getViewCount();
    getViewRuntime();
  }, [user?.id, sendView]);

  const getViewCount = async () => {
    if (user && user.id) {
      try {
        const movieCount = await instanceAPI.get(
          `/api/v1/user/view/count/movie/${user.id}`
        );
        if (movieCount) {
          movieCount.data[0]
            ? setMovieCount(movieCount.data[0]?._count)
            : setMovieCount(0);
        } else throw new Error();

        const tvCount = await instanceAPI.get(
          `/api/v1/user/view/count/tv/${user.id}`
        );
        if (tvCount) {
          tvCount.data[0] ? setTvCount(tvCount.data[0]?._count) : setTvCount(0);
        } else throw new Error();
      } catch (err: any) {
        if (err.request.status !== 403) {
          notifyError(i18n.t("toast.error"));
        }
      }
    }
  };

  const getViewRuntime = async () => {
    if (user && user.id) {
      try {
        const movieRuntime = await instanceAPI.get(
          `/api/v1/user/view/runtime/movie/${user.id}`
        );
        if (movieRuntime) {
          setMovieRuntime(getTotalRuntime(movieRuntime.data));
        }

        const tvRuntime = await instanceAPI.get(
          `/api/v1/user/view/runtime/tv/${user.id}`
        );
        if (tvRuntime) {
          setTvRuntime(getTotalRuntime(tvRuntime.data));
        }
      } catch (err: any) {
        if (err.request.status !== 403) {
          notifyError(i18n.t("toast.error"));
        }
      }
    }
  };

  return (
    <View
      style={[detailStyles.container, backgroundPrimary, borderBottomThird]}
    >
      <View>
        <Text style={[detailStyles.title, colorPrimary]}>{title}</Text>
      </View>
      <View style={detailStyles.pillContainer}>
        <Text
          style={[
            detailStyles.pillElement,
            backgroundThird,
            borderThird,
            colorPrimary,
          ]}
        >
          {movieCount}{" "}
          {movieCount && movieCount > 1
            ? i18n.t("stats.movies")
            : i18n.t("stats.movie")}
        </Text>
        <Text
          style={[
            detailStyles.pillElement,
            backgroundThird,
            borderThird,
            colorPrimary,
          ]}
        >
          {tvCount}{" "}
          {tvCount && tvCount > 1 ? i18n.t("stats.tvs") : i18n.t("stats.tv")}
        </Text>
        <Text
          style={[
            detailStyles.pillElement,
            backgroundThird,
            borderThird,
            colorPrimary,
          ]}
        >
          {runtimeConvert(movieRuntime)} {i18n.t("stats.movieRuntime")}
        </Text>
        <Text
          style={[
            detailStyles.pillElement,
            backgroundThird,
            borderThird,
            colorPrimary,
          ]}
        >
          {tvRuntime}{" "}
          {tvRuntime && tvRuntime > 1
            ? i18n.t("stats.tvsRuntime")
            : i18n.t("stats.tvRuntime")}
        </Text>
      </View>
      <Text style={[detailStyles.description, colorAlt]}>
        {i18n.t("screen.profile.stats.description")}
      </Text>
    </View>
  );
}
