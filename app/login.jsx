import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function Login() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const API_URL = "https://codbarber-api.onrender.com/login.php";

  const iniciarSesion = async () => {
    console.log("=== Intentando iniciar sesión... ===");

    if (!correo || !contrasena) {
      Alert.alert("Error", "Ingresa correo y contraseña.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: correo,
          contrasena: contrasena,
        }),
      });

      const data = await response.json();

      // 🔥 LOG 1 — ver EXACTAMENTE qué envía tu backend
      console.log("=== RESPUESTA DE API ===", data);

      if (!data.success) {
        Alert.alert("Error", data.message);
        return;
      }

      const cliente = data.cliente;

      if (!cliente?.id_cliente) {
        Alert.alert("Error", "El servidor no envió el ID del usuario.");
        return;
      }

      console.log("Guardando sesión...", cliente);

      // 🔥 GUARDAR SESIÓN DEL USUARIO
      await AsyncStorage.setItem("id_cliente", cliente.id_cliente.toString());
      await AsyncStorage.setItem("nombre", cliente.nombre);
      await AsyncStorage.setItem("correo", cliente.correo);

      // 🔥 LOG 2 — confirmar que AsyncStorage realmente guardó la sesión
      const prueba = await AsyncStorage.getItem("id_cliente");
      console.log("ID GUARDADO EN ASYNC:", prueba);

      // Redirigir al perfil
      router.replace("/perfil");

    } catch (error) {
      console.log("=== ERROR LOGIN ===", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CodBarber</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setCorreo}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        placeholderTextColor="#999"
        onChangeText={setContrasena}
      />

      <TouchableOpacity style={styles.button} onPress={iniciarSesion}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#04121F",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 38,
    color: "#1E90FF",
    textAlign: "center",
    marginBottom: 40,
    fontWeight: "700",
  },
  input: {
    backgroundColor: "#0F0F0F",
    borderWidth: 1,
    borderColor: "#1E90FF",
    borderRadius: 10,
    padding: 15,
    color: "white",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  registerText: {
    color: "#1E90FF",
    marginTop: 20,
    textAlign: "center",
    fontWeight: "600",
  },
});
