import { DateTime } from 'luxon';
import React from 'react';
import { useTypedParams } from 'react-router-typesafe-routes/dom';

import { ROUTES } from '@/Routes';
import Icon from '@/atoms/Icon';
import Money from '@/atoms/Money';
import {
  PaymentDetailsFragment,
  PaymentState,
  usePaymentQuery,
  useUpdatePaymentMutation,
} from '@/graphql/types';
import Skeleton from '@/helpers/Skeleton';
import Segmented from '@/molecules/Segmented';
import Dialog from '@/organisms/Dialog';

import { PAYMENT_METHOD_ICONS, PAYMENT_METHOD_LABELS, PAYMENT_STATE_OPTIONS } from './types';

export const Component: React.FC = () => {
  const { id } = useTypedParams(ROUTES.ADMIN.PAYMENT);

  const { loading, data } = usePaymentQuery({ variables: { id } });

  const payment: PaymentDetailsFragment = data?.payment || {
    __typename: 'CreditCardPayment',
    id: 'loading',
    amount: 0,
    createdAt: DateTime.now(),
    reference: '',
    state: PaymentState.Pending,
    registration: {
      __typename: 'Registration',
      id: 'loading',
      user: {
        __typename: 'User',
        id: 'loading',
        name: '',
        email: '',
      },
    },
  };

  const [updatePayment] = useUpdatePaymentMutation();

  const updatePaymentState = (state: PaymentState) => {
    updatePayment({
      variables: { id, attributes: { state } },
      optimisticResponse: {
        __typename: 'Mutation',
        updatePayment: {
          __typename: 'UpdatePaymentPayload',
          payment: {
            ...payment,
            state,
          },
        },
      },
    });
  };

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>
          Payment {loading ? 'details' : `from ${payment.registration.user?.name}`}
        </Dialog.Title>
        <Dialog.Close />
      </Dialog.Header>
      <Dialog.Body>
        <div className="payments-admin__details">
          <dl>
            <dt>
              <Icon name="calendar" aria-label="Date/time" />
            </dt>
            <dd>
              <Skeleton text loading={loading}>
                {payment.createdAt.toFormat('d MMM, h:mm a')}
              </Skeleton>
            </dd>
            <dt>
              <Icon name={PAYMENT_METHOD_ICONS[payment.__typename]} aria-label="Payment method" />
            </dt>
            <dd>
              <Skeleton text loading={loading}>
                {`via ${PAYMENT_METHOD_LABELS[payment.__typename]}`}
              </Skeleton>
            </dd>
            {payment.reference && (
              <>
                <dt>
                  <Icon name="paymentReference" aria-label="Reference" />
                </dt>
                <dd>
                  <Skeleton text loading={loading}>
                    {payment.reference}
                  </Skeleton>
                </dd>
              </>
            )}
          </dl>
          <Money cents={payment.amount} />
        </div>
      </Dialog.Body>
      <Dialog.Footer>
        <Segmented
          exclusive
          options={PAYMENT_STATE_OPTIONS}
          value={payment.state}
          onChange={(state) => updatePaymentState(state)}
        />
      </Dialog.Footer>
    </>
  );
};

Component.displayName = 'Payment';

export default Component;
