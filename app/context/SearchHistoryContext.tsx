import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

interface ISearchHistoryProps {
  update?: boolean;
  searchHistory?: SearchHistory[] | [];
  onSaveHistory?: (newQuery: SearchHistory) => Promise<any>;
  onDeleteHistoryItem?: (index: number) => Promise<any>;
  onDeleteHistory?: () => Promise<any>;
}

const SearchHistoryContext = createContext<ISearchHistoryProps>({});

export const useSearchHistory = () => {
  return useContext(SearchHistoryContext);
};

export function SearchHistoryProvider({ children }: ContextProps) {
  const [searchHistory, setSearchHistory] = useState<SearchHistory[] | []>([]);
  const [update, setUpdate] = useState<boolean>(true);

  useEffect(() => {
    const getSearchHistory = async () => {
      const history = await SecureStore.getItemAsync("history");
      if (history) {
        setSearchHistory(JSON.parse(history));
        setUpdate(false);
      } else {
        setSearchHistory([]);
        setUpdate(false);
      }
    };

    if (update) {
      getSearchHistory();
    }
  }, [update]);

  const saveHistory = async (newQuery: SearchHistory) => {
    const history: SearchHistory[] = searchHistory;
    /* Verify if searchHistory already contain the new entry & delete it if it's the case */
    if (history.some((el) => el.query === newQuery.query)) {
      history.forEach((el, index) => {
        if (el.query === newQuery.query) {
          history.splice(index, 1);
        }
      });
    }
    if (searchHistory.length >= 10) {
      history.pop();
    }
    history.unshift(newQuery);
    setSearchHistory(history);
    await SecureStore.setItemAsync("history", JSON.stringify(searchHistory));
    setUpdate(true);
  };

  const deleteHistoryItem = async (index: number) => {
    const history: SearchHistory[] = searchHistory;
    history.splice(index, 1);
    setSearchHistory(history);
    await SecureStore.setItemAsync("history", JSON.stringify(searchHistory));
    setUpdate(true);
  };

  const deleteHistory = async () => {
    const history: SearchHistory[] = searchHistory;
    history.splice(0, 10);
    setSearchHistory(history);
    await SecureStore.setItemAsync("history", JSON.stringify(searchHistory));
    setUpdate(true);
  };

  const value = {
    update,
    searchHistory,
    onSaveHistory: saveHistory,
    onDeleteHistoryItem: deleteHistoryItem,
    onDeleteHistory: deleteHistory,
  };

  return (
    <SearchHistoryContext.Provider value={value}>
      {children}
    </SearchHistoryContext.Provider>
  );
}
