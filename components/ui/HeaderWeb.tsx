import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Avatar, Button, Menu } from "react-native-paper";

import { useAuth } from "@/context/AuthContext";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function HeaderWeb() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const { user, signOut } = useAuth();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleSignOut = async () => {
    closeMenu();
    try {
      await signOut();
    } catch (e) {
      // ignore
    }
    router.replace("/signin");
  };

  if (Platform.OS !== "web") return null;

  return (
    <View
      accessible
      style={[
        styles.container,
        {
          borderBottomColor: colors.border,
          backgroundColor: colors.background,
        },
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
        {user ? (
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={(() => {
              const initials = (user.displayName || user.email || "")
                .split(" ")
                .map((s: string) => s[0])
                .slice(0, 2)
                .join("") as string;
              return (
                <Button onPress={openMenu} compact style={styles.userButton}>
                  <Avatar.Text size={28} label={initials} />
                  <Text style={[styles.userName, { color: colors.text }]}>
                    {" "}
                    {user.displayName ?? user.email}
                  </Text>
                </Button>
              );
            })()}
          >
            <Menu.Item onPress={handleSignOut} title="Log out" />
          </Menu>
        ) : (
          <Link
            href="/signin"
            style={styles.navLink}
            accessibilityLabel="Sign in"
          >
            <Text style={[styles.navText, { color: colors.text }]}>
              Sign in
            </Text>
          </Link>
        )}
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
  userButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  userName: {
    marginLeft: 8,
    fontSize: 14,
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
