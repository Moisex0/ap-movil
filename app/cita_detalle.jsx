import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CitaDetalle() {
  const { barberia, servicio, barbero, fecha, hora, precio, id_servicio, id_barbero } =
    useLocalSearchParams();

  // URL de API
  const API_URL = "https://codbarber-api.onrender.com/agendar.php";

  const confirmar = async () => {
    try {

      // 🔥 Obtener ID real del usuario logueado
      const id_cliente = await AsyncStorage.getItem("id_cliente");

      if (!id_cliente) {
        Alert.alert("Error", "No se encontró la sesión del usuario.");
        router.replace("/login");
        return;
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_cliente: id_cliente,  // 🔥 ahora sí el real
          id_barbero: id_barbero,
          id_servicio: id_servicio,
          fecha: fecha,
          hora: hora,
        }),
      });

      const data = await response.json();
      console.log("RESPUESTA AGENDAR:", data);

      if (!data.success) {
        Alert.alert("Error", data.message);
        return;
      }

      Alert.alert(
        "Cita creada",
        "Tu cita fue registrada correctamente :)",
        [{ text: "OK", onPress: () => router.push("/perfil") }]
      );

    } catch (error) {
      console.log("ERROR:", error);
      Alert.alert("Error", "No se pudo conectar al servidor :(");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle de tu Cita</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Barbería:</Text>
        <Text style={styles.value}>{barberia}</Text>

        <Text style={styles.label}>Servicio:</Text>
        <Text style={styles.value}>{servicio}</Text>

        <Text style={styles.label}>Barbero:</Text>
        <Text style={styles.value}>{barbero}</Text>

        <Text style={styles.label}>Fecha:</Text>
        <Text style={styles.value}>{fecha}</Text>

        <Text style={styles.label}>Hora:</Text>
        <Text style={styles.value}>{hora}</Text>

        <Text style={styles.label}>Precio:</Text>
        <Text style={styles.price}>${precio}</Text>
      </View>

      <TouchableOpacity style={styles.buttonPrimary} onPress={confirmar}>
        <Text style={styles.buttonText}>Confirmar Cita</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonCancel} onPress={() => router.back()}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#04121F",
    padding: 25,
  },
  title: {
    fontSize: 28,
    color: "#1E90FF",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#0F0F0F",
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#1E90FF55",
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: "#1E90FF",
    fontWeight: "600",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "white",
    marginTop: 3,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#36C26B",
    marginTop: 5,
  },
  buttonPrimary: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  buttonCancel: {
    marginTop: 20,
    padding: 15,
  },
  cancelText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#D63C3C",
  },
});
