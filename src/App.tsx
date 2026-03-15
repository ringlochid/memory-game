import "./index.css"
import { StartPage } from "./pages/startPage";
import { GamePage } from "./pages/gamePage";
import { MenuContainer } from "./components/gameMenuModal";
import { ResultContainer } from "./components/gameResultModal";
import { createBrowserRouter, RouterProvider } from "react-router"

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
      <RouterProvider router={router} />
    </>
  )
}

export default App
