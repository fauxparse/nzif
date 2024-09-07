import React from 'react';

import { Participants } from './Participants';
import classes from './WorkshopSession.module.css';
import { WorkshopSessionProvider } from './WorkshopSessionProvider';

type WorkshopSessionProps = {
  workshop: { slug: string };
  session: { id: string };
};

export const WorkshopSession: React.FC<WorkshopSessionProps> = ({
  workshop: { slug },
  session: { id: sessionId },
}) => {
  return (
    <WorkshopSessionProvider slug={slug} sessionId={sessionId}>
      <div className={classes.page}>
        <Participants />
      </div>
    </WorkshopSessionProvider>
  );
};
