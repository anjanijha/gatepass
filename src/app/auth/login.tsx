import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from '../../auth/auth-context';


export default function LoginScreen() {
  const { login } = useAuth();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
const handleLogin = async () => {
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    Alert.alert(
      'Invalid Number',
      'Please enter a valid Indian mobile number.'
    );
    return;
  }

  if (!password) {
    Alert.alert(
      'Password Required',
      'Please enter your password.'
    );
    return;
  }

  try {
    setLoading(true);

    const user = await login(
      mobile,
      password
    );

    console.log('Authenticated user:', user);

    router.replace('/resident');

  } catch (error: any) {
    console.error(
      'Login error:',
      error
    );

    if (error.response?.status === 401) {
      Alert.alert(
        'Login Failed',
        'Invalid mobile number or password.'
      );
    } else if (error.response?.status === 403) {
      Alert.alert(
        'Account Disabled',
        'Your account is inactive.'
      );
    } else {
      Alert.alert(
        'Connection Error',
        'Unable to connect to the server.'
      );
    }
  } finally {
    setLoading(false);
  }
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
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter password"
        placeholderTextColor="#777777"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      <Pressable
        style={[
          styles.button,
          loading && styles.buttonDisabled,
        ]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Logging in..." : "Login"}
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
    marginBottom: 16,
  },

  button: {
    height: 52,
    backgroundColor: "#1976D2",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
});