import RouteTransition from '@/components/helpers/RouteTransition';
import Body from '@/components/organisms/Body';
import usePreviousDistinct from '@/hooks/usePreviousDistinct';
import { useMemo } from 'react';
import { Activity, Session } from './types';

import './ActivityEditor.css';
import { ActivityEditorHeader } from './Header';

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
      <Body>
        <RouteTransition routeKey={tabValue} direction={direction} />
      </Body>
    </>
  );
};
