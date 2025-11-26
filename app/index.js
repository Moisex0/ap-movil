import { Redirect } from "expo-router";

export default function Index() {
  // Aquí simplemente mando al login al abrir la app :)
  return <Redirect href="/login" />;
}
