import "dotenv/config";

export default ({ config }) => {
  return {
    ...config,
    name: "PulseFit",
    slug: "PulseFit",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "pulsefit",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      EXPO_FIREBASE_API_KEY: process.env.EXPO_FIREBASE_API_KEY,
      EXPO_FIREBASE_AUTH_DOMAIN: process.env.EXPO_FIREBASE_AUTH_DOMAIN,
      EXPO_FIREBASE_PROJECT_ID: process.env.EXPO_FIREBASE_PROJECT_ID,
      EXPO_FIREBASE_STORAGE_BUCKET: process.env.EXPO_FIREBASE_STORAGE_BUCKET,
      EXPO_FIREBASE_MESSAGING_SENDER_ID:
        process.env.EXPO_FIREBASE_MESSAGING_SENDER_ID,
      EXPO_FIREBASE_APP_ID: process.env.EXPO_FIREBASE_APP_ID,
    },
  };
};
