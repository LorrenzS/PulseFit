import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, View } from "react-native";
import "react-native-reanimated";

import HeaderWeb from "@/components/ui/HeaderWeb";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Helvetica: require("../assets/fonts/Helvetica.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <PaperProvider
        theme={{
          ...PaperDefaultTheme,
          colors: {
            ...PaperDefaultTheme.colors,
            primary: Colors[colorScheme ?? "light"].tint,
            background: Colors[colorScheme ?? "light"].background,
          },
        }}
      >
        {/* <AuthProvider> */}
        {Platform.OS === "web" && <HeaderWeb />}

        <View style={styles.centerContainer}>
          <View style={styles.contentContainer}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </View>
        </View>
        {/* </AuthProvider> */}
      </PaperProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    width: "100%",
    alignItems: "center",
    flex: 1,
  },
  contentContainer: {
    width: "100%",
    maxWidth: 1200,
  },
});
