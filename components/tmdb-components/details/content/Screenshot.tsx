import {
  ListRenderItem,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import instanceTmdb from "@/services/instances";
import { notifyError } from "@/components/toasts/Toast";
import i18n from "@/services/i18n";
import { BLURHASH, FONTS, LIGHT, SIZING } from "@/constants/theme";
import { FlatList } from "react-native-gesture-handler";
import ImageViewer from "react-native-image-zoom-viewer";
import { IImageInfo } from "react-native-image-zoom-viewer/built/image-viewer.type";
import contentStyles from "@/styles/content.style";
import { Image } from "expo-image";
import useStyle from "@/hooks/useStyle";

type ScreenshotProps = {
  contentId: number;
};

export default function Screenshot({ contentId }: ScreenshotProps) {
  const { type } = useLocalSearchParams();
  const { colorPrimary, borderThird, borderBottomThird } = useStyle();
  const [screenshots, setScreenshots] = useState<Screenshots | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    if (contentId) {
      instanceTmdb
        .get(`/${type}/${contentId}/images`)
        .then(({ data }) => {
          setScreenshots(data);
        })
        .catch(() => {
          notifyError(i18n.t("toast.error"));
        });
    }
  }, [type, contentId]);

  //--- Format Array for ImageViewer props ---//
  const screenshotsUrls: unknown = screenshots?.backdrops
    .sort((el) => el.vote_count)
    .slice(0, 10)
    .map((el) => {
      return {
        url: `https://image.tmdb.org/t/p/original/${el.file_path}`,
        width: "100%",
      };
    });

  const openModal = (index: number) => {
    setSelectedScreenshot(index);
    setModalVisible(true);
  };

  //--- Flatlist ---//
  const renderRow: ListRenderItem<Screenshot> = ({ item, index }) => (
    <Pressable onPress={() => openModal(index)} style={styles.cardContainer}>
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/original/${item.file_path}`,
        }}
        contentFit="cover"
        style={[styles.image, borderThird]}
        placeholder={BLURHASH.hash}
        transition={BLURHASH.transition}
      />
    </Pressable>
  );

  //--- ImageViewer ---//
  const renderIndicator = (currentIndex: any, allSize: any) => {
    return (
      <View
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: FONTS.regular,
            color: LIGHT.color.secondary,
          }}
        >
          {`${currentIndex} / ${allSize}`}
        </Text>
      </View>
    );
  };

  if (screenshots?.backdrops.length === 0) return null;
  return (
    <View style={[contentStyles.container, borderBottomThird]}>
      <Text style={[contentStyles.categoryTitle, colorPrimary]}>
        {i18n.t("screen.detail.media.screenshots")}
      </Text>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={screenshots?.backdrops.sort((el) => el.vote_count).slice(0, 10)}
        renderItem={renderRow}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={contentStyles.listContainer}
      />
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <ImageViewer
          imageUrls={screenshotsUrls as IImageInfo[]}
          index={selectedScreenshot}
          enableSwipeDown={true}
          enableImageZoom
          saveToLocalByLongPress={false}
          onCancel={() => setModalVisible(!modalVisible)}
          renderIndicator={renderIndicator}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    width: 349,
  },
  image: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: SIZING.radius.sm,
    borderWidth: SIZING.border.md,
  },
});
