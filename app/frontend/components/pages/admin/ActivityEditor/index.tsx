import { ActivityType } from '@/graphql/types';
import { Outlet } from '@tanstack/react-router';
import { ActivityEditorHeader } from './Header';
import { Activity, Session } from './types';

type ActivityEditorProps = {
  activity: Activity;
  session: Session | null;
  loading?: boolean;
  show?: boolean;
};

export const ActivityEditor: React.FC<ActivityEditorProps> = ({
  activity,
  session,
  loading = false,
  show: isShow = false,
}) => {
  const hasShow = activity.type === ActivityType.Workshop && 'show' in activity;

  const show = (isShow && hasShow && activity.show) || null;

  return (
    <>
      <ActivityEditorHeader activity={activity} session={session} show={show} loading={loading} />
      <Outlet />
    </>
  );
};
