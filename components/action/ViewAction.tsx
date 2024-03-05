import React, { useEffect, useState } from "react";
import { SIZING } from "@/constants/theme";
import ViewSvg from "@/assets/svg/eye.svg";
import UnviewSvg from "@/assets/svg/eye-closed.svg";
import { instanceAPI } from "@/services/instances";
import { notifyError } from "@/components/toasts/Toast";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import { useViewContext } from "@/app/context/ViewContext";
import { useView } from "@/hooks/useView";
import i18n from "@/services/i18n";
import { useThemeContext } from "@/app/context/ThemeContext";
import actionStyles from "../../styles/action.style";
import useStyle from "@/hooks/useStyle";
import Button from "../ui/Button";

type ViewActionProps = {
  data: TmdbDetails;
};

export default function ViewAction({ data }: ViewActionProps) {
  const { type, id } = useLocalSearchParams();
  const { user } = useAuth();
  const { THEME } = useThemeContext();
  const { backgroundPrimary } = useStyle();
  const { setSendView } = useViewContext();
  const { viewed, viewObj } = useView(id as string, type as string);
  const [genreIds, setGenreIds] = useState<number[] | null>(null);

  //--- Add 0 to Genre Arr which represent "all" ---//
  useEffect(() => {
    const genre = data?.genres.map((el) => el.id);
    genre.unshift(0);
    setGenreIds(genre);
  }, [data?.genres]);

  //--- View Logic ---//
  const handleView = () => {
    if (viewed && viewObj) {
      instanceAPI
        .delete(`/api/v1/view/${viewObj.id}`)
        .then(() => setSendView?.(true))
        .catch(() => notifyError(i18n.t("toast.error")));
    } else {
      instanceAPI
        .post(`/api/v1/view`, {
          tmdb_id: Number(id),
          genre_ids: genreIds as number[],
          poster_path: data.poster_path,
          backdrop_path: data.backdrop_path,
          release_date: data.release_date || data.first_air_date,
          release_year:
            data.release_date?.slice(0, 4) || data.first_air_date?.slice(0, 4),
          runtime: data.runtime || data.number_of_episodes,
          title: data.title || data.name,
          media_type: type,
          viewerId: user?.id,
        })
        .then(() => setSendView?.(true))
        .catch(() => notifyError(i18n.t("toast.error")));
    }
  };

  return (
    <Button
      onPress={() => handleView()}
      style={[backgroundPrimary, actionStyles.btn]}
    >
      {viewed ? (
        <ViewSvg
          width={SIZING.navigation.button}
          height={SIZING.navigation.button}
          color={THEME?.color.primary}
        />
      ) : (
        <UnviewSvg
          width={SIZING.navigation.button}
          height={SIZING.navigation.button}
          color={THEME?.color.primary}
        />
      )}
    </Button>
  );
}
