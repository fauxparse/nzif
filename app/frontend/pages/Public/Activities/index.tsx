import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { AnimatePresence, motion } from 'framer-motion';
import { range } from 'lodash-es';
import { DateTime } from 'luxon';
import pluralize from 'pluralize';

import { ActivityType, useProgrammeQuery } from '@/graphql/types';
import usePrevious from '@/hooks/usePrevious';
import Breadcrumbs from '@/molecules/Breadcrumbs';
import PageHeader from '@/molecules/PageHeader';
import Tabs from '@/molecules/Tabs';
import { pageVariants } from '@/pages/variants';
import { ROUTES } from '@/Routes';
import activityFactory from '@/tests/factories/Activity';
import activityTypeLabel from '@/util/activityTypeLabel';

import List from './List';

import './Activities.css';

const TABS: [ActivityType, string][] = [
  [ActivityType.Workshop, 'workshops'],
  [ActivityType.Show, 'shows'],
];

export const Component: React.FC = () => {
  const { year, type: pluralizedType } = useTypedParams(ROUTES.FESTIVAL.ACTIVITIES);

  const type = TABS.find(([, t]) => t === pluralizedType)?.[0] ?? ActivityType.Workshop;

  const { loading, data } = useProgrammeQuery({
    variables: { year, type },
  });

  const index = TABS.findIndex(([, t]) => pluralizedType === t);

  const previousIndex = usePrevious(index) ?? 0;

  const direction = previousIndex > index ? 1 : -1;

  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const timeout = setTimeout(() => setAnimating(false), 350);
    return () => clearTimeout(timeout);
  }, [type]);

  const activities = useMemo(() => {
    if (loading) {
      const factory =
        type === ActivityType.Show ? activityFactory.show() : activityFactory.workshop();
      return range(5).flatMap((days) => {
        const startsAt = DateTime.now().startOf('day').plus({ days, hours: 10 });
        const endsAt = startsAt.plus({ hours: 3 });
        return factory.scheduled({ startsAt, endsAt }).buildList(3);
      });
    }
    return data?.festival?.activities || [];
  }, [loading, data, type]);

  return (
    <div className="activities">
      <PageHeader>
        <Breadcrumbs />
        <h1>Festival programme</h1>
        <Tabs>
          {TABS.map(([type, slug]) => (
            <Tabs.Tab
              key={type}
              as={Link}
              to={ROUTES.FESTIVAL.ACTIVITIES.buildPath({
                year,
                type: slug,
              })}
              text={pluralize(activityTypeLabel(type))}
              selected={pluralizedType === slug}
            />
          ))}
        </Tabs>
      </PageHeader>
      <AnimatePresence initial={false} mode="popLayout" custom={direction}>
        <motion.div
          key={type}
          custom={direction}
          variants={pageVariants}
          initial="from"
          animate="in"
          exit="to"
        >
          <List loading={loading || animating} activities={activities} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
