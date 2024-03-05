import { createContext, useContext, useMemo, useState } from "react";

interface IWatchlistProps {
  updateWatchlist?: boolean;
  setUpdateWatchlist?: React.Dispatch<React.SetStateAction<boolean>>;
}

const WatchlistContext = createContext<IWatchlistProps>({});

export const useWatchlistContext = () => {
  return useContext(WatchlistContext);
};

export function WatchlistProvider({ children }: ContextProps) {
  const [updateWatchlist, setUpdateWatchlist] = useState<boolean>(false);

  const viewsObj = useMemo(() => {
    return {
      updateWatchlist,
      setUpdateWatchlist,
    };
  }, [updateWatchlist, setUpdateWatchlist]);

  return (
    <WatchlistContext.Provider value={viewsObj}>
      {children}
    </WatchlistContext.Provider>
  );
}
