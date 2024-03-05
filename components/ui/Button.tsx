import { Pressable } from "react-native";
import React from "react";
import { BUTTON } from "@/constants/theme";

type ButtonProps = {
  onPress?: () => void;
  style?: object;
  disabled?: boolean;
  children: JSX.Element;
};

export default function Button({
  onPress,
  style,
  disabled,
  children,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? BUTTON.opacity : 1,
        },
        style,
      ]}
      disabled={disabled}
    >
      {children}
    </Pressable>
  );
}
