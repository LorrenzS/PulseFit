import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppointments } from "@/context/AppointmentsContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, Linking, Platform, StyleSheet, View } from "react-native";
import { Button, Card } from "react-native-paper";

export default function Booked() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, trainerName, trainerImage } = params as any;
  const { appointments } = useAppointments();

  const appt = appointments.find((a) => a.id === id);

  const onAddToCalendar = async () => {
    if (!appt) return;
    const start = new Date(appt.datetime);
    const end = new Date(start.getTime() + 50 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/-|:|\.\d{3}/g, ""); // YYYYMMDDTHHMMSSZ
    const dates = `${fmt(start)}/${fmt(end)}`;
    const title = encodeURIComponent(appt.title);
    const details = encodeURIComponent(appt.notes ?? "");
    const url = `https://calendar.google.com/calendar/r/eventedit?text=${title}&dates=${dates}&details=${details}`;
    try {
      if (Platform.OS === "web") {
        window.open(url, "_blank");
      } else {
        await Linking.openURL(url);
      }
    } catch (e) {
      console.warn("Failed to open calendar url", e);
    }
  };

  return (
    <ThemedView style={styles.page}>
      <View style={styles.inner}>
        <View style={styles.iconCircle}>
          <ThemedText style={styles.check}>✓</ThemedText>
        </View>
        <ThemedText type="title" style={styles.heading}>
          Your visit is booked.
        </ThemedText>

        <Card style={styles.apptCard}>
          <Card.Content style={styles.apptContent}>
            {trainerImage ? (
              <Image source={{ uri: trainerImage }} style={styles.cardImage} />
            ) : null}
            <View style={styles.cardText}>
              <ThemedText type="subtitle" style={{ color: Colors.light.main }}>
                {trainerName || (appt ? appt.title.split(" - ")[0] : "")}
              </ThemedText>
              <ThemedText style={{ color: Colors.light.icon }}>
                {appt ? new Date(appt.datetime).toDateString() : ""}
              </ThemedText>
              <ThemedText style={{ color: Colors.light.icon }}>
                {appt
                  ? new Date(appt.datetime).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : ""}
              </ThemedText>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => router.replace("/")}
            style={styles.primaryBtn}
          >
            Back to Dashboard
          </Button>
          <Button mode="outlined" onPress={onAddToCalendar}>
            Add to Calendar
          </Button>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: Colors.light.background,
  },
  inner: {
    width: "100%",
    maxWidth: 760,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 40,
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  } as any,
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.tint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  check: {
    color: "white",
    fontSize: 24,
  },
  heading: {
    fontSize: 20,
    marginBottom: 20,
  },
  apptCard: {
    width: "100%",
    marginBottom: 28,
    backgroundColor: Colors.light.white,
  },
  apptContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardImage: {
    width: 72,
    height: 72,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: "#EEE",
  },
  cardText: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
  } as any,
  primaryBtn: {
    marginRight: 12,
  },
});
