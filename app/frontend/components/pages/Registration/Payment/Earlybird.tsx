import { Money } from '@/components/atoms/Money';
import { usePricing } from '@/services/Pricing';
import { useRegistration } from '@/services/Registration';
import { Heading, Table, Text } from '@radix-ui/themes';
import clsx from 'clsx';
import pluralize from 'pluralize';
import { Buttons } from '../Buttons';
import { usePreferences } from '../Workshops/WorkshopPreferencesProvider';

import registrationClasses from '../Registration.module.css';
import classes from './Payment.module.css';

export const Earlybird = () => {
  const { goToNextStep } = useRegistration();
  const { totalValue, packageDiscount, packagePrice, basePrice } = usePricing();
  const { count } = usePreferences();

  return (
    <form
      className={clsx(registrationClasses.page, classes.payment)}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        goToNextStep();
      }}
    >
      <div />
      <Text as="div" size={{ initial: '3', md: '4' }}>
        <Heading>Confirm your registration</Heading>
        <p>
          Click <b>Finish</b> below to confirm your registration. You can change your preferences
          any time up until preferential registration closes on 30 August.
        </p>
        <p>
          We’ll be in touch once initial workshop allocations are done in early September. Then
          you’ll be able to pay for any workshops you’ve been allocated to.
        </p>
        <p>
          <Text size={{ initial: '3', md: '4' }}>
            Here’s what your total would look like, assuming you got workshops in all the slots you
            applied for:
          </Text>
        </p>

        <Table.Root className={classes.paymentTable} size="3" variant="surface">
          <Table.Body>
            <Table.Row>
              <Table.RowHeaderCell>{pluralize('workshop', count, true)}</Table.RowHeaderCell>
              <Table.Cell justify="end">
                @ <Money cents={basePrice} />
              </Table.Cell>
              <Table.Cell align="right">
                <Money cents={totalValue(count)} includeCurrency />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.RowHeaderCell colSpan={2}>Package discount</Table.RowHeaderCell>
              <Table.Cell align="right">
                <Money cents={-packageDiscount(count)} includeCurrency />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.RowHeaderCell colSpan={2}>
                <b>Total</b>
              </Table.RowHeaderCell>
              <Table.Cell align="right">
                <Text size="5" weight="bold">
                  <Money cents={packagePrice(count)} includeCurrency />
                </Text>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Text>
      <p>
        Thanks to Support from the Community Organisation Grants Scheme (COGS) we are able to offer
        one free scholarship place in each workshop at this year's Festival. To see the criteria and
        apply for scholarship places, please fill out our{' '}
        <a href="https://forms.gle/BxhpvbwyHv7quLkm7" target="_blank" rel="noopener noreferrer">
          EOI form
        </a>
        . Note that you must have selected and submitted your workshop preferences by August 30th to
        be eligible.
      </p>
      <Buttons />
    </form>
  );
};
