import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const ThemeModeContext = createContext();

const themeConfigs = {
  light: {
    palette: {
      mode: "light",
      background: { default: "#f9f9f9", paper: "#fff" },
      text: { primary: "#333" }
    }
  },
  dark: {
    palette: {
      mode: "dark",
      background: { default: "#333", paper: "#222" },
      text: { primary: "#f9f9f9" }
    }
  },
  amoled: {
    palette: {
      mode: "dark",
      background: { default: "#000", paper: "#111" },
      text: { primary: "#fff" }
    }
  }
};

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

export function CustomThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem("themeMode") || "dark");

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
    document.body.style.backgroundColor = themeConfigs[mode].palette.background.default;
    document.body.style.color = themeConfigs[mode].palette.text.primary;
  }, [mode]);

  const muiTheme = useMemo(() => createTheme(themeConfigs[mode]), [mode]);

  const nextMode = () =>
    setMode((prev) => (prev === "light" ? "dark" : prev === "dark" ? "amoled" : "light"));

  const value = useMemo(
    () => ({
      mode,
      setMode,
      nextMode,
    }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
}