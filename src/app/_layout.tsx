import { Stack } from "expo-router";

export default function RootLayout() {
  return (
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
    </Stack>
  );
}