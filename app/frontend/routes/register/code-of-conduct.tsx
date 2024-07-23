import { CodeOfConduct } from '@/components/pages/Registration/CodeOfConduct';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/register/code-of-conduct')({
  component: CodeOfConduct,
});
