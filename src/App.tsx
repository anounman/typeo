import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import AppLayout from "./layout/app-layout";
import { ThemeProvider } from "./components/theme-provider";
import HomePage from "./pages/home-page";
import ResultPage from "./pages/result-page";

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
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
