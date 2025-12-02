module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Reanimated siempre debe ir al final de la lista de plugins
      "react-native-reanimated/plugin", 
    ],
  };
};