import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface IRouterHistoryContextProps {
  history?: string;
  setHistory?: Dispatch<SetStateAction<string>>;
}

const RouterHistoryContext = createContext<IRouterHistoryContextProps>({});

export const useRouterHistory = () => {
  return useContext(RouterHistoryContext);
};

export function RouterHistoryProvider({ children }: ContextProps) {
  const [history, setHistory] = useState<string>("");
  const value = {
    history,
    setHistory,
  };

  return (
    <RouterHistoryContext.Provider value={value}>
      {children}
    </RouterHistoryContext.Provider>
  );
}
