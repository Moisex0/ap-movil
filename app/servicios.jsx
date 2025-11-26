import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Servicios() {
  // Tomo el id_barberia que viene en la URL :)
  const { id } = useLocalSearchParams();

  // Aquí guardaré los servicios reales que vengan desde la API :)
  const [servicios, setServicios] = useState([]);

  // Para mostrar un loader mientras se carga :)
  const [loading, setLoading] = useState(true);

  // URL de API actualizada (usando tu IP correcta)
  const API_URL = `https://codbarber-api.onrender.com/servicios.php?id_barberia=${id}`;

  // Función para traer servicios de la API :)
  const cargarServicios = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!data.success) {
        Alert.alert("Error", "No se pudieron cargar los servicios.");
        return;
      }

      setServicios(data.servicios);

    } catch (error) {
      console.log("ERROR SERVICIOS:", error);
      Alert.alert("Error", "No se pudo conectar al servidor.");
    }

    setLoading(false);
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={{ color: "white", marginTop: 10 }}>Cargando servicios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Servicios</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {servicios.map((servicio) => (
          <View key={servicio.id_servicio} style={styles.card}>
            <Text style={styles.cardTitle}>{servicio.nombre}</Text>

            <Text style={styles.cardDesc}>
              {servicio.descripcion || "Servicio sin descripción."}
            </Text>

            <Text style={styles.cardPrice}>${servicio.precio}</Text>

            {/* Enviar el ID de servicio y barbería a agendar.jsx :) */}
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                router.push(`/agendar?id_barberia=${id}&id_servicio=${servicio.id_servicio}`)
              }
            >
              <Text style={styles.buttonText}>Seleccionar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#04121F",
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  loading: {
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
  scroll: {
    paddingBottom: 50,
  },
  card: {
    backgroundColor: "#0F0F0F",
    borderRadius: 15,
    borderColor: "#1E90FF55",
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    color: "#1E90FF",
    fontWeight: "700",
    marginBottom: 8,
  },
  cardDesc: {
    color: "#DCDCDC",
    marginBottom: 10,
  },
  cardPrice: {
    color: "#36C26B",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
});
