import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import i18n from "@/services/i18n";
import { BLURHASH, FONTS, SIZING } from "@/constants/theme";
import { useThemeContext } from "@/app/context/ThemeContext";
import { instanceAPI } from "@/services/instances";
import { useAuth } from "@/app/context/AuthContext";
import { notifyError, notifyPromise } from "@/components/toasts/Toast";
import formStyles from "@/styles/form.style";
import { Toasts } from "@backpackapp-io/react-native-toast";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import storage from "@/services/firebase";
import uuid from "react-native-uuid";
import { useBannerContext } from "@/app/context/BannerContext";
import useStyle from "@/hooks/useStyle";
import SubmitButton from "@/components/ui/SubmitButton";
import Button from "@/components/ui/Button";

export default function EditBanner() {
  const { THEME, darkTheme } = useThemeContext();
  const {
    backgroundPrimary,
    backgroundThird,
    backgroundMain,
    colorPrimary,
    colorSecond,
    borderPrimary,
    borderThird,
  } = useStyle();
  const { user } = useAuth();
  const { updateBanner, setUpdateBanner } = useBannerContext();
  const [banner, setBanner] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [newBanner, setNewBanner] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [firebasePromise, setFirebasePromise] = useState<boolean>(false);
  const [firebaseUpdated, setFirebaseUpdated] = useState<boolean>(false);
  const [bannerLink, setBannerLink] = useState<string | null>(null);
  const [firebaseDeleted, setFirebaseDeleted] = useState<boolean>(false);

  //--- Fetch User's Banner ---//
  useEffect(() => {
    if (user && user.id) {
      instanceAPI
        .get(`/api/v1/users/banner/${user.id}`)
        .then((res) => {
          setBanner(res.data.profileBanner);
        })
        .finally(() => {
          setLoading(false);
          setUpdateBanner!(false);
        })
        .catch((err) => {
          if (err.request?.status !== 403) {
            notifyError(i18n.t("toast.error"));
          }
        });
    }
  }, [user?.id, updateBanner]);

  //--- Screen Header ---//
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: THEME?.background.primary,
      },
      headerLeft: () => (
        <Button onPress={() => router.back()}>
          <Text style={[formStyles.backBtn, colorPrimary]}>
            {i18n.t("form.profile.update.banner.cancel")}
          </Text>
        </Button>
      ),
      headerRight: () => (
        <SubmitButton
          title={i18n.t("form.profile.update.banner.submit")}
          disabled={!newBanner}
          onPress={() => setFirebasePromise(true)}
          height={6}
        />
      ),
    });
  }, [navigation, newBanner, THEME]);

  //--- Pick Image from User's Media Library ---//
  const openImagePicker = async () => {
    const permission = await requestPermission();

    if (permission.granted && status?.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        allowsMultipleSelection: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (result && !result.canceled) {
        setNewBanner(result.assets[0]);
      } else return;
    }
  };

  //--- Upload Logic ---//
  // Firebase Logic
  useEffect(() => {
    const handleBannerUpload = async () => {
      // Won't accept Banner if over 5Mb
      if (newBanner && newBanner.fileSize! > 5000000) {
        notifyError(i18n.t("toast.errorSize"));
        setNewBanner(null);
        return;
      }

      // Delete old Banner on Firebase if exist
      if (banner && newBanner) {
        const oldBannerRef = ref(storage, banner);
        const isOldBanner = await getDownloadURL(oldBannerRef);
        if (isOldBanner) {
          deleteObject(oldBannerRef);
        }
      }

      // Upload new Banner on Firebase and get it's URL
      try {
        // Format new Banner name with uuid & username
        const bannerRef = ref(
          storage,
          `profile_banner/${uuid.v4()}_${user?.username.toLowerCase()}`
        );
        // Convert newBanner URI to Blob in order to upload on Firebase
        const response = await fetch(newBanner?.uri as string);
        const blob = await response.blob();

        const uploadBanner = await uploadBytes(bannerRef, blob);
        if (uploadBanner) {
          const link = await getDownloadURL(uploadBanner.ref);
          if (link) {
            setBannerLink(link);
            setFirebasePromise(false);
            setFirebaseUpdated(true);
          } else throw new Error();
        } else throw new Error();
      } catch (err) {
        notifyError(i18n.t("toast.errorFirebase"));
      }
    };

    if (newBanner && firebasePromise) {
      notifyPromise(handleBannerUpload());
    }
  }, [firebasePromise]);

  // Put the Banner's URL on the DB
  useEffect(() => {
    if (firebaseUpdated && bannerLink) {
      instanceAPI
        .put(`/api/v1/users/banner/${user?.id}`, { bannerLink })
        .then(() => {
          router.back();
          setUpdateBanner!(true);
        })
        .catch(() => notifyError(i18n.t("toast.error")));
    }
  }, [firebaseUpdated, bannerLink, user]);

  //--- Alert User for confirmation ---//
  const openDelete = () => {
    Alert.alert(
      i18n.t("form.profile.delete.banner.title"),
      i18n.t("form.profile.delete.banner.warning"),
      [
        {
          text: i18n.t("form.profile.delete.banner.submit"),
          onPress: () => deleteBannerFirebase(),
          style: "destructive",
        },
        {
          text: i18n.t("form.profile.delete.banner.cancel"),
          style: "cancel",
        },
      ]
    );
  };

  //--- Delete Logic ---//
  // Firebase Logic
  const deleteBannerFirebase = () => {
    if (banner) {
      const oldBannerRef = ref(storage, banner as string);
      deleteObject(oldBannerRef);
      setFirebaseDeleted(true);
    }
  };

  // Set URL at null
  useEffect(() => {
    const deleteBannerDatabase = async () => {
      const bannerLink = null;
      try {
        const res = await instanceAPI.put(`/api/v1/users/banner/${user?.id}`, {
          bannerLink,
        });
        if (res) {
          setFirebaseDeleted(false);
          setUpdateBanner!(true);
        }
      } catch (err: any) {
        if (err.request?.status !== 403) {
          notifyError(i18n.t("toast.error"));
        }
      }
    };

    if (firebaseDeleted) {
      deleteBannerDatabase();
    }
  }, [firebaseDeleted]);

  return (
    <View
      style={[
        formStyles.form,
        {
          justifyContent: "flex-start",
          gap: 20,
        },
        backgroundPrimary,
      ]}
    >
      <View style={formStyles.titleContainer}>
        <Text style={[formStyles.title, colorPrimary]}>
          {i18n.t("form.profile.update.banner.title")}
        </Text>
        <Text style={[formStyles.subtitle, colorPrimary]}>
          {newBanner
            ? i18n.t("form.profile.update.banner.subtitle2")
            : i18n.t("form.profile.update.banner.subtitle1")}
        </Text>
      </View>

      <View style={[styles.container, borderThird]}>
        {!loading && banner && !newBanner && (
          <Image
            source={{ uri: banner }}
            style={[styles.image]}
            alt="profile_banner"
            contentFit="cover"
            placeholder={BLURHASH.hash}
            transition={BLURHASH.transition}
          />
        )}
        {!loading && !banner && !newBanner && (
          <View style={[styles.emptyImg, backgroundMain]} />
        )}
        {newBanner && (
          <Image
            source={{ uri: newBanner.uri }}
            style={[styles.image]}
            alt="profile_banner"
            contentFit="cover"
            placeholder={BLURHASH.hash}
            transition={BLURHASH.transition}
          />
        )}
      </View>

      <View>
        <Button
          style={[formStyles.borderBtn, borderPrimary]}
          onPress={openImagePicker}
        >
          <Text style={[formStyles.btnText, colorPrimary]}>
            {i18n.t("form.profile.update.banner.pick")}
          </Text>
        </Button>
      </View>

      {banner && (
        <>
          <View style={[{ width: "60%", height: 1 }, backgroundThird]} />
          <View style={formStyles.switchContainer}>
            <Button onPress={openDelete}>
              <Text style={[styles.deleteTxt, colorSecond]}>
                {i18n.t("form.profile.update.banner.delete")}
              </Text>
            </Button>
          </View>
        </>
      )}

      <Toasts overrideDarkMode={!darkTheme} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "80%",
    height: SIZING.image.height * 0.8,
    overflow: "hidden",
    borderWidth: SIZING.border.xs,
  },
  image: {
    width: "100%",
    height: SIZING.image.height,
    alignSelf: "center",
  },
  emptyImg: {
    width: "100%",
    height: SIZING.image.height,
  },
  deleteTxt: {
    fontFamily: FONTS.medium,
    fontSize: SIZING.font.md,
  },
});
