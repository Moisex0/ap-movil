import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Barberias() {

  // Router para navegar entre pantallas :)
  const router = useRouter();

  // Aquí guardo las barberías que vienen desde la API :)
  const [barberias, setBarberias] = useState([]);

  // Para saber si aún está cargando :)
  const [cargando, setCargando] = useState(true);

  // URL de tu API con la IP actual (XAMPP)
  const API_URL = "https://codbarber-api.onrender.com/barberias.php";

  // Función que trae las barberías desde PHP :)
  const cargarBarberias = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!data.success) {
        Alert.alert("Error", "No se pudieron cargar las barberías :(");
        return;
      }

      setBarberias(data.barberias);
    } catch (error) {
      console.log("ERROR BARBERIAS:", error);
      Alert.alert("Error", "No se pudo conectar al servidor.");
    }

    setCargando(false);
  };

  useEffect(() => {
    cargarBarberias();
  }, []);

  if (cargando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={{ color: "white", marginTop: 10 }}>
          Cargando barberías...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Barberías Disponibles</Text>

      <FlatList
        data={barberias}
        keyExtractor={(item) => item.id_barberia.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/servicios?id=${item.id_barberia}`)}
          >
            <Image
              source={{ uri: "https://i.imgur.com/jJ2zFQX.png" }}
              style={styles.img}
            />

            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.nombre}</Text>
              <Text style={styles.cardDesc}>{item.direccion}</Text>
              <Text style={styles.cardLink}>Ver servicios →</Text>
            </View>

          </TouchableOpacity>
        )}
      />
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
  loading: {
    flex: 1,
    backgroundColor: "#04121F",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    color: "#1E90FF",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#000",
    flexDirection: "row",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#1E90FF55",
    shadowColor: "#1E90FF",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E90FF",
  },
  cardDesc: {
    color: "white",
    opacity: 0.8,
    marginBottom: 5,
  },
  cardLink: {
    color: "#1E90FF",
    fontWeight: "700",
    marginTop: 5,
  },
});
