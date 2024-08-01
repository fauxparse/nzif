import { ActivityCard } from '@/components/molecules/ActivityCard';
import { Button, Flex, Heading, Section } from '@radix-ui/themes';
import { upperFirst } from 'lodash-es';
import { DateTime } from 'luxon';
import { Fragment } from 'react';
import { PERIODS, Period, Session } from './types';

import CalendarIcon from '@/icons/CalendarIcon';
import classes from './Workshops.module.css';

type DayProps = {
  date: DateTime;
  workshops: Record<Period, Session[]>;
  onAdd: (session: Session) => void;
  onRemove: (session: Session) => void;
  getPosition: (session: Session) => number | undefined;
};

export const Day: React.FC<DayProps> = ({ date, workshops, onAdd, onRemove, getPosition }) => {
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
                    <ActivityCard key={session.id} activity={session.workshop}>
                      {position ? (
                        <Button type="button" onClick={() => onRemove(session)}>
                          {position}
                        </Button>
                      ) : (
                        <Button type="button" onClick={() => onAdd(session)}>
                          Add
                        </Button>
                      )}
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
