import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/*/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        phone: { max: "810px" },
        desktop: { min: "810px" },
      },

      colors: {
        main: "#323031",
        text: "#FFFFFF"
      }
    },
  },
  plugins: [],
};
export default config;
