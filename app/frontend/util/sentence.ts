type SentenceOptions = {
  wordsConnector?: string;
  twoWordsConnector?: string;
  lastWordConnector?: string;
};

const DEFAULT_OPTIONS: SentenceOptions = {
  wordsConnector: ', ',
  twoWordsConnector: ' and ',
  lastWordConnector: ', and ',
};

const sentence = (array: string[], options: SentenceOptions = {}) => {
  const { wordsConnector, twoWordsConnector, lastWordConnector } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  switch (array.length) {
    case 0:
      return '';
    case 1:
      return array[0];
    case 2:
      return `${array[0]}${twoWordsConnector}${array[1]}`;
    default:
      return `${array.slice(0, -1).join(wordsConnector)}${lastWordConnector}${array.slice(-1)}`;
  }
};

export default sentence;
