import { useLayoutEffect, useState } from "react";
import { useGenreContext } from "@/app/context/GenreContext";

export default function useGenre(
  data: TmdbData,
  media_type: string | undefined
) {
  const { movieGenres, tvGenres } = useGenreContext();
  const [genre, setGenre] = useState<string[] | null>(null);

  //--- Determine which type of Result and return Genre name based on ID ---//
  useLayoutEffect(() => {
    function getGenreNames() {
      if (
        movieGenres &&
        (data.media_type === "movie" || media_type === "movie")
      ) {
        const genresNames = [];
        for (let i = 0; i < movieGenres?.length; i++) {
          if (data.genre_ids?.includes(movieGenres[i].id))
            genresNames.push(movieGenres[i].name);
        }
        return setGenre(genresNames);
      }
      if (tvGenres && (data.media_type === "tv" || media_type === "tv")) {
        const genresNames = [];
        for (let i = 0; i < tvGenres?.length; i++) {
          if (data.genre_ids?.includes(tvGenres[i].id))
            genresNames.push(tvGenres[i].name);
        }
        return setGenre(genresNames);
      }
    }
    getGenreNames();
  }, [data.genre_ids, data.media_type, media_type, movieGenres, tvGenres]);
  return genre;
}
