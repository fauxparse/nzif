import { useState } from 'react';
import pluralize from 'pluralize';

import { useRegistrationContext } from '../RegistrationContext';
import useCartCalculator from '../useCartCalculator';
import Button from '@/atoms/Button';
import Money from '@/atoms/Money';
import { RegistrationStatusQuery, useFinaliseRegistrationMutation } from '@/graphql/types';
import Popover from '@/molecules/Popover';

type CartProps = {
  registration: RegistrationStatusQuery['registration'];
  festival: RegistrationStatusQuery['festival'];
};

const Cart: React.FC<CartProps> = ({ registration, festival }) => {
  const { base, count, value, discount, total, paid, outstanding, refundDue } = useCartCalculator(
    registration,
    festival
  );

  const { next } = useRegistrationContext();

  const [finaliseRegistration] = useFinaliseRegistrationMutation();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    finaliseRegistration().then(() => next());
  };

  const [discountHelp, setDiscountHelp] = useState<HTMLElement | null>(null);

  const [discountHelpShowing, setDiscountHelpShowing] = useState<boolean>(false);

  return (
    <div className="registration__cart">
      <h3>Account summary</h3>
      <dl>
        <dt style={{ flexDirection: 'column', alignItems: 'start' }}>
          <span>
            {pluralize('workshop', count, true)}
            {' @ '}
            <Money cents={base} />
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
        <span className="di">
          <dt>Total</dt>
          <dd>
            <Money cents={total} includeCurrency />
          </dd>
        </span>
        {paid > 0 && (
          <span className="di">
            <dt>Paid</dt>
            <dd>
              <Money cents={-paid} includeCurrency />
            </dd>
          </span>
        )}
        {outstanding > 0 && (
          <span className="di">
            <dt>Amount remaining</dt>
            <dd>
              <Money cents={outstanding} includeCurrency />
            </dd>
          </span>
        )}
        {refundDue > 0 && (
          <span className="di">
            <dt>Refund due</dt>
            <dd>
              <Money cents={-refundDue} includeCurrency />
            </dd>
          </span>
        )}
      </dl>
    </div>
  );
};

export default Cart;
