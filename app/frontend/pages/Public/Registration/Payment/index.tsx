import pluralize from 'pluralize';

import { useRegistrationContext } from '../RegistrationContext';
import useCartCalculator from '../useCartCalculator';

import './Payment.css';

const Payment: React.FC = () => {
  const { base, count, value, discount, total } = useCartCalculator();

  const { next } = useRegistrationContext();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    next();
  };

  return (
    <form id="registration-form" className="registration__payment" onSubmit={submit}>
      <div className="registration__payment__earlybird">
        <h2>You don’t have to pay anything right now.</h2>
        <p>
          Your full registration fee is due once registrations are finalised in early September.
        </p>
        <p>
          This is because we can’t guarantee places in every workshop you’ve selected, although in
          other years where this system has been in place, almost everyone has been able to get a
          place in every slot.
        </p>
        <p>
          You can maximise your chances of a full Festival schedule by picking some second or third
          choices for workshop slots. We hope that even if you don’t always get your first choice,
          you’ll be delighted with the quality on offer.
        </p>
      </div>
      <div className="registration__payment__summary">
        <h3>Account summary</h3>
        <dl>
          <dt>
            {pluralize('workshop', count, true)}
            <br />@ ${base} NZD
          </dt>
          <dd>{`$${value}`}</dd>
          {discount > 0 && (
            <>
              <dt>Discount</dt>
              <dd>{`$${discount}`}</dd>
            </>
          )}
          <dt>Total amount due</dt>
          <dd>{`$${total}`}</dd>
        </dl>
      </div>
    </form>
  );
};

export default Payment;
