"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const organize_1 = require("./utils/organize");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://192.168.100.2:5173", // Substitua pelo endereço do seu cliente React
        methods: ["GET", "POST"],
    },
});
let playerCards = {};
let randomCards = organize_1.shuffledCards;
let firstCard = "";
const addCards = (username) => {
    if (playerCards[username]) {
        return;
    }
    playerCards[username] = randomCards.splice(0, 7);
};
io.on("connection", (socket) => {
    console.log("A client connected:", socket.id);
    socket.onAny((event, ...args) => {
        console.log(event, args);
    });
    socket.on("username", (name) => {
        addCards(name);
        socket.emit("usernameConfirmed", name);
    });
    socket.on("cardPlayed", ({ player, card, updatedPlayerCards }) => {
        playerCards[player] = updatedPlayerCards;
        firstCard = card;
        io.emit("playerCards", playerCards);
        io.emit("firstCard", card);
    });
    // socket.on("playerCards", (players) => {
    //   playerCards = players;
    //   io.emit("playerCards", playerCards);
    // });
    socket.on("deck", (cards) => {
        randomCards = cards;
        io.emit("deck", cards);
    });
    socket.on("addCard", (player) => {
        playerCards[player].push(randomCards.pop() || "");
        io.emit("playerCards", playerCards);
        console.log("Added a card to player:", player);
    });
    socket.on("requestItems", () => {
        io.emit("playerCards", playerCards);
        io.emit("deck", randomCards);
        if (Object.values(playerCards).length === 2) {
            io.emit("waiting", false);
        }
        if (!firstCard) {
            for (let i = 0; i < 8; i += 1) {
                firstCard = randomCards.pop() || "";
                if (firstCard.includes("Wild")) {
                    randomCards.push(firstCard);
                }
                else {
                    break;
                }
            }
            io.emit("firstCard", firstCard);
        }
        else {
            socket.emit("firstCard", firstCard);
        }
        console.log("Sent items to client:", socket.id);
    });
    socket.on("removePlayer", (username) => {
        delete playerCards[username];
    });
    socket.on("disconnect", () => {
        console.log("A client disconnected:", socket.id);
    });
});
httpServer.listen(3000, "0.0.0.0", () => {
    console.log("Listening on *:3000");
});
