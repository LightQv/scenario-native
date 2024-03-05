import React, { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { useAuth } from "@/app/context/AuthContext";
import i18n from "@/services/i18n";
import { Formik } from "formik";
import { loginSchema } from "@/services/validators";
import formStyles from "@/styles/form.style";
import { Link } from "expo-router";
import { Toasts } from "@backpackapp-io/react-native-toast";
import { useThemeContext } from "@/app/context/ThemeContext";
import ShowPassword from "@/components/form/ShowPassword";
import SubmitButton from "@/components/ui/SubmitButton";
import useStyle from "@/hooks/useStyle";

export default function LoginForm() {
  const { onLogin, loader } = useAuth();
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
        {i18n.t("form.auth.title.login")}
      </Text>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={(values) => {
          onLogin!(values.email, values.password);
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
            <SubmitButton
              title={i18n.t("form.auth.submit.login")}
              disabled={!loginSchema.isValidSync(values) || loader!}
              loader={loader!}
              onPress={() => handleSubmit()}
              height={8}
            />
            <View style={formStyles.switchContainer}>
              <Text style={[formStyles.label, colorAlt]}>
                {i18n.t("form.auth.switch.login.number1")}
              </Text>
              <Link
                href="/(modals)/register"
                style={[formStyles.underlineBtn, borderAlt]}
                asChild
              >
                <Pressable>
                  <Text style={[formStyles.switchBtn, colorAlt]}>
                    {i18n.t("form.auth.switch.login.number2")}
                  </Text>
                </Pressable>
              </Link>
            </View>
          </>
        )}
      </Formik>
      <View style={formStyles.switchContainer}>
        <Link
          href="/(modals)/forgot"
          style={[formStyles.underlineBtn, borderPrimary]}
          asChild
        >
          <Pressable>
            <Text style={[formStyles.forgotBtn, colorPrimary]}>
              {i18n.t("form.auth.switch.login.number3")}
            </Text>
          </Pressable>
        </Link>
      </View>
      <Toasts overrideDarkMode={!darkTheme} />
    </View>
  );
}
