import { AuthProvider } from "@/auth/auth-context";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";

SplashScreen.preventAutoHideAsync();
const colorScheme = useColorScheme();


export default function RootLayout() {
  return (
        <ThemeProvider
      value={
        colorScheme === "dark"
          ? DarkTheme
          : DefaultTheme
      }
    >
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Society Gate",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="auth/login"
          options={{
            title: "Login",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="resident/index"
          options={{
            title: "Resident Dashboard",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="security/index"
          options={{
            title: "Security Dashboard",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="security/create-visitor"
          options={{
            title: "Create Visitor",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="explore"
          options={{
            title: "Explore",
            headerShown: false,
          }}
        />
      </Stack>

      <AnimatedSplashOverlay />
    </AuthProvider>
    </ThemeProvider>
  );
}