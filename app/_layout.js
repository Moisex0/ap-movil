import { Redirect, Stack } from "expo-router";

export default function RootLayout() {
  return (
    <>
      {/* Cuando alguien entra a "/" o "index", automáticamente lo mando al login :) */}
      <Redirect href="/login" />

      {/* Manejo de pantallas de toda la app */}
      <Stack
        screenOptions={{
          headerShown: false, // Oculto los headers porque usamos estilo CodBarber 💈
        }}
      >
        {/* Pantalla de inicio (solo redirige) */}
        <Stack.Screen name="index" />

        {/* Login y registro */}
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />

        {/* Flujo de barberías y servicios */}
        <Stack.Screen name="barberias" />
        <Stack.Screen name="servicios" />
        <Stack.Screen name="agendar" />
        <Stack.Screen name="cita_detalle" />

        {/* Perfil del usuario */}
        <Stack.Screen name="perfil" />

        {/* Historial de citas — Nueva pantalla que agregamos :) */}
        <Stack.Screen name="citas_historial" />
      </Stack>
    </>
  );
}
