import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AgendarCita() {
  const { id_barberia, id_servicio } = useLocalSearchParams();

  const [barbero, setBarbero] = useState("");
  const [barberos, setBarberos] = useState([]);

  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState(new Date());

  const [mostrarFecha, setMostrarFecha] = useState(false);
  const [mostrarHora, setMostrarHora] = useState(false);

  const [loading, setLoading] = useState(true);

  const API_BARBEROS = `https://codbarber-api.onrender.com/barberos.php?id_barberia=${id_barberia}`;
  const API_AGENDAR = `https://codbarber-api.onrender.com/agendar.php`;

  const cargarBarberos = async () => {
    try {
      const response = await fetch(API_BARBEROS);
      const data = await response.json();

      if (!data.success) {
        Alert.alert("Error", "No se pudieron cargar los barberos.");
        return;
      }

      setBarberos(data.barberos);
    } catch (error) {
      console.log("ERROR BARBEROS:", error);
      Alert.alert("Error", "No se pudo conectar al servidor.");
    }

    setLoading(false);
  };

  useEffect(() => {
    cargarBarberos();
  }, []);

  const agendar = async () => {
    if (!barbero) {
      Alert.alert("Error", "Selecciona un barbero.");
      return;
    }

    // Obtener id_cliente REAL desde AsyncStorage
    const id_cliente = await AsyncStorage.getItem("id_cliente");

    if (!id_cliente) {
      Alert.alert("Error", "No se encontró la sesión del usuario.");
      router.replace("/login");
      return;
    }

    const f = fecha.toISOString().split("T")[0];
    const h = hora.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    // Construir el body REAL
    const body = {
      id_cliente: Number(id_cliente),
      id_barbero: Number(barbero),
      id_servicio: Number(id_servicio),
      fecha: f,
      hora: h,
    };

    console.log("BODY ENVIADO:", body);

    try {
      const response = await fetch(API_AGENDAR, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      console.log("RESPUESTA API:", data);

      if (!data.success) {
        Alert.alert("Error", data.message);
        return;
      }

      Alert.alert("Cita creada", "Tu cita fue registrada correctamente :)", [
        { text: "OK", onPress: () => router.push("/perfil") },
      ]);
    } catch (error) {
      console.log("ERROR AGENDAR:", error);
      Alert.alert("Error", "No se pudo conectar al servidor.");
    }
  };

  if (loading) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={{ color: "white", marginTop: 10 }}>
          Cargando barberos...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendar Cita</Text>

      {/* Barbero */}
      <Text style={styles.label}>Selecciona un barbero</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={barbero}
          dropdownIconColor="white"
          style={styles.picker}
          onValueChange={(v) => setBarbero(v)}
        >
          <Picker.Item label="-- Seleccionar --" value="" />
          {barberos.map((br) => (
            <Picker.Item
              key={br.id_barbero}
              label={br.nombre}
              value={br.id_barbero}
            />
          ))}
        </Picker>
      </View>

      {/* Fecha */}
      <Text style={styles.label}>Fecha</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setMostrarFecha(true)}
      >
        <Text style={styles.dateText}>{fecha.toISOString().split("T")[0]}</Text>
      </TouchableOpacity>

      {mostrarFecha && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display="spinner"
          onChange={(e, selected) => {
            setMostrarFecha(false);
            if (selected) setFecha(selected);
          }}
        />
      )}

      {/* Hora */}
      <Text style={styles.label}>Hora</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setMostrarHora(true)}
      >
        <Text style={styles.dateText}>
          {hora.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </TouchableOpacity>

      {mostrarHora && (
        <DateTimePicker
          value={hora}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={(e, selected) => {
            setMostrarHora(false);
            if (selected) setHora(selected);
          }}
        />
      )}

      {/* Botón agendar */}
      <TouchableOpacity style={styles.button} onPress={agendar}>
        <Text style={styles.buttonText}>Confirmar cita</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#04121F",
    paddingHorizontal: 25,
    paddingTop: 40,
  },
  cargando: {
    flex: 1,
    backgroundColor: "#04121F",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    textAlign: "center",
    color: "#1E90FF",
    marginBottom: 25,
    fontWeight: "700",
  },
  label: {
    color: "#1E90FF",
    marginBottom: 5,
    marginTop: 15,
    fontWeight: "600",
  },
  pickerBox: {
    backgroundColor: "#0F0F0F",
    borderColor: "#1E90FF",
    borderWidth: 1,
    borderRadius: 10,
  },
  picker: {
    color: "white",
  },
  dateButton: {
    backgroundColor: "#0F0F0F",
    borderColor: "#1E90FF",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginTop: 5,
  },
  dateText: {
    color: "white",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
});
