// Reemplaza esta URL con el enlace de tu proyecto en MockAPI
const API_URL = "https://6a7acf0c8c69b3eb4a178c5f.mockapi.io/productos";

export const obtenerProductosAPI = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al conectar con la API de productos');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en obtenerProductosAPI:", error);
    throw error;
  }
};