import { Link } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function HeaderWeb() {
  // Hooks must be called unconditionally
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  if (Platform.OS !== "web") return null;

  return (
    <View
      style={[
        styles.container,
        { borderBottomColor: colors.icon, backgroundColor: colors.background },
      ]}
    >
      <Link href="/" style={styles.brandLink}>
        <Text style={[styles.brand, { color: colors.tint }]}>PulseFit</Text>
      </Link>
      <View style={styles.nav}>
        <Link href="/" style={styles.navLink}>
          <Text style={[styles.navText, { color: colors.text }]}>Home</Text>
        </Link>
        <Link href="/explore" style={styles.navLink}>
          <Text style={[styles.navText, { color: colors.text }]}>Explore</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 64,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: "transparent",
  },
  brandLink: {
    textDecorationLine: "none",
  },
  brand: {
    fontSize: 20,
    fontWeight: "700",
  },
  nav: {
    flexDirection: "row",
    gap: 16,
  },
  navLink: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  navText: {
    fontSize: 16,
  },
});
