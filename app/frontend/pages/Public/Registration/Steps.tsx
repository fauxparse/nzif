import { CSSProperties } from 'react';

const Steps: React.FC = () => {
  return (
    <div className="registration__steps" style={{ '--step-count': 3 } as CSSProperties}>
      <div className="registration__step" data-step-count="3">
        <b>Your details</b>
      </div>
      <div className="registration__step" data-step-count="3" aria-selected>
        <b>Workshop selection</b>
      </div>
      <div className="registration__step" data-step-count="3">
        <b>Payment</b>
      </div>
    </div>
  );
};

export default Steps;
