import typography from "@tailwindcss/typography";
import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  plugins: [typography, daisyui],
  daisyui: {
    themes: ["bumblebee"],
  },
};
