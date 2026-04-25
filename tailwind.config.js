/** @type {import('tailwindcss').Config} */
import { theme } from "./app/assets/theme/theme";

export default {
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/assets/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue",
    "./app/error.vue",
  ],
  theme: {
    ...theme,
    // Extend the default Tailwind theme here if needed
  },
  plugins: [],
};
