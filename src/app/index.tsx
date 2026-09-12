import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
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

      <Button
        title="LOGIN"
        onPress={handleLogin}
      />
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
});