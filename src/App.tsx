import "./index.css"
import { StartPage } from "./pages/startPage";
import { GamePage } from "./pages/gamePage";
import { MenuContainer } from "./components/gameMenuModal";
import { ResultContainer } from "./components/gameResultModal";
import { createBrowserRouter, RouterProvider } from "react-router"
import { GameProvider } from "./components/gameProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <StartPage />
  },
  {
    path: "/game",
    element: <GamePage />
  },
  // for test components, not real router
  {
    path: "/test",
    element: <MenuContainer />
  },
  {
    path: "/test2",
    element: <ResultContainer />
  }
], {
  basename: import.meta.env.BASE_URL,
});

function App() {
  return (
    <>
      <GameProvider>
        <RouterProvider router={router} />
      </GameProvider>
    </>
  )
}

export default App
