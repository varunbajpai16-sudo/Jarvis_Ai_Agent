import { useState } from "react";
import LoadingHomePage from "./pages/LoadingHomePage";
import JarvisChat from "./pages/ChatPage";
import { Routes, Route } from "react-router-dom";
import Settings from "./pages/Setting";
import JarvisAnalytics from "./pages/Analytic.page";
function App() {
  return (
    <>
      <Routes>
        <Route path="/chat" element={<JarvisChat />} />
        <Route path="/" element={<LoadingHomePage/>} />
        <Route path="/setting" element={<Settings/>} />
         <Route path="/analytic" element={<JarvisAnalytics/>} />
      </Routes>
    </>
  );
}

export default App;
