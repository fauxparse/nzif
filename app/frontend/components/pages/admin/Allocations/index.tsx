import Header from '@/components/organisms/Header';
import { Flex, SegmentedControl, TabNav } from '@radix-ui/themes';
import { Link, Outlet, useChildMatches } from '@tanstack/react-router';
import { get } from 'lodash-es';
import { DateTime } from 'luxon';
import { AllocationsProvider, useAllocations } from './AllocationsProvider';

export const Allocations: React.FC = () => {
  return (
    <AllocationsProvider>
      <Header title="Workshop allocation" tabs={<DateTabs />} />
      <Outlet />
    </AllocationsProvider>
  );
};

const DateTabs = () => {
  const { days } = useAllocations();

  const childMatches = useChildMatches();
  const dateMatch = childMatches.find((m) => m.routeId === '/admin/allocations/$date');
  const allMatch = childMatches.find((m) => m.routeId === '/admin/allocations/all');

  const date = dateMatch ? (get(dateMatch.params, 'date') as unknown as DateTime) : null;

  return (
    <Flex justify="between">
      <TabNav.Root>
        {days.map(([d]) => (
          <TabNav.Link asChild key={d.toISODate()} active={!!date && d.equals(date)}>
            <Link to="/admin/allocations/$date" params={{ date: d }}>
              {d.plus({}).toFormat('EEEE d')}
            </Link>
          </TabNav.Link>
        ))}
        <TabNav.Link asChild active={!!allMatch}>
          <Link to="/admin/allocations/all">Everybody</Link>
        </TabNav.Link>
      </TabNav.Root>
      <SortConfig />
    </Flex>
  );
};

const SortConfig = () => {
  const { sort, setSort } = useAllocations();

  return (
    <SegmentedControl.Root
      defaultValue="name"
      onValueChange={(v) => setSort(v as 'name' | 'score')}
    >
      <SegmentedControl.Item value="name">By name</SegmentedControl.Item>
      <SegmentedControl.Item value="score">By score</SegmentedControl.Item>
    </SegmentedControl.Root>
  );
};
