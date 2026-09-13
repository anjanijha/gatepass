import { router } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuth } from "../auth/auth-context";

export default function HomeScreen() {
  const { user, loading } = useAuth();

useEffect(() => {
  if (loading) {
    return;
  }

  if (user) {
    if (user.role === "RESIDENT") {
      router.replace("/resident");
    } else if (user.role === "SECURITY") {
      router.replace("/security");
    }
  }
}, [loading, user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading...
        </Text>
      </View>
    );
  }

  if (user) {
    return null;
  }

  const handleLogin = () => {
    router.push("/auth/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Society Gate
      </Text>

      <Text style={styles.subtitle}>
        Visitor Approval System
      </Text>

      <Text
        style={styles.loginButton}
        onPress={handleLogin}
      >
        LOGIN
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  title: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subtitle: {
    color: "#333333",
    fontSize: 18,
    marginBottom: 30,
  },

  loginButton: {
    backgroundColor: "#1976D2",
    color: "white",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: "bold",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#555555",
  },
});