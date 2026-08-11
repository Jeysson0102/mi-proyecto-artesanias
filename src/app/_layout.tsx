import { Stack } from "expo-router";
import { useEffect } from "react";
import "../global.css";
import { initDB } from "../infrastructure/database";

export default function RootLayout() {
  useEffect(() => {
    initDB().catch((err) => console.error("Error inicializando SQLite:", err));
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="index" />
      <Stack.Screen name="crear-pedido" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}