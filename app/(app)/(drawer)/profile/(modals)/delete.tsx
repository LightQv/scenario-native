import { Text, TextInput, View } from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { router, useNavigation } from "expo-router";
import i18n from "@/services/i18n";
import { FONTS } from "@/constants/theme";
import { useThemeContext } from "@/app/context/ThemeContext";
import { useAuth } from "@/app/context/AuthContext";
import formStyles from "@/styles/form.style";
import { instanceAPI } from "@/services/instances";
import { notifyError, notifySuccess } from "@/components/toasts/Toast";
import { Toasts } from "@backpackapp-io/react-native-toast";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import useStyle from "@/hooks/useStyle";
import SubmitButton from "@/components/ui/SubmitButton";
import Button from "@/components/ui/Button";

export default function DeleteAccount() {
  const { THEME, darkTheme } = useThemeContext();
  const {
    backgroundPrimary,
    colorPrimary,
    colorSecond,
    colorError,
    borderPrimary,
  } = useStyle();
  const { user, onLogout } = useAuth();
  const [confirmation, setConfirmation] = useState<string | undefined>("");

  //--- Formik Ref to call onSubmit from the Screen header ---//
  const formRef = useRef<FormikProps<{ confirmation: string }>>(null);

  const deleteSchema = Yup.object({
    confirmation: Yup.string().matches(
      new RegExp(user?.email + "/bye-scenario"),
      {
        message: i18n.t("validator.profile.delete"),
      }
    ),
  });

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
            {i18n.t("form.profile.delete.account.cancel")}
          </Text>
        </Button>
      ),
      headerRight: () => (
        <SubmitButton
          title={i18n.t("form.profile.delete.account.submit")}
          disabled={
            !deleteSchema.isValidSync({ confirmation }) ||
            confirmation === user?.email
          }
          onPress={() => formRef.current?.handleSubmit()}
          height={6}
        />
      ),
    });
  }, [navigation, confirmation, THEME]);

  const deleteAccount = async () => {
    if (user) {
      try {
        const isDeleted = await instanceAPI.delete(`/api/v1/users/${user.id}`);
        if (isDeleted) {
          onLogout!();
          notifySuccess(i18n.t("toast.success.profile.delete"));
        }
      } catch (err: any) {
        if (err.request?.status === 401 || err.request?.status === 403) {
          notifyError(i18n.t("toast.error"));
        }
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
      <View style={formStyles.titleContainer}>
        <Text style={[formStyles.title, colorPrimary]}>
          {i18n.t("form.profile.delete.account.title")}
        </Text>
        <Text style={[formStyles.subtitle, colorPrimary]}>
          {i18n.t("form.profile.delete.account.subtitle")}
        </Text>
      </View>
      <Formik
        innerRef={formRef}
        initialValues={{
          confirmation: "",
        }}
        validationSchema={deleteSchema}
        onSubmit={() => {
          deleteAccount();
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View style={formStyles.container}>
            <View style={formStyles.labelContainer}>
              <Text style={[formStyles.label, colorPrimary]}>
                {i18n.t("form.profile.delete.account.label1")}{" "}
                <Text
                  style={[
                    formStyles.label,
                    { fontFamily: FONTS.italic },
                    colorSecond,
                  ]}
                >{`"${user?.email}/bye-scenario"`}</Text>{" "}
                {i18n.t("form.profile.delete.account.label2")}
                {"."}
              </Text>
              {errors.confirmation && (
                <Text style={[formStyles.error, colorError]}> *</Text>
              )}
            </View>
            <View style={[formStyles.inputContainer, borderPrimary]}>
              <TextInput
                autoCapitalize="none"
                autoFocus
                placeholder={i18n.t("form.profile.delete.account.placeholder")}
                style={[formStyles.input, colorPrimary]}
                cursorColor={THEME?.color.main}
                selectionColor={THEME?.color.main}
                value={values.confirmation}
                onChangeText={(value) => {
                  handleChange("confirmation")(value);
                  setConfirmation(value);
                }}
                onBlur={handleBlur("confirmation")}
                onSubmitEditing={() => handleSubmit()}
                blurOnSubmit
                clearButtonMode="while-editing"
                enablesReturnKeyAutomatically
                returnKeyType="send"
              />
            </View>
            {errors.confirmation && (
              <Text
                style={[
                  formStyles.error,
                  { width: "80%", textAlign: "center" },
                  colorError,
                ]}
              >
                {errors.confirmation}
              </Text>
            )}
          </View>
        )}
      </Formik>
      <Toasts overrideDarkMode={!darkTheme} />
    </View>
  );
}
