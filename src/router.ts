import { createBrowserRouter } from "react-router";
import HomePage from "./pages/Home";
import GamePage from "./pages/Game";

export default createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/game",
    Component: GamePage,
  },
]);
