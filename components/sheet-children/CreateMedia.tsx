import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import i18n from "@/services/i18n";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useAuth } from "@/app/context/AuthContext";
import { instanceAPI } from "@/services/instances";
import { notifyError } from "../toasts/Toast";
import { useGlobalSearchParams } from "expo-router";
import SelectDot from "@/components/filter/SelectDot";
import sheetStyles from "@/styles/sheet.style";
import { useWatchlistContext } from "@/app/context/WatchlistContext";
import useStyle from "@/hooks/useStyle";
import Button from "../ui/Button";

type CreateMediaProps = {
  data: TmdbDetails;
};

export default function CreateMedia({ data }: CreateMediaProps) {
  const { backgroundPrimary, colorPrimary, borderBottomThird } = useStyle();
  const { updateWatchlist, setUpdateWatchlist } = useWatchlistContext();
  const { type } = useGlobalSearchParams();
  const { user } = useAuth();
  const [watchlists, setWatchlists] = useState<Watchlist[] | null>(null);
  const [genreIds, setGenreIds] = useState<number[] | null>(null);

  useEffect(() => {
    if (user && user.id) {
      instanceAPI
        .get(`/api/v1/watchlists/${user.id}`)
        .then((res) => {
          setWatchlists(res.data);
          setUpdateWatchlist!(false);
        })
        .catch((err) => {
          if (err.response?.status !== 403) {
            notifyError(i18n.t("toast.error"));
          }
        });
    }
    //--- Add 0 to Genre Arr which represent "all" ---//
    const genre = data?.genres.map((el) => el.id);
    genre.unshift(0);
    setGenreIds(genre);
  }, [user, data.genres, updateWatchlist]);

  const handleWatchlist = async (watchlistId: string) => {
    if (watchlists) {
      const [watchlistSelected] = watchlists.filter(
        (el) => el.id === watchlistId
      ); /* Get Watchlist Element */
      if (watchlistSelected.medias.some((media) => media.tmdb_id === data.id)) {
        const [mediaSelected] = watchlistSelected.medias.filter(
          (media) => media.tmdb_id === data.id
        );
        try {
          const isDeleted = await instanceAPI.delete(
            `/api/v1/medias/${mediaSelected.id}`
          );
          if (isDeleted) {
            setUpdateWatchlist!(true);
          }
        } catch (err: any) {
          if (err.request?.status !== 403) {
            notifyError(i18n.t("toast.error"));
          }
        }
      } else {
        try {
          const isCreated = await instanceAPI.post(`/api/v1/medias`, {
            tmdb_id: data.id,
            genre_ids: genreIds || data.genre_ids,
            poster_path: data.poster_path,
            backdrop_path: data.backdrop_path,
            release_date: data.release_date || data.first_air_date,
            runtime: data.runtime || data.number_of_episodes,
            title: data.title || data.name,
            media_type: type,
            watchlistId: watchlistId,
          });
          if (isCreated) {
            setUpdateWatchlist!(true);
          }
        } catch (err) {
          if (err) {
            notifyError(i18n.t("toast.error"));
          }
        }
      }
    }
  };

  const getActiveID = (watchlist: Watchlist) => {
    if (watchlist?.medias.some((el: any) => el.tmdb_id === data.id))
      return watchlist.id;
  };

  if (!watchlists) return null;
  return (
    <BottomSheetScrollView
      style={backgroundPrimary}
      showsVerticalScrollIndicator={false}
    >
      <View style={[sheetStyles.header, borderBottomThird]}>
        <Text style={[sheetStyles.sheetTitle, colorPrimary]}>
          {i18n.t("form.media.create.title")}
        </Text>
      </View>
      <View style={sheetStyles.listContainer}>
        {watchlists
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((item) => (
            <Button key={item.id} onPress={() => handleWatchlist(item.id)}>
              <View style={[sheetStyles.listItem]}>
                <Text style={[sheetStyles.listLabel, colorPrimary]}>
                  {item.title}
                </Text>
                <SelectDot
                  activeValue={getActiveID(item) as string}
                  value={item.id.toString()}
                />
              </View>
            </Button>
          ))}
      </View>
    </BottomSheetScrollView>
  );
}
