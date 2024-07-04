import ActivityTypeTabs from '@/components/molecules/ActivityTypeTabs';
import Body from '@/components/organisms/Body';
import Header from '@/components/organisms/Header';
import { ACTIVITY_TYPES } from '@/constants/activityTypes';
import { ActivityType } from '@/graphql/types';
import usePreviousDistinct from '@/hooks/usePreviousDistinct';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AnimatePresence } from 'framer-motion';
import { Component } from './_list.index';

const keys = Object.values(ACTIVITY_TYPES).map(({ type }) => type);

export const Route = createFileRoute('/_public/$activityType/_list')({
  component: () => {
    const activityType = Route.useParams().activityType as ActivityType;
    const navigate = useNavigate();

    const activityTypeWas = usePreviousDistinct(activityType);

    const direction =
      !!activityTypeWas && keys.indexOf(activityType) < keys.indexOf(activityTypeWas)
        ? 'right'
        : 'left';

    return (
      <>
        <Header
          title="Festival programme"
          tabs={
            <ActivityTypeTabs
              value={activityType}
              onChange={(value) => {
                if (!value) return;
                navigate({
                  to: '/$activityType',
                  params: { activityType: value },
                });
              }}
            />
          }
        />
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <Body key={activityType} direction={direction}>
            <Component activityType={activityType} />
          </Body>
        </AnimatePresence>
      </>
    );
  },
});
