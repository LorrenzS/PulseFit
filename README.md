# PulseFit — Expo app

PulseFit is a small sample app (Expo + Expo Router + React Native) used to manage simple appointments and demonstrate web-friendly layouts, Firebase authentication, and Firestore-backed persistence.

This README contains quick start steps, architecture notes, and pointers to the most important files when modifying the project.

## Tech stack

- Expo (managed) — app development and web build
- React 19, React Native 0.79.x
- expo-router for file-based routing
- react-native-paper + react-native-paper-dates for UI and calendar
- Firebase (Auth + Firestore) for authentication and data
- TypeScript

## Quick start (local)

1. Install dependencies

   ```bash
   npm install
   # or
   yarn
   ```

2. Start the development server

   ```bash
   npm start
   # or web only
   npm run web
   ```

3. Open the app

- Web: the Expo dev tools will show a local URL (usually `http://localhost:8081`).
- Mobile: open the project in Expo Go (scan QR) or run `npm run ios` / `npm run android` (requires local tooling).

## Important scripts

- `npm start` — start Expo dev server
- `npm run web` — start web build/dev host
- `npm run ios` / `npm run android` — run on simulator/device
- `npm run reset-project` — helper script used by the starter template (moves example app to `app-example`)
- `npm run lint` — run Expo/ESLint checks

## Environment & Firebase

This project uses Firebase for authentication and appointments persistence. A default `firebase/config.ts` is included and reads values from environment variables (with same defaults used in this repo). For production you should replace them with your own Firebase project values.

Environment variables (optional — used by `firebase/config.ts`):

- `EXPO_FIREBASE_API_KEY`
- `EXPO_FIREBASE_AUTH_DOMAIN`
- `EXPO_FIREBASE_PROJECT_ID`
- `EXPO_FIREBASE_STORAGE_BUCKET`
- `EXPO_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_FIREBASE_APP_ID`

You can provide these via your shell environment or via EAS/CI secrets for production builds. The repo ships with default values so the development flow works out-of-the-box, but do not leak production credentials in public repositories.

## Project structure (high level)

- `app/` — Expo Router pages and layouts (file-based routing)
  - `app/signin.tsx` — sign in / sign up screen
  - `app/(tabs)/book.tsx` — booking UI (calendar + trainers + time slots)
  - `app/(tabs)/booked.tsx` — confirmation page after booking (exports .ics)
  - `app/(tabs)/index.tsx` — dashboard (protected route)
- `components/` — UI primitives and web-specific components (HeaderWeb, FooterWeb, ThemedButton)
- `context/` — React contexts (AuthContext, AppointmentsContext)
- `firebase/` — firebase initialization (`config.ts`)
- `constants/`, `hooks/` — theme/colors and small hooks

## Key implementation notes

- Authentication: `context/AuthContext.tsx` wires Firebase Auth and exposes `useAuth()` with `signIn`, `signUp`, and `signOut` helpers. Routes under `(tabs)` expect the user to be authenticated and will redirect to `/signin` otherwise.
- Appointments: `context/AppointmentsContext.tsx` stores appointments in Firestore under `users/{uid}/appointments`. The `addAppointment` function returns the created document id so the booking flow can navigate to a confirmation page.
- Booking flow: `app/(tabs)/book.tsx` renders a calendar (left) and a list of trainers (right). Time slots render in five even columns on wide screens and are stored in Firestore when booked.
- Confirmation: `app/(tabs)/booked.tsx` displays a confirmation card and allows exporting the appointment to any calendar app

## Styling & web

- The root layout constrains content width for web (max-width ~1200px) and renders `HeaderWeb`.
- The UI uses `ThemedText` / `ThemedView` wrappers to keep typography and colors consistent with `constants/Colors.ts`.

## Next improvements

- Add unit/integration tests for context logic (Auth + Appointments).
- Add better timezone handling for appointment datetimes (store timezone or use UTC consistently).

## Live demo

- Demo: <https://lorrenzs-pulsefit--27cq67sn0d.expo.app/signin>

Public test account (for demo):

- Username: <test@pulsefit.com>
- Password: Test1234!

## License

This repository is provided as-is for demonstration and learning purposes.
