import { useState } from 'react';
import pluralize from 'pluralize';

import { useRegistrationContext } from '../RegistrationContext';
import useCartCalculator from '../useCartCalculator';
import Button from '@/atoms/Button';
import Money from '@/atoms/Money';
import { useFinaliseRegistrationMutation } from '@/graphql/types';
import Popover from '@/molecules/Popover';

import './Payment.css';

export const Component: React.FC = () => {
  const { base, count, value, discount, total } = useCartCalculator();

  const { next } = useRegistrationContext();

  const [finaliseRegistration] = useFinaliseRegistrationMutation();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    finaliseRegistration().then(() => next());
  };

  const [discountHelp, setDiscountHelp] = useState<HTMLElement | null>(null);

  const [discountHelpShowing, setDiscountHelpShowing] = useState<boolean>(false);

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
          <dt style={{ flexDirection: 'column', alignItems: 'start' }}>
            {pluralize('workshop', count, true)}
            <span style={{ marginLeft: 'var(--medium)' }}>
              @ <Money cents={base} />
            </span>
          </dt>
          <dd>
            <Money cents={value} includeCurrency />
          </dd>
          {discount > 0 && (
            <>
              <dt>
                <span>Discount</span>
                <Button
                  small
                  ghost
                  icon="help"
                  aria-label="How do discounts work?"
                  ref={setDiscountHelp}
                  onClick={() => setDiscountHelpShowing((current) => !current)}
                />
                {discountHelp && (
                  <Popover
                    className="discounts-explained"
                    reference={discountHelp}
                    open={discountHelpShowing}
                    placement="top"
                    onOpenChange={setDiscountHelpShowing}
                  >
                    <p>
                      Each workshop you buy after the first one is cheaper by a set amount. This
                      discount is compounded, so the more workshops you buy, the more you save.
                    </p>
                  </Popover>
                )}
              </dt>
              <dd>
                <Money cents={-discount} includeCurrency />
              </dd>
            </>
          )}
          <dt>Total amount due</dt>
          <dd>
            <Money cents={total} includeCurrency />
          </dd>
        </dl>
      </div>
    </form>
  );
};

Component.displayName = 'Payment';

export default Component;
