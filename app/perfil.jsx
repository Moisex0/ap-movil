import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        // Obtener ID del usuario logueado
        const id_cliente = await AsyncStorage.getItem("id_cliente");

        if (!id_cliente) {
          Alert.alert("Error", "No se encontró la sesión del usuario.");
          router.replace("/login");
          return;
        }

        // URL correcta usando Number()
        const API_URL = `https://codbarber-api.onrender.com/mis_datos.php?id_cliente=${Number(
          id_cliente
        )}`;

        const response = await fetch(API_URL, {
          headers: { Accept: "application/json" },
        });

        let data;

        try {
          data = await response.json();
        } catch (jsonErr) {
          console.log("ERROR PARSE JSON PERFIL:", jsonErr);
          Alert.alert("Error", "Respuesta inválida del servidor.");
          return;
        }

        console.log("DATOS PERFIL:", data);

        if (!data.success || !data.usuario) {
          Alert.alert("Error", "No se pudieron cargar los datos del perfil.");
          return;
        }

        setUsuario(data.usuario);
      } catch (error) {
        console.log("ERROR PERFIL:", error);
        Alert.alert("Error", "No se pudo conectar al servidor.");
      }
    };

    cargarUsuario();
  }, []);

  if (!usuario) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "white", textAlign: "center" }}>
          Cargando perfil...
        </Text>
      </View>
    );
  }

  const cerrarSesion = async () => {
    await AsyncStorage.clear();
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre</Text>
        <Text style={styles.value}>{usuario.nombre}</Text>

        <Text style={styles.label}>Correo</Text>
        <Text style={styles.value}>{usuario.correo}</Text>

        <Text style={styles.label}>Teléfono</Text>
        <Text style={styles.value}>{usuario.telefono}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/citas_historial")}
      >
        <Text style={styles.buttonText}>Ver mis citas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/barberias")}
      >
        <Text style={styles.buttonText}>Agendar cita</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#04121F",
    padding: 25,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1E90FF",
    textAlign: "center",
    marginTop: 25,
    marginBottom: 35,
  },
  card: {
    backgroundColor: "#0F0F0F",
    padding: 25,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#1E90FF55",
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    color: "#1E90FF",
    fontWeight: "600",
    marginTop: 15,
  },
  value: {
    fontSize: 17,
    color: "white",
    marginTop: 3,
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  logoutButton: {
    marginTop: 25,
    padding: 15,
  },
  logoutText: {
    textAlign: "center",
    color: "#D63C3C",
    fontSize: 17,
    fontWeight: "600",
  },
});
