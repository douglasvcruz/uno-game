import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const SERVER_URL = "http://192.168.100.2:3000";

export function Login({ username, setUsername }) {
  const navigate = useNavigate();

  const handleName = ({ target }) => {
    setUsername(target.value);
  };

  const sendSocketUser = () => {
    const socket = io(SERVER_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      reconnectionAttempts: Infinity,
    });

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.emit("username", username);

    socket.on("usernameConfirmed", (confirmedUsername) => {
      if (confirmedUsername === username) {
        navigate("/game");
      } else {
        console.error("Username confirmation failed.");
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server:", socket.id);
    });
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        onChange={handleName}
        value={username}
        className="rounded p-2 border border-black mr-2"
        placeholder="Insira seu nome"
      />
      <button
        onClick={sendSocketUser}
        className="rounded p-2 bg-black text-white"
      >
        Login
      </button>
    </div>
  );
}
