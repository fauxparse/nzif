import { Drawer, useDrawer } from '@/components/molecules/Drawer';
import { useDisclosure } from '@/hooks/useDisclosure';
import MenuIcon from '@/icons/MenuIcon';
import {
  Heading,
  IconButton,
  Inset,
  Separator,
  Theme,
  VisuallyHidden,
  useThemeContext,
} from '@radix-ui/themes';

import { ActionList } from '@/components/molecules/ActionList';
import { ACTIVITY_TYPES } from '@/constants/activityTypes';
import { Permission } from '@/graphql/types';
import { useDarkMode } from '@/hooks/useDarkMode';
import CalendarIcon from '@/icons/CalendarIcon';
import CloseIcon from '@/icons/CloseIcon';
import DashboardIcon from '@/icons/DashboardIcon';
import PaymentIcon from '@/icons/PaymentIcon';
import ThemeIcon from '@/icons/ThemeIcon';
import UsersIcon from '@/icons/UsersIcon';
import { useAuthentication } from '@/services/Authentication';
import { useQuery } from '@apollo/client';
import { Link } from '@tanstack/react-router';
import { isEmpty } from 'lodash-es';
import pluralize from 'pluralize';
import React from 'react';
import { MyActivities } from './MyActivities';
import classes from './NavigationMenu.module.css';
import { RegistrationSummary } from './RegistrationSummary';
import { NavigationMenuQuery } from './queries';

const NavigationMenu: React.FC = () => {
  const [opened, { toggle, open, close }] = useDisclosure();

  const { appearance } = useThemeContext();

  return (
    <>
      <IconButton
        className={classes.menuButton}
        variant="ghost"
        size="4"
        radius="full"
        color="gray"
        aria-expanded={opened}
        onClick={toggle}
      >
        <MenuIcon />
      </IconButton>
      <Theme appearance={appearance === 'dark' ? 'light' : 'dark'}>
        <Drawer.Root open={opened} onOpenChange={(v) => (v ? open : close)()}>
          <NavigationMenuContent visible={opened} />
        </Drawer.Root>
      </Theme>
    </>
  );
};

const NavigationMenuContent: React.FC<{ visible?: boolean }> = ({ visible }) => {
  const { user, hasPermission } = useAuthentication();

  const { data } = useQuery(NavigationMenuQuery);

  const { toggle: toggleTheme } = useDarkMode();

  const { close } = useDrawer();

  const clicked = (e: React.MouseEvent<HTMLDivElement>) => {
    const { tagName } = e.target as HTMLElement;
    if (tagName === 'A' || tagName === 'BUTTON') {
      close();
    }
  };

  return (
    <Drawer.Content
      className={classes.drawer}
      visible={visible}
      origin="left"
      size="400"
      onClick={clicked}
    >
      <VisuallyHidden asChild>
        <Drawer.Description>Navigation menu</Drawer.Description>
      </VisuallyHidden>
      <Drawer.Close asChild>
        <IconButton className={classes.close} variant="ghost" color="gray" size="4" radius="full">
          <CloseIcon />
        </IconButton>
      </Drawer.Close>
      <RegistrationSummary registration={data?.registration ?? null} />
      <Inset side="x">
        <ActionList className={classes.items}>
          <ActionList.Item asChild>
            <Link to="/calendar">
              <CalendarIcon />
              Calendar
            </Link>
          </ActionList.Item>
        </ActionList>
        {data?.user?.activities && <MyActivities activities={data.user.activities} />}
        <Separator size="4" my="4" />
        <ActionList className={classes.items} variant="subtle">
          {Object.entries(ACTIVITY_TYPES).map(([_, { icon: Icon, type, label }]) => (
            <ActionList.Item key={type} asChild>
              <Link to="/$activityType" params={{ activityType: type }}>
                <Icon />
                {pluralize(label)}
              </Link>
            </ActionList.Item>
          ))}
        </ActionList>
      </Inset>

      {!isEmpty(user?.permissions) && (
        <>
          <Inset side="x">
            <Separator size="4" my="4" />
          </Inset>
          <Heading as="h4" className={classes.sectionHeading}>
            Admin
          </Heading>
          <Inset side="x">
            <ActionList className={classes.items} variant="subtle">
              <ActionList.Item asChild>
                <Link to="/admin">
                  <DashboardIcon />
                  Dashboard
                </Link>
              </ActionList.Item>
              {hasPermission(Permission.Activities) && (
                <ActionList.Item asChild>
                  <Link to="/admin/timetable">
                    <CalendarIcon />
                    Timetable
                  </Link>
                </ActionList.Item>
              )}
              {hasPermission(Permission.Registrations) && (
                <ActionList.Item asChild>
                  <Link to="/admin/registrations">
                    <UsersIcon />
                    Registrations
                  </Link>
                </ActionList.Item>
              )}
              {hasPermission(Permission.Payments) && (
                <ActionList.Item asChild>
                  <Link to="/admin/payments">
                    <PaymentIcon />
                    Payments
                  </Link>
                </ActionList.Item>
              )}
            </ActionList>
          </Inset>
        </>
      )}
      <Inset side="x" style={{ order: 1 }}>
        <ActionList className={classes.items} variant="subtle">
          <ActionList.Item onClick={toggleTheme}>
            <ThemeIcon />
            Switch theme
          </ActionList.Item>
        </ActionList>
      </Inset>
    </Drawer.Content>
  );
};

export default NavigationMenu;
