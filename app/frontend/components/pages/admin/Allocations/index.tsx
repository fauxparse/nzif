import Header from '@/components/organisms/Header';
import SettingsIcon from '@/icons/SettingsIcon';
import { Badge, DropdownMenu, Flex, Heading, IconButton, TabNav, Text } from '@radix-ui/themes';
import { Link, Outlet, useChildMatches } from '@tanstack/react-router';
import { get } from 'lodash-es';
import { DateTime } from 'luxon';
import { AllocationsProvider, useAllocations } from './AllocationsProvider';

import RedoIcon from '@/icons/RedoIcon';
import UndoIcon from '@/icons/UndoIcon';
import WarningIcon from '@/icons/WarningIcon';
import styles from './Allocations.module.css';

export const Allocations: React.FC = () => {
  return (
    <AllocationsProvider>
      <Header
        className={styles.header}
        title={<Title />}
        actions={<Actions />}
        tabs={<DateTabs />}
      />
      <Outlet />
    </AllocationsProvider>
  );
};

const Title = () => {
  const { overallScore } = useAllocations();

  return (
    <Flex justify="between" align="center" gap="4">
      <Heading>Workshop allocations</Heading>
      <Badge size="3" color="gray" variant="outline">
        <Text size="6">{overallScore}% satisfaction</Text>
      </Badge>
    </Flex>
  );
};

const Actions = () => {
  const { canUndo, canRedo, undo, redo } = useAllocations();

  return (
    <Flex gap="4">
      <IconButton
        size="3"
        variant="ghost"
        radius="full"
        color="gray"
        disabled={!canUndo}
        onClick={undo}
      >
        <UndoIcon />
      </IconButton>
      <IconButton
        size="3"
        variant="ghost"
        radius="full"
        color="gray"
        disabled={!canRedo}
        onClick={redo}
      >
        <RedoIcon />
      </IconButton>
      <SettingsMenu />
    </Flex>
  );
};

const DateTabs = () => {
  const { loading, days, notYetAllocated, hasOverloadedSessions } = useAllocations();

  const childMatches = useChildMatches();
  const dateMatch = childMatches.find((m) => m.routeId === '/admin/allocations/$date');
  const allMatch = childMatches.find((m) => m.routeId === '/admin/allocations/all');

  const date = dateMatch ? (get(dateMatch.params, 'date') as unknown as DateTime) : null;

  if (loading || notYetAllocated) return null;

  return (
    <Flex justify="between">
      <TabNav.Root>
        {days.map(([d]) => (
          <TabNav.Link asChild key={d.toISODate()} active={!!date && d.equals(date)}>
            <Link to="/admin/allocations/$date" params={{ date: d }}>
              <Flex gap="2" align="center">
                <span>{d.plus({}).toFormat('EEEE d')}</span>
                {hasOverloadedSessions(d) && <WarningIcon size="1" color="red" />}
              </Flex>
            </Link>
          </TabNav.Link>
        ))}
        <TabNav.Link asChild active={!!allMatch}>
          <Link to="/admin/allocations/all">
            <span>Everybody</span>
          </Link>
        </TabNav.Link>
      </TabNav.Root>
    </Flex>
  );
};

const SettingsMenu = () => {
  const { sort, setSort, regenerate } = useAllocations();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton size="3" variant="ghost" radius="full" color="gray">
          <SettingsIcon />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onSelect={regenerate}>Re-run algorithm</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Label>Sort by</DropdownMenu.Label>
        <DropdownMenu.RadioGroup value={sort} onValueChange={(v) => setSort(v as 'name' | 'score')}>
          <DropdownMenu.RadioItem value="name">Name</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="score">Score</DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
