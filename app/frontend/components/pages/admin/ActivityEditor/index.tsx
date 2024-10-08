import { ActivityType } from '@/graphql/types';
import { Outlet } from '@tanstack/react-router';
import { ActivityEditorHeader } from './Header';
import { Activity, Tab } from './types';

type ActivityEditorProps = {
  activity: Activity;
  loading?: boolean;
  tab?: Tab;
};

export const ActivityEditor: React.FC<ActivityEditorProps> = ({
  activity,
  loading = false,
  tab = 'details',
}) => {
  const hasShow = activity.type === ActivityType.Workshop && 'show' in activity;

  return (
    <>
      <ActivityEditorHeader activity={activity} tab={tab} loading={loading} />
      <Outlet />
    </>
  );
};
