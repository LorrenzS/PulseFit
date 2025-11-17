import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import ThemedButton from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import { TextInput } from "react-native-paper";

export default function SignInScreen() {
  const router = useRouter();
  const { user, loading: authLoading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) {
    router.replace("/");
    return null;
  }

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password);
      }
      router.replace("/");
    } catch (err: any) {
      setError(
        err?.message ??
          (mode === "signin"
            ? "Failed to sign in"
            : "Failed to create account"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">
        {mode === "signin" ? "Sign in" : "Create account"}
      </ThemedText>

      <View style={styles.form}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {error ? (
          <ThemedText type="default" style={styles.error}>
            {error}
          </ThemedText>
        ) : null}

        {loading || authLoading ? (
          <ActivityIndicator style={{ marginTop: 12 }} />
        ) : (
          <ThemedButton
            mode="contained"
            onPress={handleSubmit}
            style={{ marginTop: 8 }}
          >
            {mode === "signin" ? "Sign in" : "Create account"}
          </ThemedButton>
        )}

        <ThemedButton
          mode="outlined"
          onPress={() => setMode(mode === "signin" ? "signup" : "signin")}
          style={{ marginTop: 12 }}
        >
          {mode === "signin"
            ? "Create an account"
            : "Already have an account? Sign in"}
        </ThemedButton>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  form: {
    marginTop: 16,
    gap: 12,
  },
  input: {
    backgroundColor: "transparent",
  },
  error: {
    color: "#d9534f",
  },
});
