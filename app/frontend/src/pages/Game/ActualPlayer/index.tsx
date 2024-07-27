import { io } from "socket.io-client";
import { SERVER_URL } from "../constants/url";

export function ActualPlayer({
  player,
  setActualCard,
  setPlayer,
  setOpen,
  actualCard,
  user,
  open,
}) {
  const isSpecialCard = (card, type) => {
    return actualCard.includes(type) && card.includes(type);
  };

  const isValidCard = (card) => {
    const color = card.split("_")[0].split("/");
    const actualColor = color[color.length - 1].toLowerCase();
    const cardMatch = card.match(/\d+/);
    const actualNumber = cardMatch ? cardMatch[0] : null;

    const isSameCardNumber = actualCard.includes(actualNumber);
    const isSameColor = actualCard.toLowerCase().includes(actualColor);
    const isActualWildColor = open.color.includes(actualColor);

    console.log(
      isSameCardNumber,
      isSameColor,
      isActualWildColor,
      isSpecialCard(card, "Reverse"),
      isSpecialCard(card, "Draw"),
      isSpecialCard(card, "Skip")
    );

    return (
      isSameCardNumber ||
      isSameColor ||
      isActualWildColor ||
      isSpecialCard(card, "Reverse") ||
      isSpecialCard(card, "Draw") ||
      isSpecialCard(card, "Skip")
    );
  };

  const playCard = (card, index: number) => {
    const socket = io(SERVER_URL, {
      transports: ["websocket"],
    });

    const filteredCard = player.filter((_card, i) => i !== index);

    const isValid = isValidCard(card);
    const isWildCard = card.includes("Wild");
    const isOpenWild = isWildCard
      ? { state: true, color: "" }
      : { state: false, color: "" };

    if (isWildCard || isValid) {
      setActualCard(card);
      setPlayer(filteredCard);
      setOpen(isOpenWild);

      socket.emit("cardPlayed", {
        player: user,
        card,
        updatedPlayerCards: filteredCard,
      });
    }
  };

  return (
    <div className="absolute bottom-5 flex w-shw justify-center items-end">
      {player !== undefined &&
        player.map((card, index) => {
          const centerIndex = Math.floor(player.length / 2);
          const angle = (index - centerIndex) * 5;
          const translateX = -(index - centerIndex) * 40;

          return (
            <img
              key={index}
              src={`/images/${card}.jpg`}
              alt="uno-card"
              onClick={() => playCard(card, index)}
              className={`w-16 h-24 rounded transition-transform duration-300 hover:w-20 hover:h-28`}
              style={{
                transform: `translateX(${translateX}px) rotate(${angle}deg)`,
                transformOrigin: "center bottom",
              }}
            />
          );
        })}
    </div>
  );
}
