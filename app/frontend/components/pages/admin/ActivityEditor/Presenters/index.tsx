import { Title } from '@mantine/core';
import { Activity, Presenter } from '../types';
import { PresenterDetails } from './PresenterDetails';

import './Presenters.css';
import { Search } from './Search';

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
    <div className="presenters">
      <Title order={3}>{title}</Title>
      <Search existing={activity.presenters} onSelect={onAddPresenter} />
      {activity.presenters.map((presenter) => (
        <PresenterDetails key={presenter.id} presenter={presenter} onRemove={onRemovePresenter} />
      ))}
    </div>
  );
};
