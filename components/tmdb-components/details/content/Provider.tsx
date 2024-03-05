import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import instanceTmdb from "@/services/instances";
import { notifyError } from "@/components/toasts/Toast";
import i18n from "@/services/i18n";
import ProviderBanner from "./ProviderBanner";
import contentStyles from "@/styles/content.style";
import useStyle from "@/hooks/useStyle";

type ProviderProps = {
  contentId: number;
};

export default function Provider({ contentId }: ProviderProps) {
  const { type } = useLocalSearchParams();
  const { colorPrimary, borderBottomThird } = useStyle();
  const [providers, setProviders] = useState<Providers | null>(null);
  const [localProvider, setLocalProvider] = useState<Provider | null>(null);

  //--- Fetch World's Providers's list ---//
  useEffect(() => {
    if (contentId) {
      instanceTmdb
        .get(`/${type}/${contentId}/watch/providers`)
        .then(({ data }) => {
          setProviders(data.results);
        })
        .catch(() => {
          notifyError(i18n.t("toast.error"));
        });
    }
  }, [type, contentId]);

  //--- Determine the right list based on navigator's language ---//
  useEffect(() => {
    if (providers) {
      for (const key in providers) {
        if (key === i18n.locale?.toUpperCase() || i18n.locale.includes(key)) {
          setLocalProvider(providers[key]);
        }
      }
    }
  }, [providers, i18n.locale]);

  if (!localProvider) return null;
  return (
    <View style={[contentStyles.container, borderBottomThird]}>
      <Text style={[contentStyles.categoryTitle, colorPrimary]}>
        {i18n.t("screen.detail.media.providers.title")}
      </Text>
      {localProvider.flatrate && (
        <ProviderBanner
          title={i18n.t("screen.detail.media.providers.subtitle1")}
          data={localProvider.flatrate}
        />
      )}
      {localProvider.buy && (
        <ProviderBanner
          title={i18n.t("screen.detail.media.providers.subtitle2")}
          data={localProvider.buy}
        />
      )}
    </View>
  );
}
