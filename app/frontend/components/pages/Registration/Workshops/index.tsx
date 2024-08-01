import clsx from 'clsx';
import { Buttons } from '../Buttons';
import { Day } from './Day';
import { useWorkshopExplainer } from './useWorkshopExplainer';

import registrationClasses from '../Registration.module.css';
import { WorkshopPreferencesProvider, usePreferences } from './WorkshopPreferencesProvider';
import classes from './Workshops.module.css';

export const Workshops: React.FC = () => {
  const Explainer = useWorkshopExplainer();

  return (
    <WorkshopPreferencesProvider>
      <form
        className={clsx(registrationClasses.page, classes.workshopSelection)}
        data-full-width
        // onSubmit={(e) => {
        //   e.preventDefault();
        //   e.stopPropagation();
        //   form.handleSubmit();
        // }}
      >
        <Days />
        <Explainer />
        <Buttons disabled />
      </form>
    </WorkshopPreferencesProvider>
  );
};

const Days = () => {
  const { days, add, remove, getPosition } = usePreferences();

  return (
    <div>
      {days.map((day) => (
        <Day key={day.date.toISODate()} date={day.date} workshops={day.workshops} />
      ))}
    </div>
  );
};
