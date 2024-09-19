import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen.jsx";
import SkillSelection from "./pages/SkillSelection.jsx";
import QuizPage from "./pages/QuizPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeScreen />,
  },
  {
    path: "/skills",
    element: <SkillSelection />,
  },
  {
    path: "/quiz/:skill",
    element: <QuizPage />,
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
