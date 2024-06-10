import { AuthProvider } from "./context/authContext";
import { UserProvider } from "./context/userContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Home,
  NotFound,
  Signup,
  Login,
  Signout,
  CreatePost,
  Post,
  User,
} from "./pages";
import { useEffect } from "react";
import { io } from "socket.io-client";

// Creating Tanstack query client
const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    const socket = io("http://localhost:4000");

    // Maintain connection to render server so it doesn't die.
    const interval = setInterval(() => {
      socket.emit("toMaintainConnection");
    }, 5000);

    // Clear the loop
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Providing client to children */}
      <QueryClientProvider client={queryClient}>
        {/* Providing auth context to children */}
        <AuthProvider>
          {/* Providing Db user data to children */}
          <UserProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signout" element={<Signout />} />
                <Route path="/addPost" element={<CreatePost />} />
                <Route path="/post/:postId" element={<Post />} />
                <Route path="/user/:username" element={<User />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </UserProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
