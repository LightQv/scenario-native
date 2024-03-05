import { createContext, useContext, useEffect, useMemo, useState } from "react";
import instanceTmdb from "@/services/instances";
import i18n from "@/services/i18n";

interface IGenreProps {
  movieGenres?: Array<Genre> | null;
  tvGenres?: Array<Genre> | null;
  totalGenres?: Array<Genre> | null;
}

interface Genre {
  id: number;
  name: string;
}

const GenresContext = createContext<IGenreProps>({});

export const useGenreContext = () => {
  return useContext(GenresContext);
};

export function GenreProvider({ children }: ContextProps) {
  const [movieGenres, setMovieGenres] = useState<Array<Genre> | null>(null);
  const [tvGenres, setTvGenres] = useState<Array<Genre> | null>(null);
  const [totalGenres, setTotalGenres] = useState<Array<Genre> | null>(null);

  const genresObj = useMemo(() => {
    return {
      movieGenres,
      tvGenres,
      totalGenres,
    };
  }, [movieGenres, tvGenres, totalGenres]);

  useEffect(() => {
    instanceTmdb
      .get(`/genre/movie/list?language=${i18n.locale}`)
      .then(({ data }) => {
        setMovieGenres(data.genres);
      })
      .catch((err) => console.error(err));

    instanceTmdb
      .get(`/genre/tv/list?language=${i18n.locale}`)
      .then(({ data }) => {
        setTvGenres(data.genres);
      })
      .catch((err) => console.error(err));
  }, [i18n.locale]);

  useEffect(() => {
    if (movieGenres && tvGenres) {
      const fullGenreArr = movieGenres
        .concat(tvGenres)
        .sort((a: Genre, b: Genre) => a.name.localeCompare(b.name));
      const removeDuplicate = fullGenreArr.filter(
        (el: Genre, index: number) => {
          return (
            index === fullGenreArr.findIndex((obj: Genre) => el.id === obj.id)
          );
        }
      );
      setTotalGenres(removeDuplicate);
    }
  }, [movieGenres, tvGenres]);

  return (
    <GenresContext.Provider value={genresObj}>
      {children}
    </GenresContext.Provider>
  );
}
