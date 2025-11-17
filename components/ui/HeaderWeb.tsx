import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function HeaderWeb() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  if (Platform.OS !== "web") return null;

  return (
    <View
      accessible
      style={[
        styles.container,
        { borderBottomColor: colors.icon, backgroundColor: colors.background },
      ]}
    >
      <Link href="/" style={styles.brandLink} accessibilityLabel="Go to home">
        <Image
          source={require("@/assets/images/PulseFit.png")}
          style={styles.logo}
          contentFit="contain"
          accessibilityLabel="PulseFit logo - Home"
        />
      </Link>
      <View style={styles.nav} accessible accessibilityLabel="Main navigation">
        <Link href="/" style={styles.navLink} accessibilityLabel="Home">
          <Text style={[styles.navText, { color: colors.text }]}>Home</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: "transparent",
  },
  brandLink: {
    display: "flex",
    textDecorationLine: "none",
  },
  nav: {
    flexDirection: "row",
    gap: 16,
  },
  logo: {
    height: 45,
    width: 120,
  },
  navLink: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  navText: {
    fontSize: 16,
  },
  skipLink: {
    position: "absolute",
    left: 12,
    top: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#00000088",
    color: "#fff",
    zIndex: 50,
    borderRadius: 4,
  },
});
