import clsx from 'clsx';
import { Buttons } from '../Buttons';
import { Day } from './Day';
import { useWorkshopExplainer } from './useWorkshopExplainer';
import { useWorkshopPreferences } from './useWorkshopPreferences';

import registrationClasses from '../Registration.module.css';
import classes from './Workshops.module.css';

export const Workshops: React.FC = () => {
  const { days, loading, preferences, add, remove, getPosition } = useWorkshopPreferences();

  const Explainer = useWorkshopExplainer();

  return (
    <form
      className={clsx(registrationClasses.page, classes.workshopSelection)}
      data-full-width
      // onSubmit={(e) => {
      //   e.preventDefault();
      //   e.stopPropagation();
      //   form.handleSubmit();
      // }}
    >
      <div>
        {days.map((day) => (
          <Day
            key={day.date.toISODate()}
            date={day.date}
            workshops={day.workshops}
            onAdd={add}
            onRemove={remove}
            getPosition={getPosition}
          />
        ))}
      </div>

      <Explainer />
      <Buttons disabled />
    </form>
  );
};
