import { Workshops } from '@/components/pages/Registration/Workshops';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const sessionSchema = z.object({
  session: z.string(),
});

export const Route = createFileRoute('/register/workshops/$slug')({
  component: Workshops,
  validateSearch: sessionSchema,
});
