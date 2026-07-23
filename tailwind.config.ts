import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        abyss: '#0a0a0a',
        ash: '#171717',
        blood: { 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 900: '#7f1d1d', 950: '#450a0a' },
        ember: '#f97316',
      },
      boxShadow: {
        fire: '0 0 15px rgba(239, 68, 68, 0.5), 0 0 30px rgba(239, 68, 68, 0.2)',
      }
    },
  },
  plugins: [],
};
export default config;
