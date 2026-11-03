import { useQueryState } from "nuqs";

import GamePage from "./pages/Game";
import HomePage from "./pages/Home";
import NotesPage from "./pages/Notes";
import StudyPage from "./pages/Study";

export default function App() {
  const [page] = useQueryState("page");

  switch (page) {
    case "game":
      return <GamePage />;
    case "study":
      return <StudyPage />;
    case "notes":
      return <NotesPage />;
    default:
      return <HomePage />;
  }
}
