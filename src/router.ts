import { createBrowserRouter } from "react-router";
import HomePage from "./pages/Home";
import GamePage from "./pages/Game";

export default createBrowserRouter([
  {
    path: "/country-quiz/",
    Component: HomePage,
  },
  {
    path: "/country-quiz/game",
    Component: GamePage,
  },
]);
