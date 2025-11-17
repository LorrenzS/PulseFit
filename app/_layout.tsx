import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Platform } from "react-native";
import "react-native-reanimated";

import HeaderWeb from "@/components/ui/HeaderWeb";
import { Colors } from "@/constants/Colors";
import { AppointmentsProvider } from "@/context/AppointmentsContext";
import { AuthProvider } from "@/context/AuthContext";
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
            surface: Colors[colorScheme ?? "light"].white,
            surfaceVariant: Colors[colorScheme ?? "light"].white,
            onSurface: Colors[colorScheme ?? "light"].tint,
            primaryContainer: Colors[colorScheme ?? "light"].background,
            primary: Colors[colorScheme ?? "light"].tint,
            background: Colors[colorScheme ?? "light"].background,
          },
        }}
      >
        <AuthProvider>
          <AppointmentsProvider>
            {Platform.OS === "web" && <HeaderWeb />}

            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="signin" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </AppointmentsProvider>
        </AuthProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
