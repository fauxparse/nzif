import { Edit } from '@/components/pages/admin/ActivityEditor/Edit';
import { Text } from '@mantine/core';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';

const Component = () => {
  const { activity } = useLoaderData({ from: '/admin/$activityType/$slug' });

  if (!activity) return null;

  return <Edit activity={activity} />;
};

export const Route = createFileRoute('/admin/$activityType/$slug/')({
  component: Component,
  pendingComponent: () => <Text>Loading…</Text>,
});
