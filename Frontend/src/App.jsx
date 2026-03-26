import { useState } from "react";
import LoadingHomePage from "./pages/LoadingHomePage";
import JarvisChat from "./pages/ChatPage";
import { Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Home from "./pages/login";
function App() {
  return (
    <>
      <Routes>
        <Route path="/chat" element={<JarvisChat />} />
        <Route path="/" element={<Home/>} />
      </Routes>
    </>
  );
}

export default App;
