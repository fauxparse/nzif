import { range } from 'lodash-es';
import { useEffect, useReducer } from 'react';

type Digit = number;

type DigitProps = {
  digit: Digit;
};

type State = {
  previous: Digit;
  current: Digit;
};

const Digit: React.FC<DigitProps> = ({ digit }) => {
  const [{ previous, current }, setDigit] = useReducer(
    ({ previous, current }: State, next: Digit) => {
      if (next === current) {
        return { previous, current };
      }
      return { previous: current, current: next };
    },
    { previous: ((digit + 9) % 10) as Digit, current: digit }
  );

  useEffect(() => {
    setDigit(digit);
  }, [digit]);

  return (
    <div className="digit" data-digit={current} data-previous={previous}>
      {range(10).map((i) => (
        <span key={i} data-digit={i} />
      ))}
    </div>
  );
};

export default Digit;
