import HomePage from "./pages/Home";
import GamePage from "./pages/Game";
import { useQueryState } from "nuqs";

export default function App() {
  const [page] = useQueryState("page");

  if (page === "game") {
    return <GamePage />;
  } else {
    return <HomePage />;
  }
}
