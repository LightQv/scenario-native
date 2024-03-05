import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import i18n from "@/services/i18n";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useAuth } from "@/app/context/AuthContext";
import { instanceAPI } from "@/services/instances";
import { notifyError } from "../toasts/Toast";
import SelectDot from "@/components/filter/SelectDot";
import sheetStyles from "@/styles/sheet.style";
import { useWatchlistContext } from "@/app/context/WatchlistContext";
import useStyle from "@/hooks/useStyle";
import Button from "../ui/Button";

type AddMediaProps = {
  data: APIMedia;
};

export default function AddMedia({ data }: AddMediaProps) {
  const { backgroundPrimary, colorPrimary, borderBottomThird } = useStyle();
  const { updateWatchlist, setUpdateWatchlist } = useWatchlistContext();
  const { user } = useAuth();
  const [watchlists, setWatchlists] = useState<Watchlist[] | null>(null);

  useEffect(() => {
    if (user && user.id) {
      instanceAPI
        .get(`/api/v1/user/watchlist/${user.id}`)
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
  }, [user, data, updateWatchlist]);

  const handleWatchlist = async (watchlistId: string) => {
    if (watchlists) {
      const [watchlistSelected] = watchlists.filter(
        (el) => el.id === watchlistId
      ); /* Get Watchlist Element */
      if (
        watchlistSelected.medias.some((media) => media.tmdb_id === data.tmdb_id)
      ) {
        const [mediaSelected] = watchlistSelected.medias.filter(
          (media) => media.tmdb_id === data.tmdb_id
        );
        try {
          const isDeleted = await instanceAPI.delete(
            `/api/v1/media/${mediaSelected.id}`
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
          const isCreated = await instanceAPI.post(`/api/v1/media`, {
            tmdb_id: data.tmdb_id,
            genre_ids: data.genre_ids,
            poster_path: data.poster_path,
            backdrop_path: data.backdrop_path,
            release_date: data.release_date,
            runtime: data.runtime,
            title: data.title,
            media_type: data.media_type,
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
    if (watchlist?.medias.some((el: any) => el.tmdb_id === data.tmdb_id))
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
