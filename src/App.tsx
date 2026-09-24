import "./App.css";
import { RouterProvider } from "react-router-dom";
import routes from "./router";
import { ThemeInitializer } from "./common/components/Theme";
import { SnackbarProvider } from "notistack";
import { HelmetProvider } from 'react-helmet-async';

function App() {
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
