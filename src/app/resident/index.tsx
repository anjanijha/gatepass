import { router } from "expo-router";
import { useEffect, useState } from "react";
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
  Flat,
  getMyFlats,
} from "../../auth/auth-service";

import {
  approveVisitor,
  declineVisitor,
  getVisitors,
  Visitor,
} from "../../api/visitor-service";

export default function ResidentDashboard() {
  const {
    user,
    loading,
    logout,
  } = useAuth();

  const [flats, setFlats] = useState<Flat[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loadingVisitors, setLoadingVisitors] = useState(true);
  const [processingVisitorId, setProcessingVisitorId] =
    useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user]);

  useEffect(() => {
    if (!loading && user) {
      loadVisitors();
    }
  }, [loading, user]);

  async function loadVisitors() {
    try {
      setLoadingVisitors(true);

      const myFlats = await getMyFlats();

      setFlats(myFlats);

      if (myFlats.length === 0) {
        setVisitors([]);
        return;
      }

      const allVisitors: Visitor[] = [];

      for (const flat of myFlats) {
        const flatVisitors = await getVisitors(flat.id);

        allVisitors.push(...flatVisitors);
      }

      setVisitors(allVisitors);
    } catch (error) {
      console.error(
        "Failed to load visitors:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to load visitor requests."
      );
    } finally {
      setLoadingVisitors(false);
    }
  }

  async function handleApprove(
    visitorId: number
  ) {
    try {
      setProcessingVisitorId(visitorId);

      await approveVisitor(visitorId);

      await loadVisitors();
    } catch (error) {
      console.error(
        "Approve visitor failed:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to approve visitor."
      );
    } finally {
      setProcessingVisitorId(null);
    }
  }

  async function handleDecline(
    visitorId: number
  ) {
    try {
      setProcessingVisitorId(visitorId);

      await declineVisitor(visitorId);

      await loadVisitors();
    } catch (error) {
      console.error(
        "Decline visitor failed:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to decline visitor."
      );
    } finally {
      setProcessingVisitorId(null);
    }
  }

  async function handleLogout() {
    try {
      await logout();

      router.replace("/auth/login");
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );

      Alert.alert(
        "Logout Failed",
        "Unable to logout. Please try again."
      );
    }
  }

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

  if (!user) {
    return null;
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
          Purpose: {item.purpose}
        </Text>

        <Text style={styles.info}>
          Flat ID: {item.flat_id}
        </Text>

        <Text
          style={[
            styles.status,
            item.status === "PENDING"
              ? styles.pending
              : item.status === "APPROVED"
              ? styles.approved
              : styles.declined,
          ]}
        >
          {item.status}
        </Text>

        {item.status === "PENDING" && (
          <View style={styles.actionRow}>

            <Pressable
              style={[
                styles.actionButton,
                styles.approveButton,
              ]}
              disabled={isProcessing}
              onPress={() =>
                handleApprove(item.id)
              }
            >
              <Text style={styles.buttonText}>
                {isProcessing
                  ? "Processing..."
                  : "Approve"}
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.actionButton,
                styles.declineButton,
              ]}
              disabled={isProcessing}
              onPress={() =>
                handleDecline(item.id)
              }
            >
              <Text style={styles.buttonText}>
                Decline
              </Text>
            </Pressable>

          </View>
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
            Resident Dashboard
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

        <Text style={styles.info}>
          Flats: {flats.length}
        </Text>

      </View>

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
            requests for your flat.
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

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
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
    fontSize: 16,
    color: "#666666",
    marginTop: 4,
  },

  welcomeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    marginBottom: 22,
    elevation: 3,
  },

  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#111111",
  },

  info: {
    fontSize: 16,
    color: "#555555",
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#111111",
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
    marginBottom: 16,
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

  declined: {
    color: "#D93025",
  },

  actionRow: {
    flexDirection: "row",
    gap: 12,
  },

  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  approveButton: {
    backgroundColor: "#188038",
  },

  declineButton: {
    backgroundColor: "#D93025",
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
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 15,
    color: "#666666",
    textAlign: "center",
  },

  listContent: {
    paddingBottom: 30,
  },

  logoutButton: {
    backgroundColor: "#1976D2",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },

  logoutText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});