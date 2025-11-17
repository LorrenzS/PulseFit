import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppointments } from "@/context/AppointmentsContext";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Chip } from "react-native-paper";
import { Calendar } from "react-native-paper-dates";

type Trainer = {
  id: string;
  name: string;
  role: string;
  image: string;
  times: string[]; // e.g. '12:00 PM'
};

const TRAINERS: Trainer[] = [
  {
    id: "t1",
    name: "Nicole Smith",
    role: "Personal Trainer - Strength & Conditioning",
    image: "https://placehold.co/400x400",
    times: [
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
      "6:00 PM",
      "7:00 PM",
      "8:00 PM",
    ],
  },
  {
    id: "t2",
    name: "John Brown",
    role: "Personal Trainer - Weight Loss & Wellness",
    image: "https://placehold.co/400x400",
    times: ["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"],
  },
  {
    id: "t3",
    name: "Emily Davis",
    role: "Personal Trainer - Functional Fitness & Mobility",
    image: "https://placehold.co/400x400",
    times: [
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
      "6:00 PM",
      "7:00 PM",
      "8:00 PM",
    ],
  },
];

export default function BookScreen() {
  const { addAppointment } = useAppointments();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [selectedTrainer, setSelectedTrainer] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const availableTrainers = useMemo(() => TRAINERS, []);

  const onSelectSlot = (trainerId: string, time: string) => {
    setSelectedTrainer(trainerId);
    setSelectedTime(time);
  };

  const book = async () => {
    if (!selectedDate || !selectedTrainer || !selectedTime) return;
    setSaving(true);
    try {
      const iso = new Date(
        `${selectedDate.toDateString()} ${selectedTime}`,
      ).toISOString();
      const title = `${
        availableTrainers.find((t) => t.id === selectedTrainer)?.name
      } - ${selectedTime}`;
      const id = await addAppointment({
        title,
        datetime: iso,
        notes: "",
      });
      const trainer = availableTrainers.find((t) => t.id === selectedTrainer);
      const params = `?id=${encodeURIComponent(
        id,
      )}&trainerName=${encodeURIComponent(
        trainer?.name ?? "",
      )}&trainerImage=${encodeURIComponent(trainer?.image ?? "")}`;
      router.replace(`/booked${params}` as any);
    } catch (e) {
      console.error("booking failed", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ThemedView style={styles.page}>
      <View style={styles.container}>
        <ThemedText type="subtitle" style={{ color: Colors.light.main }}>
          Book a visit
        </ThemedText>
        <View style={styles.contentContainer}>
          <View style={styles.leftColumn}>
            <ThemedText
              type="default"
              style={{ marginBottom: 12, color: Colors.light.main }}
            >
              Choose a date to see available times.
            </ThemedText>
            <Card>
              <Card.Content>
                <Calendar
                  locale="en"
                  mode="single"
                  date={selectedDate}
                  onChange={(d) => setSelectedDate(d?.date ?? undefined)}
                />
              </Card.Content>
            </Card>
          </View>

          <View style={styles.rightColumn}>
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 120,
                paddingHorizontal: 8,
              }}
            >
              {availableTrainers.map((t) => (
                <View key={t.id}>
                  <Card style={styles.trainerCard}>
                    <Card.Title
                      title={t.name}
                      subtitle={t.role}
                      left={() => (
                        <View style={styles.avatarCircle}>
                          <ThemedText style={styles.avatarText}>
                            {t.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </ThemedText>
                        </View>
                      )}
                      subtitleStyle={{ color: Colors.light.dark }}
                    />
                  </Card>
                  <View style={styles.timesRow}>
                    {t.times.map((time) => {
                      const selected =
                        selectedTrainer === t.id && selectedTime === time;
                      return (
                        <View key={time} style={styles.timeCell}>
                          <Chip
                            mode={selected ? "flat" : "outlined"}
                            style={[
                              styles.timeChip,
                              selected ? styles.timeChipSelected : null,
                            ]}
                            textStyle={[
                              styles.timeChipText,
                              selected
                                ? styles.timeChipTextSelected
                                : undefined,
                            ]}
                            onPress={() => onSelectSlot(t.id, time)}
                          >
                            {time}
                          </Chip>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerInner}>
          <ThemedText>
            {selectedTrainer && selectedTime
              ? `Selected: ${
                  availableTrainers.find((t) => t.id === selectedTrainer)?.name
                } — ${selectedTime}`
              : "No time selected"}
          </ThemedText>
          <Button
            mode="contained"
            onPress={book}
            loading={saving}
            disabled={!selectedDate || !selectedTime || saving}
          >
            Book this visit
          </Button>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    padding: 24,
  },
  container: {
    width: "100%",
    maxWidth: 900,
    gap: 16,
  },
  contentContainer: {
    flexDirection: "row",
    width: "100%",
    maxWidth: 900,
    gap: 24,
  },
  leftColumn: {
    width: 360,
  },
  rightColumn: {
    flex: 1,
  },
  trainerCard: {
    marginBottom: 18,
    backgroundColor: Colors.light.white,
  },
  timesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
    marginBottom: 24,
  },
  timeCell: {
    width: "20%",
    paddingHorizontal: 4,
    marginBottom: 8,
    alignItems: "center",
  },
  timeChip: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  timeChipSelected: {
    backgroundColor: Colors.light.tint,
  },
  timeChipText: {
    color: Colors.light.tint,
  },
  timeChipTextSelected: {
    color: "white",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.light.background,
    borderTopColor: Colors.light.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: 16,
    alignItems: "center",
  },
  footerInner: {
    width: "100%",
    maxWidth: 900,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  avatarText: {
    fontWeight: "700",
  },
});
