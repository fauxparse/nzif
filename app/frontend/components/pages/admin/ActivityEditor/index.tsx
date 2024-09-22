import usePreviousDistinct from '@/hooks/usePreviousDistinct';
import { Outlet } from '@tanstack/react-router';
import { useMemo } from 'react';
import { ActivityEditorHeader } from './Header';
import { Activity, Session } from './types';

type ActivityEditorProps = {
  activity: Activity;
  session: Session | null;
  loading?: boolean;
};

export const ActivityEditor: React.FC<ActivityEditorProps> = ({
  activity,
  session,
  loading = false,
}) => {
  const tabIds = useMemo(
    () => ['edit', ...activity.sessions.map((session) => session.startsAt.toISODate() ?? '')],
    [activity.sessions]
  );

  const tabValue = session?.startsAt?.toISODate() ?? 'edit';

  const tabValueWas = usePreviousDistinct(tabValue);

  const direction = useMemo(
    () => (tabIds.indexOf(tabValue) < tabIds.indexOf(tabValueWas || '') ? 'right' : 'left'),
    [tabValue, tabValueWas, tabIds]
  );

  return (
    <>
      <ActivityEditorHeader activity={activity} session={session} loading={loading} />
      <Outlet />
    </>
  );
};
