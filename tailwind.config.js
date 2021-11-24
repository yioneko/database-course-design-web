module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "var(--ant-primary-color)",
        success: "var(--ant-success-color)",
        error: "var(--ant-error-color)",
        warning: "var(--ant-warning-color)",
        info: "var(--ant-info-color)",
      },
    },
  },
  variants: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
