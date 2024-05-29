import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/$activityType/')({
  component: () => <div>Hello /admin/$activityType/!</div>,
});
