import CalendarIcon from '@/icons/CalendarIcon';
import { Flex, Heading, Section } from '@radix-ui/themes';
import { upperFirst } from 'lodash-es';
import { DateTime } from 'luxon';
import { Fragment } from 'react';
import { PERIODS, Period, Session } from './types';

import { Workshop } from './Workshop';
import classes from './Workshops.module.css';

type DayProps = {
  date: DateTime;
  workshops: Record<Period, Session[]>;
};

export const Day: React.FC<DayProps> = ({ date, workshops }) => (
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
              {workshops[period].map((session) => (
                <Workshop key={session.id} session={session} />
              ))}
            </div>
          </Flex>
        )}
      </Fragment>
    ))}
  </Section>
);
