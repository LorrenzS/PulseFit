import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Appointment = {
  id: string;
  title: string;
  datetime: string; // ISO
  notes?: string;
  status?: "upcoming" | "completed" | "cancelled";
  createdAt?: string;
};

type AppointmentsContextType = {
  appointments: Appointment[];
  loading: boolean;
  addAppointment: (a: {
    title: string;
    datetime: string;
    notes?: string;
  }) => Promise<void>;
  updateAppointment: (id: string, patch: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
};

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(
  undefined,
);

export function AppointmentsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const col = collection(db, "users", user.uid, "appointments");
    const q = query(col, orderBy("datetime", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const items: Appointment[] = snapshot.docs.map((d) => {
        const data = d.data() as any;
        let datetime = data.datetime;
        // handle Firestore Timestamp
        if (datetime && (datetime as any).toDate) {
          datetime = (datetime as Timestamp).toDate().toISOString();
        }
        const createdAt =
          data.createdAt && (data.createdAt as any).toDate
            ? (data.createdAt as Timestamp).toDate().toISOString()
            : undefined;
        return {
          id: d.id,
          title: data.title || "",
          datetime: datetime ?? new Date().toISOString(),
          notes: data.notes ?? "",
          status: data.status ?? "upcoming",
          createdAt,
        };
      });
      setAppointments(items);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const addAppointment = useCallback(
    async ({
      title,
      datetime,
      notes,
    }: {
      title: string;
      datetime: string;
      notes?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const col = collection(db, "users", user.uid, "appointments");
      await addDoc(col, {
        title,
        datetime: new Date(datetime).toISOString(),
        notes: notes ?? "",
        status: "upcoming",
        createdAt: serverTimestamp(),
      });
    },
    [user],
  );

  const updateAppointment = useCallback(
    async (id: string, patch: Partial<Appointment>) => {
      if (!user) throw new Error("Not authenticated");
      const ref = doc(db, "users", user.uid, "appointments", id);
      const payload: any = { ...patch };
      if (payload.datetime)
        payload.datetime = new Date(payload.datetime).toISOString();
      await updateDoc(ref, payload);
    },
    [user],
  );

  const deleteAppointment = useCallback(
    async (id: string) => {
      if (!user) throw new Error("Not authenticated");
      const ref = doc(db, "users", user.uid, "appointments", id);
      await deleteDoc(ref);
    },
    [user],
  );

  const value = useMemo(
    () => ({
      appointments,
      loading,
      addAppointment,
      updateAppointment,
      deleteAppointment,
    }),
    [
      appointments,
      loading,
      addAppointment,
      updateAppointment,
      deleteAppointment,
    ],
  );

  return (
    <AppointmentsContext.Provider value={value}>
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  const ctx = useContext(AppointmentsContext);
  if (!ctx)
    throw new Error("useAppointments must be used within AppointmentsProvider");
  return ctx;
}
