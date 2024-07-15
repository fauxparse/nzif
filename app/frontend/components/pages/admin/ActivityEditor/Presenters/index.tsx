import { Heading } from '@radix-ui/themes';
import { Activity, Presenter } from '../types';
import { PresenterDetails } from './PresenterDetails';
import { Search } from './Search';

import classes from './Presenters.module.css';

type PresentersProps = {
  title: string;
  activity: Activity;
  onAddPresenter: (presenter: Presenter) => void;
  onRemovePresenter: (presenter: Presenter) => void;
};

export const Presenters: React.FC<PresentersProps> = ({
  title,
  activity,
  onAddPresenter,
  onRemovePresenter,
}) => {
  return (
    <div className={classes.presenters}>
      <Heading as="h3" size="6">
        {title}
      </Heading>
      <Search existing={activity.presenters} onSelect={onAddPresenter} />
      {activity.presenters.map((presenter) => (
        <PresenterDetails key={presenter.id} presenter={presenter} onRemove={onRemovePresenter} />
      ))}
    </div>
  );
};
