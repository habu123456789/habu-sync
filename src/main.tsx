import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="liquid" enableSystem={false} themes={["light", "dark", "sunrise", "ocean", "bhagwa", "krishna", "forest", "lotus", "liquid", "liquid-dark"]}>
    <App />
  </ThemeProvider>
);
