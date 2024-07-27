export function WildChoice({ setOpen }) {
  return (
    <>
      <div className="z-30 absolute top-16 flex flex-col">
        <div>
          <h1 className="text-center text-4xl font-bold text-white mb-2">
            Escolha uma cor
          </h1>
          <div className="grid grid-cols-2 w-40 gap-8 m-auto">
            <div
              onClick={() => setOpen({ state: false, color: "yellow" })}
              className="w-20 h-32 bg-yellow-500 rounded border-white border-8"
            ></div>
            <div
              onClick={() => setOpen({ state: false, color: "blue" })}
              className="w-20 h-32 bg-blue-500 rounded border-white border-8"
            ></div>
            <div
              onClick={() => setOpen({ state: false, color: "green" })}
              className="w-20 h-32 bg-green-500 rounded border-white border-8"
            ></div>
            <div
              onClick={() => setOpen({ state: false, color: "red" })}
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
      <div className="h-svh w-svw absolute top-0 left-0 bg-black opacity-90 z-10"></div>
    </>
  );
}
