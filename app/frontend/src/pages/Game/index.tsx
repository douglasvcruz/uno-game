import { useEffect, useState } from "react";
import back_card from "/images/UNO-Back.svg";
import { io } from "socket.io-client";

const SERVER_URL = "http://192.168.100.2:3000";

function App({ username }) {
  const [deck, setDeck] = useState<string[]>([]);
  const [player, setPlayer] = useState<string[]>([]);
  const [enemy, setEnemy] = useState<string[]>([]);
  const [firstCard, setFirstCard] = useState<string>("");
  const [open, setOpen] = useState({ state: false, color: "" });
  const [user, setUser] = useState(username);
  const [waiting, setWaiting] = useState(false);

  const addCard = (color: string) => {
    setOpen({ state: false, color });
  };

  const selectCard = (card: string) => {
    const color = card.split("_")[0].split("/");
    const actualColor = color[color.length - 1].toLowerCase();
    const cardMatch = card.match(/\d+/);
    const containNumber = cardMatch ? cardMatch[0] : "not a number";
    const socket = io(SERVER_URL, {
      transports: ["websocket"],
    });

    console.log(card);

    if (card.includes("Wild")) {
      setFirstCard(card);
      setPlayer(player.filter((_card) => _card !== card));
      setOpen({ state: true, color: "" });
      const filteredCard = player.filter((_card) => _card !== card);
      socket.emit("cardPlayed", {
        player: user,
        card,
        updatedPlayerCards: filteredCard,
      });
      return;
    }

    if (
      firstCard.includes(containNumber) ||
      firstCard.toLowerCase().includes(actualColor) ||
      firstCard.includes("Reverse") ||
      firstCard.includes("Draw") ||
      firstCard.includes("Skip") ||
      open.color.includes(actualColor)
    ) {
      const filteredCard = player.filter((_card) => _card !== card);
      setFirstCard(card);
      setPlayer(filteredCard);
      socket.emit("cardPlayed", {
        player: user,
        card,
        updatedPlayerCards: filteredCard,
      });
    }

    setOpen({ state: false, color: "" });
  };

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

  useEffect(() => {
    const socket = io(SERVER_URL, {
      transports: ["websocket"],
    });

    const handleConnect = () => {
      console.log("Connected to server");
      socket.emit("requestItems");
    };

    const handlePlayerCards = (allCards) => {
      console.log("Received playerCards event", allCards);
      const myPlayer = allCards[user];
      const { [user]: _, ...rest } = allCards;

      if (Object.keys(rest).length === 0) {
        setWaiting(true);
        return;
      }
      setPlayer(myPlayer);
      setEnemy(Object.values(rest)[0]);
    };

    const handleFirstCard = (card) => {
      console.log("Received firstCard event", card);
      setFirstCard(card);
    };

    const handleDeck = (cards) => {
      console.log("Received deck event", cards);
      setDeck(cards);
    };

    const handleDisconnect = () => {
      console.log("Disconnected from server");
      socket.emit("removePlayer", user);
    };

    const handleWaiting = (wait) => {
      setWaiting(wait);
    };

    const handleColor = (color) => {
      setOpen({ state: true, color });
    };

    socket.on("connect", handleConnect);
    socket.on("playerCards", handlePlayerCards);
    socket.on("firstCard", handleFirstCard);
    socket.on("deck", handleDeck);
    socket.on("disconnect", handleDisconnect);
    socket.on("waiting", handleWaiting);
    socket.on("color", handleColor);

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <>
      {waiting && (
        <h1 className="text-4xl text-white text-center absolute z-50 self-center">
          Aguardando oponente..
        </h1>
      )}
      {open.state && (
        <div className="z-30 absolute top-16 flex flex-col">
          <div>
            <h1 className="text-center text-4xl font-bold text-white mb-2">
              Escolha uma cor
            </h1>
            <div className="grid grid-cols-2 w-40 gap-8 m-auto">
              <div
                onClick={() => addCard("yellow")}
                className="w-20 h-32 bg-yellow-500 rounded border-white border-8"
              ></div>
              <div
                onClick={() => addCard("blue")}
                className="w-20 h-32 bg-blue-500 rounded border-white border-8"
              ></div>
              <div
                onClick={() => addCard("green")}
                className="w-20 h-32 bg-green-500 rounded border-white border-8"
              ></div>
              <div
                onClick={() => addCard("red")}
                className="w-20 h-32 bg-red-500 rounded border-white border-8"
              ></div>
            </div>
          </div>
          <button
            className="bg-white rounded p-2 mt-4 w-24 m-auto"
            onClick={() => setOpen({ state: false, color: "" })}
          >
            Fechar
          </button>
        </div>
      )}
      {open.state && (
        <div className="h-svh w-svw absolute top-0 left-0 bg-black opacity-90 z-10"></div>
      )}
      <div className="flex flex-wrap items-center gap-10 relative">
        {/* {!open.color.length > 0 && (
          <div
            className="rounded-2xl w-24 h-32 absolute bg-transparent"
            style={{
              transform: "translateX(88px)",
              boxShadow: `10 20 29 3px ${open.color}`,
            }}
          ></div>
        )} */}
        {!waiting && deck.length > 0 && (
          <img
            src={back_card}
            alt="back_card"
            className="rounded-l w-16 cursor-pointer"
            onClick={pick_card}
          />
        )}
        {!waiting && (
          <div className="relative">
            <img
              src={`/images/${firstCard}.jpg`}
              alt="first-card"
              className="rounded-l w-16"
              style={{}}
            />
            <div
              className="absolute inset-0 opacity-60 rounded-l"
              style={{ backgroundColor: open.color }}
            ></div>
          </div>
        )}
      </div>
      <div
        className="absolute text-center flex top-2 w-svw justify-center"
        style={{ transform: "rotate(180deg)" }}
      >
        {enemy.length > 0 &&
          enemy.map((_card, index) => {
            const centerIndex = Math.floor(enemy.length / 2);
            const angle = (index - centerIndex) * 5; // Ajuste do ângulo para curvatura
            const translateX = -(index - centerIndex) * 30; // Ajuste do espaçamento horizontal para manter as cartas próximas

            return (
              <img
                key={index}
                src={"/images/UNO-Back.svg"}
                alt="uno-card"
                className={`w-12 h-auto rounded transition-transform duration-300 ${
                  index === centerIndex ? "scale-110" : ""
                }`}
                style={{
                  transform: `translateX(${translateX}px) rotate(${angle}deg)`,
                  transformOrigin: "center bottom", // Ajusta a rotação em torno do ponto central
                }}
              />
            );
          })}
      </div>
      <div className="absolute bottom-5 flex w-shw justify-center">
        {player !== undefined &&
          player.map((card, index) => {
            const centerIndex = Math.floor(player.length / 2);
            const angle = (index - centerIndex) * 5; // Ajuste do ângulo para curvatura
            const translateX = -(index - centerIndex) * 40; // Ajuste do espaçamento horizontal para manter as cartas próximas

            return (
              <img
                key={index}
                src={`/images/${card}.jpg`}
                alt="uno-card"
                onClick={() => selectCard(card)}
                className={`w-16 h-auto rounded transition-transform duration-300 ${
                  index === centerIndex ? "scale-110" : ""
                }`}
                style={{
                  transform: `translateX(${translateX}px) rotate(${angle}deg)`,
                  transformOrigin: "center bottom", // Ajusta a rotação em torno do ponto central
                }}
              />
            );
          })}
      </div>
    </>
  );
}

export default App;
