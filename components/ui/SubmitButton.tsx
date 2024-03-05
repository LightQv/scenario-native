import { Pressable, Text } from "react-native";
import React from "react";
import formStyles from "@/styles/form.style";
import useStyle from "@/hooks/useStyle";
import { BUTTON } from "@/constants/theme";
import { View } from "moti";
import { useThemeContext } from "@/app/context/ThemeContext";
import * as Progress from "react-native-progress";

type SubmitButtonProps = {
  title: string;
  disabled?: boolean;
  loader?: boolean;
  onPress: () => void;
  height: number;
};

export default function SubmitButton({
  title,
  disabled,
  loader,
  onPress,
  height,
}: SubmitButtonProps) {
  const { THEME } = useThemeContext();
  const { colorMain, borderMain } = useStyle();

  return (
    <Pressable
      style={({ pressed }) => [
        formStyles.borderBtn,
        borderMain,
        {
          opacity: pressed || disabled ? BUTTON.opacity : 1,
          paddingVertical: height,
        },
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={[formStyles.btnText, colorMain]}>{title}</Text>
      {loader && (
        <View style={formStyles.loader}>
          <Progress.Bar
            color={THEME?.color.main}
            borderRadius={0}
            borderWidth={0}
            indeterminate
            indeterminateAnimationDuration={1000}
          />
        </View>
      )}
    </Pressable>
  );
}
