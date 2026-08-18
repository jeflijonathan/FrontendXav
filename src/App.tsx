import "./App.css";
import { RouterProvider } from "react-router-dom";
import routes from "./router";
import { ThemeInitializer } from "./common/components/Theme";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <ThemeInitializer>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <RouterProvider router={routes} />
      </SnackbarProvider>
    </ThemeInitializer>
  );
}

export default App;
