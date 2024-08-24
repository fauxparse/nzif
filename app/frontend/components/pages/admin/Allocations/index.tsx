import Header from '@/components/organisms/Header';
import { Flex, SegmentedControl, TabNav } from '@radix-ui/themes';
import { Link, Outlet, useParams } from '@tanstack/react-router';
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

  const { date } = useParams({ from: '/admin/allocations/$date' });

  return (
    <Flex justify="between">
      <TabNav.Root>
        {days.map(([d]) => (
          <TabNav.Link asChild key={d.toISODate()} active={d.equals(date)}>
            <Link to="/admin/allocations/$date" params={{ date: d }}>
              {d.plus({}).toFormat('EEEE d')}
            </Link>
          </TabNav.Link>
        ))}
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
