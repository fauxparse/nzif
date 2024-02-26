import MenuIcon from '@/icons/MenuIcon';
import { createFileRoute } from '@tanstack/react-router';

const Index = () => (
  <div className="container">
    <h1>Welcome Home!</h1>
    <MenuIcon />
  </div>
);

export const Route = createFileRoute('/_layout/')({
  component: Index,
});
