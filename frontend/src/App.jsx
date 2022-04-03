import React, { useEffect, useState } from "react";
import VideoChatContextProvider from "./context/VideoChatContextProvider";
import SocketController from "./controllers/SocketController";
import { Route, Routes } from "react-router-dom";
import LoginScreen from "./Screens/LoginScreen";
import ChatScreen from "./Screens/ChatScreen";

function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    SocketController.connect();
    SocketController.on("connect", () => setIsConnected(true));
  }, []);

  if (!isConnected) return null;

  return (
    <VideoChatContextProvider>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/chat" element={<ChatScreen />} />
      </Routes>
    </VideoChatContextProvider>
  );
}

export default App;
