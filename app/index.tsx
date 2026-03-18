import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <View style={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { textAlign: "center" }]}>Gomotchi</Text>
          <Button title="Besle" onPress={() => alert("Gomotchi beslendi!")} />
          <Button title="Oyna" onPress={() => alert("Gomotchi oynandı!")} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  cardBody: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
});
