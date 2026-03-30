import { useQueryState } from "nuqs";
import GamePage from "./pages/Game";
import HomePage from "./pages/Home";

export default function App() {
  const [page] = useQueryState("page");

  if (page === "game") {
    return <GamePage />;
  } else {
    return <HomePage />;
  }
}
