import "./App.css";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import routes from "./router";
import { ThemeInitializer } from "./common/components/Theme";
import { SnackbarProvider } from "notistack";
import { HelmetProvider } from "react-helmet-async";
import useAuthStore from "@common/store/useAuthStore";

function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <ThemeInitializer>
      <HelmetProvider>
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
          <RouterProvider router={routes} />
        </SnackbarProvider>
      </HelmetProvider>
    </ThemeInitializer>
  );
}

export default App;
