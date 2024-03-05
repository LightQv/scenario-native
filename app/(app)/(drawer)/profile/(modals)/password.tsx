import { Text, TextInput, View } from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { router, useNavigation } from "expo-router";
import i18n from "@/services/i18n";
import { useThemeContext } from "@/app/context/ThemeContext";
import { editPasswordSchema } from "@/services/validators";
import { useAuth } from "@/app/context/AuthContext";
import formStyles from "@/styles/form.style";
import { instanceAPI } from "@/services/instances";
import { notifyError, notifySuccess } from "@/components/toasts/Toast";
import { Formik, FormikProps } from "formik";
import { Toasts } from "@backpackapp-io/react-native-toast";
import ShowPassword from "@/components/form/ShowPassword";
import useStyle from "@/hooks/useStyle";
import SubmitButton from "@/components/ui/SubmitButton";
import Button from "@/components/ui/Button";

export default function EditPassword() {
  const { THEME, darkTheme } = useThemeContext();
  const { backgroundPrimary, colorPrimary, colorError, borderPrimary } =
    useStyle();
  const { user, onLogout } = useAuth();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState<boolean>(true);

  //--- Formik Ref to call onSubmit from the Screen header ---//
  const formRef =
    useRef<FormikProps<{ password: string; confirmPassword: string }>>(null);

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
            {i18n.t("form.profile.update.password.cancel")}
          </Text>
        </Button>
      ),
      headerRight: () => (
        <SubmitButton
          title={i18n.t("form.profile.update.password.submit")}
          disabled={
            !editPasswordSchema.isValidSync({ password, confirmPassword })
          }
          onPress={() => formRef.current?.handleSubmit()}
          height={6}
        />
      ),
    });
  }, [navigation, password, confirmPassword, THEME]);

  const modifyPassword = async (password: string, confirmPassword: string) => {
    if (user) {
      try {
        const isUpdated = await instanceAPI.put(
          `/api/v1/user/password/${user.id}`,
          {
            password,
            confirmPassword,
          }
        );
        if (isUpdated) {
          onLogout!();
          notifySuccess(i18n.t("toast.success.profile.update.password"));
        }
      } catch (err) {
        if (err) {
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
          {i18n.t("form.profile.update.password.title")}
        </Text>
        <Text style={[formStyles.subtitle, colorPrimary]}>
          {i18n.t("form.profile.update.subtitle")}
        </Text>
      </View>
      <Formik
        innerRef={formRef}
        initialValues={{
          password: "",
          confirmPassword: "",
        }}
        validationSchema={editPasswordSchema}
        onSubmit={(values) => {
          modifyPassword(values.password, values.confirmPassword);
        }}
      >
        {({ handleChange, handleBlur, values, errors }) => (
          <>
            <View style={formStyles.container}>
              <View style={formStyles.labelContainer}>
                <Text style={[formStyles.label, colorPrimary]}>
                  {i18n.t("form.profile.update.password.label1")}
                </Text>
                {errors.password && (
                  <Text style={[formStyles.error, colorError]}> *</Text>
                )}
              </View>
              <View style={[formStyles.inputContainer, borderPrimary]}>
                <TextInput
                  autoCapitalize="none"
                  autoFocus
                  placeholder={
                    i18n.t("form.auth.placeholder.part1") +
                    ` ${i18n
                      .t("form.auth.label.password")
                      .toLocaleLowerCase()} ` +
                    i18n.t("form.auth.placeholder.part2")
                  }
                  style={[formStyles.input, colorPrimary]}
                  cursorColor={THEME?.color.main}
                  selectionColor={THEME?.color.main}
                  value={values.password}
                  onChangeText={(value) => {
                    handleChange("password")(value);
                    setPassword(value);
                  }}
                  onBlur={handleBlur("password")}
                  blurOnSubmit
                  clearButtonMode="while-editing"
                  enablesReturnKeyAutomatically
                  returnKeyType="send"
                  secureTextEntry={hidePassword}
                />
                <ShowPassword
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
              </View>
              {errors.password && (
                <Text style={[formStyles.error, colorError]}>
                  {errors.password}
                </Text>
              )}
            </View>

            <View style={formStyles.container}>
              <View style={formStyles.labelContainer}>
                <Text style={[formStyles.label, colorPrimary]}>
                  {i18n.t("form.profile.update.password.label2")}
                </Text>
                {errors.confirmPassword && (
                  <Text style={[formStyles.error, colorError]}> *</Text>
                )}
              </View>
              <View style={[formStyles.inputContainer, borderPrimary]}>
                <TextInput
                  autoCapitalize="none"
                  placeholder={
                    i18n.t("form.auth.placeholder.part3") +
                    ` ${i18n
                      .t("form.auth.label.password")
                      .toLocaleLowerCase()} ` +
                    i18n.t("form.auth.placeholder.part2")
                  }
                  style={[formStyles.input, colorPrimary, borderPrimary]}
                  cursorColor={THEME?.color.main}
                  selectionColor={THEME?.color.main}
                  value={values.confirmPassword}
                  onChangeText={(value) => {
                    handleChange("confirmPassword")(value);
                    setConfirmPassword(value);
                  }}
                  onBlur={handleBlur("confirmPassword")}
                  blurOnSubmit
                  clearButtonMode="while-editing"
                  enablesReturnKeyAutomatically
                  returnKeyType="send"
                  secureTextEntry={hideConfirmPassword}
                />
                <ShowPassword
                  hidePassword={hideConfirmPassword}
                  setHidePassword={setHideConfirmPassword}
                />
              </View>
              {errors.confirmPassword && (
                <Text style={[formStyles.error, colorError]}>
                  {errors.confirmPassword}
                </Text>
              )}
            </View>
          </>
        )}
      </Formik>
      <Toasts overrideDarkMode={!darkTheme} />
    </View>
  );
}
