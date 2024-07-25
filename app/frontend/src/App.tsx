import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Login } from "./pages/Login";
import Game from "./pages/Game";
import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Login username={username} setUsername={setUsername} />}
        />
        <Route path="/game" element={<Game username={username} />} />
      </Routes>
    </>
  );
}

export default App;
