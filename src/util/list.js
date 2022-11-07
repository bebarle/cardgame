const randomInt = (min = 1, max = 100) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const generateRandomNumbers = cardPairs => {
  const randomNumbers = [];
  while (randomNumbers.length < cardPairs) {
    const number = randomInt();
    if (!randomNumbers.includes(number)) {
      randomNumbers.push(number);
    }
  }

  return randomNumbers;
};

export const generateList = cardPairs => {
  // generate 10 random numbers from 1-100]
  const randomNumbers = generateRandomNumbers(cardPairs);
  const pairs = [];
  let counter = 0;

  // x2 (dup)
  randomNumbers.forEach(number => {
    pairs.push({
      id: counter,
      value: number,
    });
    counter++;
  });
  randomNumbers.forEach(number => {
    pairs.push({
      id: counter,
      value: number,
    });
    counter++;
  });

  // randomize
  return pairs.sort(() => {
    return 0.5 - Math.random();
  });
};

export const getItem = (list, id) => {
  return list.find(item => {
    return item.id === id;
  });
};
