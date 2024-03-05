import React, { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { useAuth } from "@/app/context/AuthContext";
import i18n from "@/services/i18n";
import { Formik } from "formik";
import { registerSchema } from "@/services/validators";
import formStyles from "@/styles/form.style";
import { Link } from "expo-router";
import { Toasts } from "@backpackapp-io/react-native-toast";
import { useThemeContext } from "@/app/context/ThemeContext";
import ShowPassword from "@/components/form/ShowPassword";
import useStyle from "@/hooks/useStyle";
import SubmitButton from "@/components/ui/SubmitButton";

export default function RegisterForm() {
  const { onRegister, loader } = useAuth();
  const { THEME, darkTheme } = useThemeContext();
  const {
    backgroundPrimary,
    colorPrimary,
    colorAlt,
    colorError,
    borderPrimary,
    borderAlt,
  } = useStyle();
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  return (
    <View style={[formStyles.form, backgroundPrimary]}>
      <Text style={[formStyles.title, colorPrimary]}>
        {i18n.t("form.auth.title.register")}
      </Text>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={registerSchema}
        onSubmit={(values) => {
          onRegister!(
            values.username,
            values.email,
            values.password,
            values.confirmPassword
          );
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <>
            <View style={formStyles.container}>
              <View style={formStyles.labelContainer}>
                <Text style={[formStyles.label, colorPrimary]}>
                  {i18n.t("form.auth.label.username")}
                </Text>
                {errors.username && (
                  <Text style={[formStyles.error, colorError]}> *</Text>
                )}
              </View>
              <View style={[formStyles.inputContainer, borderPrimary]}>
                <TextInput
                  autoCapitalize="none"
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  value={values.username}
                  placeholder={
                    i18n.t("form.auth.placeholder.part1") +
                    ` ${i18n
                      .t("form.auth.label.username")
                      .toLocaleLowerCase()} ` +
                    i18n.t("form.auth.placeholder.part2")
                  }
                  style={[formStyles.input, colorPrimary]}
                  cursorColor={THEME?.color.main}
                  selectionColor={THEME?.color.main}
                  clearButtonMode="always"
                />
              </View>
              {errors.username && (
                <Text style={[formStyles.error, colorError]}>
                  {errors.username}
                </Text>
              )}
            </View>
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
            <View style={formStyles.container}>
              <View style={formStyles.labelContainer}>
                <Text style={[formStyles.label, colorPrimary]}>
                  {i18n.t("form.auth.label.password")}
                </Text>
                {errors.password && (
                  <Text style={[formStyles.error, colorError]}> *</Text>
                )}
              </View>
              <View style={[formStyles.inputContainer, borderPrimary]}>
                <TextInput
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
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
                  clearButtonMode="always"
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
                  {i18n.t("form.auth.label.confirmPassword")}
                </Text>
                {errors.confirmPassword && (
                  <Text style={[formStyles.error, colorError]}> *</Text>
                )}
              </View>
              <View style={[formStyles.inputContainer, borderPrimary]}>
                <TextInput
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  placeholder={
                    i18n.t("form.auth.placeholder.part3") +
                    ` ${i18n
                      .t("form.auth.label.password")
                      .toLocaleLowerCase()} ` +
                    i18n.t("form.auth.placeholder.part2")
                  }
                  style={[formStyles.input, colorPrimary]}
                  cursorColor={THEME?.color.main}
                  selectionColor={THEME?.color.main}
                  clearButtonMode="always"
                  secureTextEntry={hidePassword}
                />
                <ShowPassword
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
              </View>
              {errors.confirmPassword && (
                <Text style={[formStyles.error, colorError]}>
                  {errors.confirmPassword}
                </Text>
              )}
            </View>
            <SubmitButton
              title={i18n.t("form.auth.submit.register")}
              disabled={!registerSchema.isValidSync(values) || loader!}
              loader={loader!}
              onPress={() => handleSubmit()}
              height={8}
            />
            <View style={formStyles.switchContainer}>
              <Text style={[formStyles.label, colorAlt]}>
                {i18n.t("form.auth.switch.register.number1")}
              </Text>
              <Link
                href="/(modals)/login"
                style={[formStyles.underlineBtn, borderAlt]}
                asChild
              >
                <Pressable>
                  <Text style={[formStyles.switchBtn, colorAlt]}>
                    {i18n.t("form.auth.switch.register.number2")}
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
