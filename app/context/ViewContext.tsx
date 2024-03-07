import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { instanceAPI } from "@/services/instances";
import { notifyError } from "@/components/toasts/Toast";
import i18n from "@/services/i18n";
import { useAuth } from "./AuthContext";

interface IViewProps {
  views?: Array<APIMedia> | null;
  sendView?: boolean;
  setSendView?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ViewContext = createContext<IViewProps>({});

export const useViewContext = () => {
  return useContext(ViewContext);
};

export function ViewProvider({ children }: ContextProps) {
  const { user } = useAuth();
  const [views, setViews] = useState(null);
  const [sendView, setSendView] = useState(false);

  const viewsObj = useMemo(() => {
    return {
      views,
      sendView,
      setSendView,
    };
  }, [views, sendView, setSendView]);

  const getViews = async () => {
    if (user && user.id) {
      try {
        const userViews = await instanceAPI.get(`/api/v1/views/${user.id}`);
        if (userViews) {
          setViews(userViews.data);
          setSendView(false);
        } else throw new Error();
      } catch (err: any) {
        if (err.request.status !== 403) {
          notifyError(i18n.t("toast.error"));
        }
      }
    }
  };

  useEffect(() => {
    getViews();
  }, [user?.id, sendView]);

  return (
    <ViewContext.Provider value={viewsObj}>{children}</ViewContext.Provider>
  );
}
