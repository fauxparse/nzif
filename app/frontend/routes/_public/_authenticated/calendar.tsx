import { Calendar } from '@/components/pages/Calendar';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/_authenticated/calendar')({
  component: Calendar,
});
