import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function Register() {

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contrasena, setContrasena] = useState("");

  // URL de tu API en XAMPP (IP actual)
  const API_URL = "https://codbarber-api.onrender.com/register.php";

  const registrar = async () => {

    if (
      nombre.trim() === "" ||
      correo.trim() === "" ||
      contrasena.trim() === ""
    ) {
      Alert.alert("Error", "Llena todos los campos obligatorios :)");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre,
          correo: correo,
          telefono: telefono,
          contrasena: contrasena,
        }),
      });

      const data = await response.json();
      console.log("RESPUESTA REGISTER:", data);

      if (!data.success) {
        Alert.alert("Error", data.message);
        return;
      }

      Alert.alert("Listo", "Tu cuenta fue creada correctamente :)", [
        { text: "OK", onPress: () => router.push("/login") }
      ]);

    } catch (error) {
      console.log("ERROR REGISTER:", error);
      Alert.alert("Error", "No se pudo conectar al servidor :(");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        placeholderTextColor="#999"
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo"
        placeholderTextColor="#999"
        onChangeText={setCorreo}
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        placeholderTextColor="#999"
        onChangeText={setTelefono}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        placeholderTextColor="#999"
        onChangeText={setContrasena}
      />

      <TouchableOpacity style={styles.button} onPress={registrar}>
        <Text style={styles.buttonText}>Registrarme</Text>
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
    fontSize: 32,
    color: "#1E90FF",
    textAlign: "center",
    marginBottom: 30,
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
});
