export const uno_cards = [
  "Red_0",
  "Red_1",
  "Red_2",
  "Red_3",
  "Red_4",
  "Red_5",
  "Red_6",
  "Red_7",
  "Red_8",
  "Red_9",
  "Red_Reverse",
  "Red_Skip",
  "Red_Draw",
  "Blue_0",
  "Blue_1",
  "Blue_2",
  "Blue_3",
  "Blue_4",
  "Blue_5",
  "Blue_6",
  "Blue_7",
  "Blue_8",
  "Blue_9",
  "Blue_Reverse",
  "Blue_Skip",
  "Blue_Draw",
  "Green_0",
  "Green_1",
  "Green_2",
  "Green_3",
  "Green_4",
  "Green_5",
  "Green_6",
  "Green_7",
  "Green_8",
  "Green_9",
  "Green_Reverse",
  "Green_Skip",
  "Green_Draw",
  "Yellow_0",
  "Yellow_1",
  "Yellow_2",
  "Yellow_3",
  "Yellow_4",
  "Yellow_5",
  "Yellow_6",
  "Yellow_7",
  "Yellow_8",
  "Yellow_9",
  "Yellow_Reverse",
  "Yellow_Skip",
  "Yellow_Draw",
  "Red_1",
  "Red_2",
  "Red_3",
  "Red_4",
  "Red_5",
  "Red_6",
  "Red_7",
  "Red_8",
  "Red_9",
  "Red_Reverse",
  "Red_Skip",
  "Red_Draw",
  "Blue_1",
  "Blue_2",
  "Blue_3",
  "Blue_4",
  "Blue_5",
  "Blue_6",
  "Blue_7",
  "Blue_8",
  "Blue_9",
  "Blue_Reverse",
  "Blue_Skip",
  "Blue_Draw",
  "Green_1",
  "Green_2",
  "Green_3",
  "Green_4",
  "Green_5",
  "Green_6",
  "Green_7",
  "Green_8",
  "Green_9",
  "Green_Reverse",
  "Green_Skip",
  "Green_Draw",
  "Yellow_1",
  "Yellow_2",
  "Yellow_3",
  "Yellow_4",
  "Yellow_5",
  "Yellow_6",
  "Yellow_7",
  "Yellow_8",
  "Yellow_9",
  "Yellow_Reverse",
  "Yellow_Skip",
  "Yellow_Draw",
  "Wild",
  "Wild_Draw",
  "Wild",
  "Wild_Draw",
  "Wild",
  "Wild_Draw",
  "Wild",
  "Wild_Draw",
];

const shuffleCards = () => {
  const newCards = uno_cards;
  for (let i = 0; i < newCards.length; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
  }
  return newCards;
};

export const shuffledCards = shuffleCards();
