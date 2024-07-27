import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Waiting } from "./Waiting";
import { WildChoice } from "./WildChoice";
import { SelectedCard } from "./SelectedCard";
import { Enemy } from "./Enemy";
import { ActualPlayer } from "./ActualPlayer";
import { SERVER_URL } from "./constants/url";

function App({ username }) {
  const [user, setUser] = useState(username);
  const [deck, setDeck] = useState<string[]>([]);
  const [player, setPlayer] = useState<string[]>([]);
  const [enemy, setEnemy] = useState<string[]>([]);
  const [actualCard, setActualCard] = useState<string>("");
  const [open, setOpen] = useState({ state: false, color: "" });
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    const socket = io(SERVER_URL, {
      transports: ["websocket"],
    });

    const handleConnect = () => {
      console.log("Connected to server");
      socket.emit("requestItems");
    };

    const handlePlayerCards = (allCards) => {
      const myPlayer = allCards[user];
      const { [user]: _, ...rest } = allCards;

      if (Object.keys(rest).length === 0) {
        setWaiting(true);
        return;
      }

      setPlayer(myPlayer);
      setEnemy(Object.values(rest)[0]);
    };

    const handleActualCard = (card) => {
      setActualCard(card);
    };

    const handleDeck = (cards) => {
      setDeck(cards);
    };

    const handleWaiting = (wait) => {
      setWaiting(wait);
    };

    const handleColor = (color) => {
      setOpen({ state: true, color });
    };

    socket.on("connect", handleConnect);
    socket.on("playerCards", handlePlayerCards);
    socket.on("firstCard", handleActualCard);
    socket.on("deck", handleDeck);
    socket.on("waiting", handleWaiting);
    socket.on("color", handleColor);

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <>
      {waiting && <Waiting />}
      {open.state && <WildChoice setOpen={setOpen} />}
      {!waiting && (
        <SelectedCard
          deck={deck}
          actualCard={actualCard}
          open={open}
          setDeck={setDeck}
          setPlayer={setPlayer}
          username={username}
        />
      )}
      <Enemy enemy={enemy} />
      <ActualPlayer
        user={user}
        actualCard={actualCard}
        player={player}
        setActualCard={setActualCard}
        setPlayer={setPlayer}
        setOpen={setOpen}
        open={open}
      />
    </>
  );
}

export default App;
