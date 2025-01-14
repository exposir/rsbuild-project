import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  performance: {
    buildCache: true,
  },
  output: {
    filename: {
      js: "[name].[contenthash:8].js",
      css: "[name].[contenthash:8].css",
    },
    cleanDistPath: false,
  },
});
