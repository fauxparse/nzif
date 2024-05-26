import { TimetableEditor } from '@/components/organisms/TimetableEditor';
import { TimetableQuery } from '@/components/organisms/TimetableEditor/queries';
import { Permission } from '@/graphql/types';
import { RequirePermission } from '@/routes/admin';
import { useQuery } from '@apollo/client';
import { createFileRoute } from '@tanstack/react-router';

const Component: React.FC = () => {
  const { loading, data } = useQuery(TimetableQuery);

  return (
    <RequirePermission permission={Permission.Activities}>
      <TimetableEditor loading={loading} data={data} />
    </RequirePermission>
  );
};

export const Route = createFileRoute('/admin/activities/timetable')({
  component: Component,
});
