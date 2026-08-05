import { defineConfig } from "eslint/config";
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

export default defineConfig([
  {
    ignores: [".next/**", "next-env.d.ts"],
  },
  ...coreWebVitals,
  ...typescript,
]);
