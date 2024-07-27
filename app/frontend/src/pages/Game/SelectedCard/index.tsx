import { SERVER_URL } from "../constants/url";
import back_card from "/images/UNO-Back.svg";
import { io } from "socket.io-client";

export function SelectedCard({
  open,
  setDeck,
  setPlayer,
  actualCard,
  deck,
  username,
}) {
  const pick_card = () => {
    const socket = io(SERVER_URL, {
      transports: ["websocket"],
    });

    setPlayer((prev) => {
      if (deck.length === 0) {
        return [...prev];
      }
      return [...prev, deck.pop() || ""];
    });
    setDeck(deck);
    socket.emit("addCard", username);
    socket.emit("deck", deck);
  };

  return (
    <div className="flex flex-wrap items-center gap-10 relative">
      <img
        src={back_card}
        alt="back_card"
        className="rounded-l w-16 cursor-pointer"
        onClick={pick_card}
      />
      <div className="relative">
        <img
          src={`/images/${actualCard}.jpg`}
          alt="actual-card"
          className="rounded-l w-16"
        />
        <div
          className="absolute inset-0 opacity-60 rounded-l"
          style={{ backgroundColor: open.color }}
        ></div>
      </div>
    </div>
  );
}
