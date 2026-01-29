import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  external: ["react", "react-dom"],
  sourcemap: true,
  minify: false,
  target: "es2022",
  outDir: "dist",
  banner: {
    js: '"use client";',
  },
});
