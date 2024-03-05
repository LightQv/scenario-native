import { useLayoutEffect, useState } from "react";
import { useViewContext } from "@/app/context/ViewContext";
import { useAuth } from "@/app/context/AuthContext";

export function useView(tmdb_id: string, parameter: string | undefined) {
  const { user } = useAuth();
  const { views } = useViewContext();
  const [viewed, setViewed] = useState(false);
  const [viewObj, setViewObj] = useState<APIMedia | null>(null);

  useLayoutEffect(() => {
    function verifyView() {
      let isViewed = undefined;
      if (parameter && views) {
        isViewed = views?.some(
          (el) => el.tmdb_id === Number(tmdb_id) && el.viewerId === user?.id
        );
      }
      setViewed(isViewed as boolean);
    }

    function getViewObj() {
      const viewObj = views?.find(
        (el) => el.tmdb_id === Number(tmdb_id) && el.viewerId === user?.id
      );
      setViewObj(viewObj as APIMedia);
    }
    verifyView();
    getViewObj();
  }, [tmdb_id, parameter, views, user?.id]);

  return { viewed, viewObj };
}
