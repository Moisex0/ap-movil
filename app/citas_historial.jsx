import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function CitasHistorial() {
  const router = useRouter();

  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarCitas = async () => {
    try {
      // ID del cliente guardado en AsyncStorage
      const id_cliente = await AsyncStorage.getItem("id_cliente");

      if (!id_cliente) {
        Alert.alert("Error", "No se encontró la sesión del usuario.");
        router.replace("/login");
        return;
      }

      // Convertir a número para seguridad
      const API_URL = `https://codbarber-api.onrender.com/mis_citas.php?id_cliente=${Number(
        id_cliente
      )}`;

      const res = await fetch(API_URL);
      const data = await res.json();

      if (data.success) {
        setCitas(data.citas);
      } else {
        console.log("Error API:", data.message);
      }
    } catch (error) {
      console.log("ERROR AL CARGAR CITAS:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={{ color: "white", marginTop: 10 }}>
          Cargando citas...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Citas</Text>

      {citas.length === 0 ? (
        <Text style={styles.noCitas}>No tienes citas registradas 🙂</Text>
      ) : (
        <FlatList
          data={citas}
          keyExtractor={(item) => item.id_cita.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.servicio}</Text>

              <Text style={styles.cardText}>
                📅 {item.fecha}    🕒 {item.hora}
              </Text>

              <Text style={styles.cardText}>💵 Precio: ${item.precio}</Text>

              <Text
                style={[
                  styles.estado,
                  item.estado === "pendiente"
                    ? styles.estadoPendiente
                    : styles.estadoCompletada,
                ]}
              >
                {item.estado.toUpperCase()}
              </Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  router.push(
                    `/cita_detalle` +
                      `?barberia=${encodeURIComponent(item.barberia)}` +
                      `&servicio=${encodeURIComponent(item.servicio)}` +
                      `&barbero=${encodeURIComponent(item.barbero)}` +
                      `&fecha=${item.fecha}` +
                      `&hora=${item.hora}` +
                      `&precio=${item.precio}` +
                      `&id_servicio=${item.id_servicio}` +
                      `&id_barbero=${item.id_barbero}`
                  )
                }
              >
                <Text style={styles.buttonText}>Ver detalle</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Regresar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#04121F",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#04121F",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    color: "#1E90FF",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 25,
  },
  noCitas: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    marginTop: 30,
    opacity: 0.8,
  },
  card: {
    backgroundColor: "#0F0F0F",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1E90FF55",
  },
  cardTitle: {
    fontSize: 20,
    color: "#1E90FF",
    fontWeight: "700",
    marginBottom: 10,
  },
  cardText: {
    color: "white",
    marginBottom: 5,
    fontSize: 15,
  },
  estado: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "700",
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    borderRadius: 8,
  },
  estadoPendiente: {
    backgroundColor: "#D6A63C",
    color: "#000",
  },
  estadoCompletada: {
    backgroundColor: "#36C26B",
    color: "#000",
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  backButton: {
    marginTop: 10,
    padding: 15,
  },
  backText: {
    textAlign: "center",
    color: "#D63C3C",
    fontSize: 16,
    fontWeight: "600",
  },
});
