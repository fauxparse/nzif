import Logo from '@/components/atoms/Logo';
import ChevronLeftIcon from '@/icons/ChevronLeftIcon';
import { RegistrationProvider, StepId, StepState } from '@/services/Registration';
import { Button } from '@radix-ui/themes';
import { Link, Outlet, useChildMatches } from '@tanstack/react-router';
import { Steps } from './Steps';

import { Main } from './Main';
import classes from './Registration.module.css';
import { WorkshopPreferencesProvider } from './Workshops/WorkshopPreferencesProvider';

export const Layout = () => {
  const step = useChildMatches({
    select: (matches) =>
      matches
        .find((match) => match.id.match(/register\/.+/))
        ?.id.split('/')
        .pop() as StepId | undefined,
  });

  const stepClicked = (step: StepId, state: StepState) => {};

  return (
    <RegistrationProvider>
      <WorkshopPreferencesProvider>
        {step ? (
          <div className={classes.layout}>
            <div className={classes.sidebar}>
              <div className={classes.sidebarInner}>
                <Link to="/" className={classes.logo}>
                  <Logo />
                </Link>

                <Steps />

                <Button asChild className={classes.goBack} variant="ghost" size="3" color="gray">
                  <Link to="/">
                    <ChevronLeftIcon />
                    Go back
                  </Link>
                </Button>
              </div>
            </div>
            <Main />
          </div>
        ) : (
          <Outlet />
        )}
      </WorkshopPreferencesProvider>
    </RegistrationProvider>
  );
};
