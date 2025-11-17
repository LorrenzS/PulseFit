import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Button, ButtonProps } from "react-native-paper";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

type Props = Omit<ButtonProps, "buttonColor" | "textColor"> & {
  style?: StyleProp<ViewStyle>;
};

export default function ThemedButton({
  mode = "contained",
  style,
  children,
  ...rest
}: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // react-native-paper props: buttonColor (for contained), textColor (for label)
  const common = {} as Partial<ButtonProps>;

  if (mode === "contained") {
    common.buttonColor = colors.tint;
    common.textColor = "#fff";
  } else {
    // text or outlined
    common.textColor = colors.tint;
  }

  // If outlined, add a tint-colored border so it's visually clear
  const outlinedStyle: StyleProp<ViewStyle> =
    mode === "outlined"
      ? [styles.outlined, { borderColor: colors.tint }]
      : undefined;

  return (
    <Button mode={mode} style={[style, outlinedStyle]} {...common} {...rest}>
      {children}
    </Button>
  );
}

const styles = StyleSheet.create({
  outlined: {
    borderWidth: 1,
  },
});
