import { Text, TextInput, View } from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { router, useNavigation } from "expo-router";
import i18n from "@/services/i18n";
import { useThemeContext } from "@/app/context/ThemeContext";
import { editEmailSchema } from "@/services/validators";
import { useAuth } from "@/app/context/AuthContext";
import formStyles from "@/styles/form.style";
import { instanceAPI } from "@/services/instances";
import { notifyError, notifySuccess } from "@/components/toasts/Toast";
import { Toasts } from "@backpackapp-io/react-native-toast";
import { Formik, FormikProps } from "formik";
import useStyle from "@/hooks/useStyle";
import SubmitButton from "@/components/ui/SubmitButton";
import Button from "@/components/ui/Button";

export default function EditEmail() {
  const { THEME, darkTheme } = useThemeContext();
  const { backgroundPrimary, colorPrimary, colorError, borderPrimary } =
    useStyle();
  const { user, onLogout } = useAuth();
  const [email, setEmail] = useState<string | undefined>(user?.email);

  //--- Formik Ref to call onSubmit from the Screen header ---//
  const formRef = useRef<FormikProps<{ email: string }>>(null);

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
            {i18n.t("form.profile.update.email.cancel")}
          </Text>
        </Button>
      ),
      headerRight: () => (
        <SubmitButton
          title={i18n.t("form.profile.update.email.submit")}
          disabled={
            !editEmailSchema.isValidSync({ email }) || email === user?.email
          }
          onPress={() => formRef.current?.handleSubmit()}
          height={6}
        />
      ),
    });
  }, [navigation, email, THEME]);

  const modifyEmail = async (email: string) => {
    if (user) {
      try {
        const isUpdated = await instanceAPI.put(
          `/api/v1/user/email/${user.id}`,
          {
            email,
          }
        );
        if (isUpdated) {
          onLogout!();
          notifySuccess(i18n.t("toast.success.profile.update.email"));
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
          {i18n.t("form.profile.update.email.title")}
        </Text>
        <Text style={[formStyles.subtitle, colorPrimary]}>
          {i18n.t("form.profile.update.subtitle")}
        </Text>
      </View>
      <Formik
        innerRef={formRef}
        initialValues={{
          email: user!.email,
        }}
        validationSchema={editEmailSchema}
        onSubmit={(values) => {
          modifyEmail(values.email);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View style={formStyles.container}>
            <View style={formStyles.labelContainer}>
              <Text style={[formStyles.label, colorPrimary]}>
                {i18n.t("form.profile.update.email.label")}
              </Text>
              {errors.email && (
                <Text style={[formStyles.error, colorError]}> *</Text>
              )}
            </View>
            <View style={[formStyles.inputContainer, borderPrimary]}>
              <TextInput
                autoCapitalize="none"
                autoFocus
                placeholder={i18n.t("form.profile.update.email.placeholder")}
                style={[formStyles.input, colorPrimary, borderPrimary]}
                cursorColor={THEME?.color.main}
                selectionColor={THEME?.color.main}
                value={values.email}
                onChangeText={(value) => {
                  handleChange("email")(value);
                  setEmail(value);
                }}
                onBlur={handleBlur("email")}
                onSubmitEditing={() => handleSubmit()}
                blurOnSubmit
                clearButtonMode="while-editing"
                enablesReturnKeyAutomatically
                returnKeyType="send"
              />
            </View>
            {errors.email && (
              <Text style={[formStyles.error, colorError]}>{errors.email}</Text>
            )}
          </View>
        )}
      </Formik>
      <Toasts overrideDarkMode={!darkTheme} />
    </View>
  );
}
