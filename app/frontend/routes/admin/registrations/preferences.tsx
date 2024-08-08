import { Spinner } from '@/components/atoms/Spinner';
import { WorkshopPreferencesChart } from '@/components/molecules/WorkshopPreferencesChart';
import { Dialog, VisuallyHidden } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

type ChartData = {
  id: string;
  name: string;
  counts: Record<`${number}`, number>;
}[];

export const Route = createFileRoute('/admin/registrations/preferences')({
  component: () => {
    const navigate = useNavigate();

    const { data, isFetching } = useQuery({
      queryKey: ['workshopPreferences'],
      queryFn: () => fetch('/charts/preferences.json').then((response) => response.json()),
    });

    const onOpenChange = (value = false) => {
      if (!value) {
        navigate({ to: '/admin/registrations', replace: true });
      }
    };

    return (
      <Dialog.Root open onOpenChange={onOpenChange}>
        <Dialog.Content size="4" maxWidth="calc(100vw - 2rem)">
          <VisuallyHidden>
            <Dialog.Title>Preferences</Dialog.Title>
            <Dialog.Description>Registered workshop preferences to date</Dialog.Description>
          </VisuallyHidden>

          {isFetching || !data ? <Spinner size="4" /> : <WorkshopPreferencesChart data={data} />}
        </Dialog.Content>
      </Dialog.Root>
    );
  },
});
