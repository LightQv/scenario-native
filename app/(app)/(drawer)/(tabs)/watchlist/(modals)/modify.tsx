import { Text, TextInput, View } from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import i18n from "@/services/i18n";
import { useThemeContext } from "@/app/context/ThemeContext";
import { updateWatchlistSchema } from "@/services/validators";
import { instanceAPI } from "@/services/instances";
import { useAuth } from "@/app/context/AuthContext";
import { notifyError } from "@/components/toasts/Toast";
import formStyles from "@/styles/form.style";
import { useWatchlistContext } from "@/app/context/WatchlistContext";
import { Toasts } from "@backpackapp-io/react-native-toast";
import { Formik, FormikProps } from "formik";
import useStyle from "@/hooks/useStyle";
import SubmitButton from "@/components/ui/SubmitButton";
import Button from "@/components/ui/Button";

export default function ModifyWatchlist() {
  const { THEME, darkTheme } = useThemeContext();
  const { backgroundPrimary, colorPrimary, colorError, borderPrimary } =
    useStyle();
  const { setUpdateWatchlist } = useWatchlistContext();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  //--- Formik Ref to call onSubmit from the Screen header ---//
  const formRef = useRef<FormikProps<{ title: string }>>(null);

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
            {i18n.t("form.watchlist.update.cancel")}
          </Text>
        </Button>
      ),
      headerRight: () => (
        <SubmitButton
          title={i18n.t("form.watchlist.update.submit")}
          disabled={!updateWatchlistSchema.isValidSync({ title }) || loading!}
          loader={loading!}
          onPress={() => formRef.current?.handleSubmit()}
          height={6}
        />
      ),
    });
  }, [navigation, title, THEME, loading]);

  const modifyWatchlist = async (title: string) => {
    if (user) {
      try {
        setLoading(true);
        const isModified = await instanceAPI.put(`/api/v1/watchlist/${id}`, {
          title,
        });
        if (isModified) {
          router.push({ pathname: "/watchlist" });
          setUpdateWatchlist!(true);
          setLoading(false);
        }
      } catch (err) {
        if (err) {
          notifyError(i18n.t("toast.error"));
        }
        setLoading(false);
      }
    }
  };

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
      <Text style={[formStyles.title, colorPrimary]}>
        {i18n.t("form.watchlist.update.title")}
      </Text>
      <Formik
        innerRef={formRef}
        initialValues={{
          title: "",
        }}
        validationSchema={updateWatchlistSchema}
        onSubmit={(values) => {
          modifyWatchlist(values.title);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View style={formStyles.container}>
            <View style={formStyles.labelContainer}>
              <Text style={[formStyles.label, colorPrimary]}>
                {i18n.t("form.watchlist.update.label")}
              </Text>
              {errors.title && (
                <Text style={[formStyles.error, colorError]}> *</Text>
              )}
            </View>
            <View style={[formStyles.inputContainer, borderPrimary]}>
              <TextInput
                autoCapitalize="none"
                autoFocus
                placeholder={i18n.t("form.watchlist.update.placeholder")}
                style={[formStyles.input, colorPrimary]}
                cursorColor={THEME?.color.main}
                selectionColor={THEME?.color.main}
                value={values.title}
                onChangeText={(value) => {
                  handleChange("title")(value);
                  setTitle(value);
                }}
                onBlur={handleBlur("title")}
                onSubmitEditing={() => handleSubmit()}
                blurOnSubmit
                clearButtonMode="while-editing"
                enablesReturnKeyAutomatically
                returnKeyType="send"
              />
            </View>
            {errors.title && (
              <Text style={[formStyles.error, colorError]}>{errors.title}</Text>
            )}
          </View>
        )}
      </Formik>
      <Toasts overrideDarkMode={!darkTheme} />
    </View>
  );
}
