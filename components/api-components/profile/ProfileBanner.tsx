import { View } from "react-native";
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { SIZING } from "@/constants/theme";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { notifyError } from "@/components/toasts/Toast";
import i18n from "@/services/i18n";
import { instanceAPI } from "@/services/instances";
import { useBannerContext } from "@/app/context/BannerContext";
import useStyle from "@/hooks/useStyle";
import { useThemeContext } from "@/app/context/ThemeContext";
import detailStyles from "@/styles/detail.style";

type ProfileBannerProps = {
  offset: SharedValue<number>;
};

export default function ProfileBanner({ offset }: ProfileBannerProps) {
  const { THEME, darkTheme } = useThemeContext();
  const { borderThird } = useStyle();
  const { user } = useAuth();
  const { updateBanner, setUpdateBanner } = useBannerContext();
  const dummyBanner: string = darkTheme
    ? "https://dummyimage.com/640x360/121212/121212"
    : "https://dummyimage.com/640x360/fff/fff";
  const [banner, setBanner] = useState<string | undefined>(undefined);

  //--- Fetch User's Banner ---//
  useEffect(() => {
    if (user && user.id) {
      instanceAPI
        .get(`/api/v1/user/banner/${user.id}`)
        .then((res) => {
          if (res.data.profileBanner !== null) {
            setBanner(res.data.profileBanner);
          } else setBanner(dummyBanner);
        })
        .finally(() => {
          setUpdateBanner!(false);
        })
        .catch((err) => {
          if (err.request?.status !== 403) {
            notifyError(i18n.t("toast.error"));
          }
        });
    }
  }, [user?.id, updateBanner]);

  //--- Animation ---//
  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            offset.value,
            [-SIZING.image.height, 0, SIZING.image.height],
            [-SIZING.image.height / 2, 0, SIZING.image.height * 0.75]
          ),
        },
        {
          scale: interpolate(
            offset.value,
            [-SIZING.image.height, 0, SIZING.image.height],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <View style={detailStyles.imageContainer}>
      <Animated.Image
        source={{
          uri: banner,
        }}
        style={[
          detailStyles.image,
          {
            borderBottomWidth: SIZING.border.xs,
          },
          borderThird,
          imageAnimatedStyle,
        ]}
        alt="profile_banner"
        resizeMode={"cover"}
        tintColor={banner === dummyBanner ? THEME?.color.main : undefined}
      />
    </View>
  );
}
