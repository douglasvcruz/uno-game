export function Enemy({ enemy }) {
  return (
    <div
      className="absolute text-center flex top-2 w-svw justify-center"
      style={{ transform: "rotate(180deg)" }}
    >
      {enemy.length > 0 &&
        enemy.map((_card, index) => {
          const centerIndex = Math.floor(enemy.length / 2);
          const angle = (index - centerIndex) * 5;
          const translateX = -(index - centerIndex) * 30;

          return (
            <img
              key={index}
              src={"/images/UNO-Back.svg"}
              alt="uno-card"
              className={`w-12 h-auto rounded transition-transform duration-300`}
              style={{
                transform: `translateX(${translateX}px) rotate(${angle}deg)`,
                transformOrigin: "center bottom", // Ajusta a rotação em torno do ponto central
              }}
            />
          );
        })}
    </div>
  );
}
