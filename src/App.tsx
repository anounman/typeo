import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import AppLayout from "./layout/app-layout";
import { ThemeProvider } from "./components/theme-provider";
import HomePage from "./pages/home-page";
import ResultPage from "./pages/result-page";
import { InputProvider } from "./components/input-provider";

function App() {
  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/result",
          element: <ResultPage />,
        },
      ],
    },
  ]);

  return (
    <ThemeProvider defaultTheme="dark">
      <InputProvider>
        <RouterProvider router={router} />
      </InputProvider>
    </ThemeProvider>
  );
}

export default App;
