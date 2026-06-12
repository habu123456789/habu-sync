import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="liquid" enableSystem={false} themes={["light", "dark", "sunrise", "ocean", "bhagwa", "krishna", "forest", "lotus", "liquid", "liquid-dark"]}>
      <App />
    </ThemeProvider>
  </HelmetProvider>
);
