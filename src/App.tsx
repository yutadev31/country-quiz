import { useQueryState } from "nuqs";
import GamePage from "./pages/Game";
import HomePage from "./pages/Home";
import NotesPage from "./pages/Notes";
import StudyPage from "./pages/Study";

export default function App() {
  const [page] = useQueryState("page");

  if (page === "game") {
    return <GamePage />;
  } else if (page === "study") {
    return <StudyPage />;
  } else if (page === "notes") {
    return <NotesPage />;
  } else {
    return <HomePage />;
  }
}
