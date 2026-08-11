const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Agregamos soporte para archivos .wasm (Necesario para expo-sqlite en Web)
config.resolver.assetExts.push('wasm');

module.exports = withNativeWind(config, { input: "./src/global.css" });