import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    createVisitor,
    Flat,
    getFlatsForVisitor,
} from "../../api/visitor-service";
import { useAuth } from "../../auth/auth-context";

export default function CreateVisitorScreen() {
  const { user, loading } = useAuth();

  const [visitorName, setVisitorName] = useState("");
  const [visitorMobile, setVisitorMobile] = useState("");
  const [purpose, setPurpose] = useState("");

  const [flats, setFlats] = useState<Flat[]>([]);
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null);

  const [loadingFlats, setLoadingFlats] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showFlatSelector, setShowFlatSelector] = useState(false);

  useEffect(() => {
    if (user?.role === "SECURITY") {
      loadFlats();
    }
  }, [user]);

  async function loadFlats() {
    try {
      setLoadingFlats(true);

      const result = await getFlatsForVisitor();

      setFlats(result);
    } catch (error: any) {
      console.error(
        "Failed to load flats:",
        error?.response?.data || error
      );

      Alert.alert(
        "Error",
        "Unable to load flats."
      );
    } finally {
      setLoadingFlats(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
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

  async function handleSubmit() {
    if (!visitorName.trim()) {
      Alert.alert("Validation", "Enter visitor name.");
      return;
    }

    if (!visitorMobile.trim()) {
      Alert.alert("Validation", "Enter visitor mobile.");
      return;
    }

    if (!purpose.trim()) {
      Alert.alert("Validation", "Enter purpose.");
      return;
    }

    if (!selectedFlat) {
      Alert.alert(
        "Validation",
        "Please select a flat."
      );
      return;
    }

    try {
      setSubmitting(true);

      await createVisitor({
        visitor_name: visitorName.trim(),
        visitor_mobile: visitorMobile.trim(),
        purpose: purpose.trim(),
        flat_id: selectedFlat.id,
      });

      Alert.alert(
        "Success",
        "Visitor request created successfully.",
        [
          {
            text: "OK",
            onPress: () =>
              router.replace("/security"),
          },
        ]
      );
    } catch (error: any) {
      console.error(
        "Create visitor failed:",
        error?.response?.data || error
      );

      const message =
        error?.response?.data?.detail ||
        "Unable to create visitor request.";

      Alert.alert("Error", message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>
        Create Visitor Request
      </Text>

      <Text style={styles.subtitle}>
        Enter visitor details
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Visitor Name"
        placeholderTextColor="#777777"
        value={visitorName}
        onChangeText={setVisitorName}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Visitor Mobile"
        placeholderTextColor="#777777"
        value={visitorMobile}
        onChangeText={setVisitorMobile}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Purpose"
        placeholderTextColor="#777777"
        value={purpose}
        onChangeText={setPurpose}
        autoCapitalize="sentences"
      />

      {/* Flat Selector */}
      <Pressable
        style={styles.selector}
        onPress={() => {
          if (!loadingFlats && flats.length > 0) {
            setShowFlatSelector(true);
          }
        }}
      >
        <View>
          <Text
            style={
              selectedFlat
                ? styles.selectedFlatText
                : styles.placeholderText
            }
          >
            {selectedFlat
              ? selectedFlat.flat_number
              : loadingFlats
              ? "Loading flats..."
              : "Select Flat"}
          </Text>

          {selectedFlat && (
            <Text style={styles.residentText}>
              Resident ID: {selectedFlat.resident_id}
            </Text>
          )}
        </View>

        {loadingFlats ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text style={styles.arrow}>
            ▼
          </Text>
        )}
      </Pressable>

      {flats.length === 0 && !loadingFlats && (
        <Text style={styles.noFlatsText}>
          No flats available.
        </Text>
      )}

      <Pressable
        style={[
          styles.submitButton,
          submitting && styles.disabledButton,
        ]}
        disabled={submitting}
        onPress={handleSubmit}
      >
        {submitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>
            Create Request
          </Text>
        )}
      </Pressable>

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
        disabled={submitting}
      >
        <Text style={styles.backText}>
          Back
        </Text>
      </Pressable>

      {/* Flat Selection Modal */}
      <Modal
        visible={showFlatSelector}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setShowFlatSelector(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Select Flat
            </Text>

            <ScrollView>
              {flats.map((flat) => (
                <Pressable
                  key={flat.id}
                  style={styles.flatOption}
                  onPress={() => {
                    setSelectedFlat(flat);
                    setShowFlatSelector(false);
                  }}
                >
                  <Text style={styles.flatNumber}>
                    {flat.flat_number}
                  </Text>

                  <Text style={styles.flatResident}>
                    Resident ID: {flat.resident_id}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <Pressable
              style={styles.closeButton}
              onPress={() =>
                setShowFlatSelector(false)
              }
            >
              <Text style={styles.closeButtonText}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111111",
  },

  subtitle: {
    fontSize: 16,
    color: "#555555",
    marginTop: 6,
    marginBottom: 28,
  },

  input: {
    height: 64,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 18,
    fontSize: 17,
    color: "#111111",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#D8D8D8",
  },

  selector: {
    minHeight: 64,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  placeholderText: {
    color: "#777777",
    fontSize: 17,
  },

  selectedFlatText: {
    color: "#111111",
    fontSize: 17,
    fontWeight: "600",
  },

  residentText: {
    color: "#777777",
    fontSize: 13,
    marginTop: 3,
  },

  arrow: {
    color: "#555555",
    fontSize: 16,
  },

  noFlatsText: {
    color: "#D32F2F",
    marginTop: -5,
    marginBottom: 10,
  },

  submitButton: {
    height: 58,
    backgroundColor: "#1976D2",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  disabledButton: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },

  backButton: {
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  backText: {
    color: "#1976D2",
    fontSize: 17,
    fontWeight: "600",
  },

  errorText: {
    fontSize: 18,
    color: "#D32F2F",
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: "75%",
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111111",
    marginBottom: 18,
  },

  flatOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  flatNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111111",
  },

  flatResident: {
    fontSize: 14,
    color: "#777777",
    marginTop: 4,
  },

  closeButton: {
    height: 50,
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: "#EEEEEE",
    justifyContent: "center",
    alignItems: "center",
  },

  closeButtonText: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "600",
  },
});