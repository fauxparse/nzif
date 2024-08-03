import { ActivityCard } from '@/components/molecules/ActivityCard';
import CalendarIcon from '@/icons/CalendarIcon';
import PlusIcon from '@/icons/PlusIcon';
import { Flex, Heading, IconButton, Section } from '@radix-ui/themes';
import { upperFirst } from 'lodash-es';
import { DateTime } from 'luxon';
import { Fragment } from 'react';
import { usePreferences } from './WorkshopPreferencesProvider';
import { PERIODS, Period, Session } from './types';

import classes from './Workshops.module.css';

type DayProps = {
  date: DateTime;
  workshops: Record<Period, Session[]>;
};

export const Day: React.FC<DayProps> = ({ date, workshops }) => {
  const { add, remove, getPosition } = usePreferences();

  return (
    <Section className={classes.day}>
      <Heading as="h3" className={classes.date}>
        <CalendarIcon size="3" />
        {date.toFormat('cccc, LLLL d')}
      </Heading>
      {PERIODS.map((period) => (
        <Fragment key={period}>
          {workshops[period].length > 0 && (
            <Flex className={classes.period}>
              <Heading as="h4" className={classes.periodName}>
                <span>{upperFirst(period.replaceAll('-', ' '))}</span>
              </Heading>
              <div className={classes.workshops}>
                {workshops[period].map((session) => {
                  const position = getPosition(session);
                  return (
                    <ActivityCard
                      key={session.id}
                      className={classes.card}
                      activity={session.workshop}
                      linkProps={{
                        to: '/register/workshops/$slug',
                        params: { slug: session.workshop.slug },
                        search: { session: session.id },
                        replace: true,
                      }}
                    >
                      <IconButton
                        type="button"
                        variant={position ? 'solid' : 'surface'}
                        radius="full"
                        className={classes.preference}
                        onClick={() => (position ? remove : add)(session)}
                      >
                        {position ?? <PlusIcon />}
                      </IconButton>
                    </ActivityCard>
                  );
                })}
              </div>
            </Flex>
          )}
        </Fragment>
      ))}
    </Section>
  );
};
