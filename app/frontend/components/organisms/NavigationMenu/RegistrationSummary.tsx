import { Money } from '@/components/atoms/Money';
import CartIcon from '@/icons/CartIcon';
import { usePricing } from '@/services/Pricing';
import { useQuery } from '@apollo/client';
import { Box, Button, Flex, Inset, Text } from '@radix-ui/themes';
import { Link } from '@tanstack/react-router';
import pluralize from 'pluralize';
import { useMemo } from 'react';
import { RegistrationSummaryQuery } from './queries';

import WorkshopIcon from '@/icons/WorkshopIcon';
import { RegistrationProvider, useRegistration } from '@/services/Registration';
import classes from './NavigationMenu.module.css';

export const RegistrationSummary = () => {
  const { data, loading } = useQuery(RegistrationSummaryQuery);

  const registration = data?.registration;

  const count = useMemo(() => {
    if (!registration) return 0;

    const slots = registration.preferences
      .flatMap((p) => p.session.slots)
      .reduce((acc, slot) => acc.add(slot.id), new Set());
    return slots.size;
  }, [registration]);

  if (!registration?.id) {
    return (
      <Inset side="x">
        <Flex px="3" py="2">
          <Box asChild flexGrow="1">
            <Button size="3" asChild>
              <Link to="/register">
                <WorkshopIcon />
                Register now
              </Link>
            </Button>
          </Box>
        </Flex>
      </Inset>
    );
  }

  return (
    <RegistrationProvider>
      <Inset className={classes.registrationSummary}>
        <Text className={classes.heading} size="4" weight="medium">
          You’re coming to NZIF!
        </Text>
        <CartSummary />
        <Button className={classes.button} asChild>
          <Link to="/register/workshops">Workshop preferences</Link>
        </Button>
      </Inset>
    </RegistrationProvider>
  );
};

const CartSummary = () => {
  const { count } = useRegistration();
  const { totalValue, packagePrice, packageDiscount } = usePricing();

  return (
    <>
      <CartIcon className={classes.icon} />
      <Text className={classes.count}>{pluralize('workshop', count, true)}</Text>
      <Text className={classes.total}>
        {packageDiscount(count) > 0 && (
          <del>
            <Money cents={totalValue(count)} />
          </del>
        )}
        <Money cents={packagePrice(count)} includeCurrency />
      </Text>
    </>
  );
};
