import { Calendar } from '@/components/pages/Calendar';
import { RegistrationProvider } from '@/services/Registration';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/_authenticated/calendar')({
  component: () => (
    <RegistrationProvider>
      <Calendar />
    </RegistrationProvider>
  ),
});
