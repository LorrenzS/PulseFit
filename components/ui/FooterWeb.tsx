import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function FooterWeb() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  if (Platform.OS !== "web") return null;

  return (
    <View
      style={[
        styles.container,
        { borderTopColor: colors.icon, backgroundColor: colors.background },
      ]}
    >
      <Text style={[styles.text, { color: colors.text }]}>
        © {new Date().getFullYear()} PulseFit
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 56,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  text: {
    fontSize: 14,
  },
});
