import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAppointments } from "@/context/AppointmentsContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Card } from "react-native-paper";

type Appointment = {
  id: string;
  title: string;
  datetime: string; // ISO string
  notes?: string;
  status?: "upcoming" | "completed" | "cancelled";
};

export default function HomeScreen() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect unauthenticated users to the sign-in page after auth state resolves
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/signin" as any);
    }
  }, [authLoading, user, router]);

  const {
    appointments,
    loading: apptsLoading,
    updateAppointment,
  } = useAppointments();

  const upcoming = useMemo(
    () => appointments.filter((a) => a.status === "upcoming"),
    [appointments],
  );

  const renderItem = ({ item }: { item: Appointment }) => (
    <Card style={styles.card} key={item.id}>
      <Card.Title
        title={item.title}
        subtitle={new Date(item.datetime).toLocaleString()}
      />
      <Card.Content>
        <ThemedText>{item.notes}</ThemedText>
      </Card.Content>
      <Card.Actions>
        <Button
          onPress={() => updateAppointment(item.id, { status: "completed" })}
        >
          Mark done
        </Button>
        <Button
          onPress={() => updateAppointment(item.id, { status: "cancelled" })}
        >
          Cancel
        </Button>
      </Card.Actions>
    </Card>
  );

  if (authLoading) {
    // while we don't know auth state, render nothing (or a spinner in future)
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.contentContainer}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Dashboard</ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Upcoming appointments</ThemedText>
          {apptsLoading ? (
            <ThemedText>Loading appointments…</ThemedText>
          ) : upcoming.length === 0 ? (
            <ThemedText>No upcoming appointments.</ThemedText>
          ) : (
            <FlatList
              data={upcoming}
              renderItem={renderItem}
              keyExtractor={(i) => i.id}
              style={{ width: "100%", padding: 16 }}
            />
          )}
          <View style={{ marginTop: 12 }}>
            <Button
              mode="contained"
              onPress={() => router.push("/book" as any)}
            >
              Book a new visit
            </Button>
          </View>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: "100%",
    padding: 24,
    alignItems: "center",
  },
  contentContainer: {
    width: "100%",
    maxWidth: 900,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    marginTop: 16,
    gap: 8,
    marginBottom: 8,
    width: "100%",
  },
  card: {
    marginBottom: 12,
    backgroundColor: "transparent",
  },
});
