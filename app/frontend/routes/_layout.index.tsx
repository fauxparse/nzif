import { createFileRoute } from '@tanstack/react-router';

const Index = () => (
  <div>
    <h1>Welcome Home!</h1>
  </div>
);

export const Route = createFileRoute('/_layout/')({
  component: Index,
});
