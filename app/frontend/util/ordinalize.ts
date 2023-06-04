const ordinals = new Map<number, string>([
  [1, 'first'],
  [2, 'second'],
  [3, 'third'],
  [4, 'fourth'],
  [5, 'fifth'],
  [6, 'sixth'],
  [7, 'seventh'],
  [8, 'eighth'],
  [9, 'ninth'],
  [10, 'tenth'],
]);

const ordinalize = (number: number): string => {
  const ordinal = ordinals.get(number);
  if (ordinal) return ordinal;

  const tens = Math.floor(number / 10) % 10;

  if (tens === 1) return `${number}th`;

  switch (number % 10) {
    case 1:
      return `${number}st`;
    case 2:
      return `${number}nd`;
    case 3:
      return `${number}rd`;
    default:
      return `${number}th`;
  }
};

export default ordinalize;
