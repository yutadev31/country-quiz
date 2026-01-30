import { useSearchParams } from "react-router";
import HomePage from "./pages/Home";
import GamePage from "./pages/Game";

export default function App() {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");

  if (page === "game") {
    return <GamePage />;
  } else {
    return <HomePage />;
  }
}
