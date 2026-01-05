import "./App.css";
import { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import Dashboard from "./pages/Dashboard/Dashboard";
import Homepage from "./pages/HomePage/Homepage";
import Puzzles from "./pages/Puzzles/Puzzles";
import Social from "./pages/Social/Social";
import CreatePuzzle from "./pages/CreatePuzzle/CreatePuzzle";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import { useAuthStore } from "./store/auth-store";
import Vision from "./pages/Vision/Vision";
import Leaderboards from "./pages/Leaderboards/Leaderboards";
import Profile from "./pages/Profile/Profile";
import SetProfile from "./pages/SetProfile/SetProfile";
import Settings from "./pages/Settings/Settings";
import ChangeUsername from "./pages/ChangeUsername/ChangeUsername";
function App() {

  const {authenticateUser, isAdmin, isAuthenticated} = useAuthStore()

  useEffect(() => {
    authenticateUser()
  }, [])


  const routerAuthenticated = createBrowserRouter([
    {
      path: "/",
      element: <Dashboard isAdmin={false} isAuthenticated={isAuthenticated}/>,
      children: [
        {
          path: "",
          element: <Homepage />,
        },
        {
          path: "leaderboards",
          element: <Leaderboards/>
        },
        {
          path: "puzzles",
          element: <Puzzles/>
        },
        {
          path: "social",
          element: <Social/>
        },
        {
          path: "vision",
          element: <>vision</>
        },
        {
          path: "settings",
          element: <Settings/>
        },
        {
          path: "profile",
          element: <Profile/>
        },
        {
          path: "create",
          element: <CreatePuzzle/>
        },
      ],
      
    },
    {
      path: "/login",
      element: <Navigate to="/" replace />
    },
    {
      path: "/signup",
      element: <Navigate to="/" replace />
    },
    {
      path:"/forgot",
      element: <Navigate to="/" replace />
    },
    {
      path: "/change-username",
      element: <ChangeUsername/>
    },
    {
      path:"*",
      element: <>Random 404</>
    }
  ]);

  const routerGuest = createBrowserRouter([
    {
      path: "/",
      element: <Dashboard isAdmin={false} isAuthenticated={false}/>,
      children: [
        {
          path: "",
          element: <Homepage />,
        },
        {
          path: "leaderboards",
          element: <Leaderboards/>
        },
        {
          path: "puzzles",
          element: <Puzzles/>
        },
        {
          path: "vision",
          element: <>vision</>
        },
      ],
      
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/signup",
      element: <SignUp />
    },
    {
      path:"/forgot",
      element: <ForgotPassword/>
    },
    {
      path:"*",
      element: <>Random 404</>
    }
  ]);

  const routerAdmin = createBrowserRouter([
    {
      path: "/",
      element: <Dashboard isAdmin={true} isAuthenticated={true}/>,
      children: [
        {
          path: "",
          element: <Homepage />,
        },
        {
          path: "leaderboards",
          element: <Leaderboards/>
        },
        {
          path: "puzzles",
          element: <Puzzles/>
        },
        {
          path: "social",
          element: <Social/>
        },
        {
          path: "vision",
          element: <Vision/>
        },
        {
          path: "settings",
          element: <Settings/>
        },
        {
          path: "profile",
          element: <SetProfile/>
        },
        {
          path: "create",
          element: <CreatePuzzle/>
        },
      ],
      
    },
    {
      path: "/login",
      element: <Navigate to="/" replace />
    },
    {
      path: "/signup",
      element: <Navigate to="/" replace />
    },
    {
      path:"/forgot",
      element: <Navigate to="/" replace />
    },
    {
      path: "/change-username",
      element: <ChangeUsername/>
    },
    {
      path:"*",
      element: <>Random 404</>
    }
  ]);

  return (
    <>
      <RouterProvider router={isAdmin && isAuthenticated ? routerAdmin : isAuthenticated ? routerAuthenticated : routerGuest}/>
    </>
  );
}

export default App;