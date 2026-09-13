import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useAuth } from "../../auth/auth-context";

import {
    checkInVisitor,
    checkOutVisitor,
    getSecurityVisitors,
    Visitor,
} from "../../api/visitor-service";

export default function SecurityDashboard() {
  const { user, loading, logout } = useAuth();

  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loadingVisitors, setLoadingVisitors] = useState(true);
  const [processingVisitorId, setProcessingVisitorId] =
    useState<number | null>(null);

  const loadVisitors = useCallback(async () => {
    try {
      setLoadingVisitors(true);

      const result = await getSecurityVisitors();

      setVisitors(result);
    } catch (error: any) {
      console.error(
        "Failed to load visitors:",
        error?.response?.data || error
      );

      Alert.alert(
        "Error",
        "Unable to load visitor requests."
      );
    } finally {
      setLoadingVisitors(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "SECURITY") {
      loadVisitors();
    }
  }, [user, loadVisitors]);

  async function handleLogout() {
    try {
      await logout();

      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);

      Alert.alert(
        "Logout Failed",
        "Unable to logout. Please try again."
      );
    }
  }

  async function handleCheckIn(
    visitorId: number
  ) {
    try {
      setProcessingVisitorId(visitorId);

      await checkInVisitor(visitorId);

      await loadVisitors();

      Alert.alert(
        "Success",
        "Visitor checked in successfully."
      );
    } catch (error: any) {
      console.error(
        "Check-in failed:",
        error?.response?.data || error
      );

      const message =
        error?.response?.data?.detail ||
        "Unable to check in visitor.";

      Alert.alert("Check-In Failed", message);
    } finally {
      setProcessingVisitorId(null);
    }
  }

  async function handleCheckOut(
    visitorId: number
  ) {
    try {
      setProcessingVisitorId(visitorId);

      await checkOutVisitor(visitorId);

      await loadVisitors();

      Alert.alert(
        "Success",
        "Visitor checked out successfully."
      );
    } catch (error: any) {
      console.error(
        "Check-out failed:",
        error?.response?.data || error
      );

      const message =
        error?.response?.data?.detail ||
        "Unable to check out visitor.";

      Alert.alert("Check-Out Failed", message);
    } finally {
      setProcessingVisitorId(null);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading...
        </Text>
      </View>
    );
  }

  if (!user || user.role !== "SECURITY") {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Unauthorized access
        </Text>
      </View>
    );
  }

  function renderVisitor({
    item,
  }: {
    item: Visitor;
  }) {
    const isProcessing =
      processingVisitorId === item.id;

    return (
      <View style={styles.visitorCard}>
        <Text style={styles.visitorName}>
          {item.visitor_name}
        </Text>

        <Text style={styles.info}>
          Mobile: {item.visitor_mobile}
        </Text>

        <Text style={styles.info}>
          Flat: {item.flat_number}
        </Text>

        <Text style={styles.info}>
          Purpose: {item.purpose}
        </Text>

        <Text
          style={[
            styles.status,
            item.status === "PENDING"
              ? styles.pending
              : item.status === "APPROVED"
              ? styles.approved
              : item.status === "CHECKED_IN"
              ? styles.checkedIn
              : item.status === "CHECKED_OUT"
              ? styles.checkedOut
              : styles.declined,
          ]}
        >
          {item.status}
        </Text>

        {item.status === "APPROVED" && (
          <Pressable
            style={styles.checkInButton}
            disabled={isProcessing}
            onPress={() =>
              handleCheckIn(item.id)
            }
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                CHECK IN
              </Text>
            )}
          </Pressable>
        )}

        {item.status === "CHECKED_IN" && (
          <Pressable
            style={styles.checkOutButton}
            disabled={isProcessing}
            onPress={() =>
              handleCheckOut(item.id)
            }
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                CHECK OUT
              </Text>
            )}
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Society Gate
          </Text>

          <Text style={styles.subtitle}>
            Security Dashboard
          </Text>
        </View>

        <Pressable
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>
            Logout
          </Text>
        </Pressable>
      </View>

      <View style={styles.welcomeCard}>
        <Text style={styles.welcome}>
          Welcome, {user.name} 👋
        </Text>

        <Text style={styles.info}>
          Mobile: {user.mobile}
        </Text>

        <Text style={styles.info}>
          Role: {user.role}
        </Text>
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() =>
          router.push("/security/create-visitor")
        }
      >
        <Text style={styles.buttonText}>
          + Create Visitor Request
        </Text>
      </Pressable>

      <Text style={styles.sectionTitle}>
        Visitor Requests
      </Text>

      {loadingVisitors ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />

          <Text style={styles.loadingText}>
            Loading visitor requests...
          </Text>
        </View>
      ) : visitors.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>
            No Visitor Requests
          </Text>

          <Text style={styles.emptyText}>
            There are currently no visitor
            requests.
          </Text>
        </View>
      ) : (
        <FlatList
          data={visitors}
          keyExtractor={(item) =>
            item.id.toString()
          }
          renderItem={renderVisitor}
          contentContainerStyle={
            styles.listContent
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
    paddingTop: 55,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#555555",
  },

  errorText: {
    fontSize: 18,
    color: "#D93025",
    fontWeight: "600",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111111",
  },

  subtitle: {
    fontSize: 17,
    color: "#666666",
    marginTop: 4,
  },

  welcomeCard: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 16,
    elevation: 3,
    marginBottom: 18,
  },

  welcome: {
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#111111",
  },

  info: {
    fontSize: 16,
    color: "#555555",
    marginBottom: 8,
  },

  primaryButton: {
    backgroundColor: "#1976D2",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 22,
  },

  logoutButton: {
    backgroundColor: "#D93025",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },

  logoutText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111111",
    marginBottom: 12,
  },

  visitorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
  },

  visitorName: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#111111",
    marginBottom: 12,
  },

  status: {
    alignSelf: "flex-start",
    marginTop: 8,
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontWeight: "bold",
  },

  pending: {
    color: "#B26A00",
  },

  approved: {
    color: "#188038",
  },

  checkedIn: {
    color: "#1976D2",
  },

  checkedOut: {
    color: "#555555",
  },

  declined: {
    color: "#D93025",
  },

  checkInButton: {
    height: 50,
    backgroundColor: "#188038",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  checkOutButton: {
    height: 50,
    backgroundColor: "#555555",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111111",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 15,
    color: "#666666",
    textAlign: "center",
  },

  listContent: {
    paddingBottom: 40,
  },
});