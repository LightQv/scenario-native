import { createContext, useContext, useMemo, useState } from "react";

interface IBannerProps {
  updateBanner?: boolean;
  setUpdateBanner?: React.Dispatch<React.SetStateAction<boolean>>;
}

const BannerContext = createContext<IBannerProps>({});

export const useBannerContext = () => {
  return useContext(BannerContext);
};

export function BannerProvider({ children }: ContextProps) {
  const [updateBanner, setUpdateBanner] = useState<boolean>(false);

  const viewsObj = useMemo(() => {
    return {
      updateBanner,
      setUpdateBanner,
    };
  }, [updateBanner, setUpdateBanner]);

  return (
    <BannerContext.Provider value={viewsObj}>{children}</BannerContext.Provider>
  );
}
