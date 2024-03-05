import React from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { useAuth } from "@/app/context/AuthContext";
import i18n from "@/services/i18n";
import { Formik } from "formik";
import { forgottenSchema } from "@/services/validators";
import formStyles from "@/styles/form.style";
import { Link } from "expo-router";
import { Toasts } from "@backpackapp-io/react-native-toast";
import { useThemeContext } from "@/app/context/ThemeContext";
import useStyle from "@/hooks/useStyle";
import SubmitButton from "@/components/ui/SubmitButton";

export default function ForgotForm() {
  const { onForgot, loader } = useAuth();
  const { THEME, darkTheme } = useThemeContext();
  const {
    backgroundPrimary,
    colorPrimary,
    colorAlt,
    colorError,
    borderPrimary,
    borderAlt,
  } = useStyle();

  return (
    <View style={[formStyles.form, backgroundPrimary]}>
      <View style={formStyles.titleContainer}>
        <Text style={[formStyles.title, colorPrimary]}>
          {i18n.t("form.auth.title.forgot.title")}
        </Text>
        <Text style={[formStyles.subtitle, colorPrimary]}>
          {i18n.t("form.auth.title.forgot.subtitle")}
        </Text>
      </View>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={forgottenSchema}
        onSubmit={(values) => {
          onForgot!(values.email);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <>
            <View style={formStyles.container}>
              <View style={formStyles.labelContainer}>
                <Text style={[formStyles.label, colorPrimary]}>
                  {i18n.t("form.auth.label.email")}
                </Text>
                {errors.email && (
                  <Text style={[formStyles.error, colorError]}> *</Text>
                )}
              </View>
              <View style={[formStyles.inputContainer, borderPrimary]}>
                <TextInput
                  autoCapitalize="none"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  placeholder={
                    i18n.t("form.auth.placeholder.part1") +
                    ` ${i18n.t("form.auth.label.email").toLocaleLowerCase()} ` +
                    i18n.t("form.auth.placeholder.part2")
                  }
                  style={[formStyles.input, colorPrimary]}
                  cursorColor={THEME?.color.main}
                  selectionColor={THEME?.color.main}
                  clearButtonMode="always"
                />
              </View>
              {errors.email && (
                <Text style={[formStyles.error, colorError]}>
                  {errors.email}
                </Text>
              )}
            </View>
            <SubmitButton
              title={i18n.t("form.auth.submit.forgot")}
              disabled={!forgottenSchema.isValidSync(values) || loader!}
              loader={loader!}
              onPress={() => handleSubmit()}
              height={8}
            />
            <View style={formStyles.switchContainer}>
              <Text style={[formStyles.label, colorAlt]}>
                {i18n.t("form.auth.switch.forgot.number1")}
              </Text>
              <Link
                href="/(modals)/login"
                style={[formStyles.underlineBtn, borderAlt]}
                asChild
              >
                <Pressable>
                  <Text style={[formStyles.switchBtn, colorAlt]}>
                    {i18n.t("form.auth.switch.forgot.number2")}
                  </Text>
                </Pressable>
              </Link>
            </View>
          </>
        )}
      </Formik>
      <Toasts overrideDarkMode={!darkTheme} />
    </View>
  );
}
