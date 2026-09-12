import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { useState } from "react";

export default function LoginScreen() {
  const [mobile, setMobile] = useState("");

  const handleSendOTP = () => {
    if (mobile.length !== 10) {
      Alert.alert(
        "Invalid Number",
        "Please enter a 10-digit mobile number."
      );
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      Alert.alert(
        "Invalid Number",
        "Please enter a valid Indian mobile number."
      );
      return;
    }

    Alert.alert(
      "Success",
      `OTP will be sent to ${mobile}`
    );
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Society Gate
      </Text>

      <Text style={styles.subtitle}>
        Login to continue
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter mobile number"
        placeholderTextColor="#777777"
        keyboardType="phone-pad"
        maxLength={10}
        value={mobile}
        onChangeText={setMobile}
      />

      <Pressable
        style={styles.button}
        onPress={handleSendOTP}
      >
        <Text style={styles.buttonText}>
          Send OTP
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000000",
  },

  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 40,
    color: "#555555",
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000000",
    backgroundColor: "#FFFFFF",
  },

  button: {
    height: 52,
    backgroundColor: "#1976D2",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
});