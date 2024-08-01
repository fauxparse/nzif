import clsx from 'clsx';
import { Buttons } from '../Buttons';
import { Day } from './Day';
import { useWorkshopExplainer } from './useWorkshopExplainer';

import { useRegistration } from '@/services/Registration';
import { Button } from '@radix-ui/themes';
import registrationClasses from '../Registration.module.css';
import { WorkshopPreferences, usePreferences } from './WorkshopPreferencesProvider';
import classes from './Workshops.module.css';

export const Workshops: React.FC = () => {
  const { registration, loading: registrationLoading } = useRegistration();

  const { days } = usePreferences();

  const [Explainer, { show: showExplainer }] = useWorkshopExplainer();

  return (
    <form
      className={clsx(registrationClasses.page, classes.workshopSelection)}
      data-full-width
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        //   form.handleSubmit();
      }}
    >
      <div>
        <Button type="button" onClick={showExplainer}>
          More info
        </Button>
      </div>

      <div>
        {days.map((day) => (
          <Day key={day.date.toISODate()} date={day.date} workshops={day.workshops} />
        ))}
      </div>

      <Explainer />

      <WorkshopPreferences.Consumer>
        {({ dirty, loading }) => (
          <Buttons
            disabled={
              loading || registrationLoading || (!dirty && !!registration?.preferences.length)
            }
          />
        )}
      </WorkshopPreferences.Consumer>
    </form>
  );
};
