import { Title } from '@mantine/core';
import { Presenter } from '../types';
import { PresenterDetails } from './PresenterDetails';
import { Search } from './Search';

import './Presenters.css';

type PresentersProps = {
  title: string;
  presenters: Presenter[];
  onAddPresenter: (presenter: Presenter) => void;
  onRemovePresenter: (presenter: Presenter) => void;
};

export const Presenters: React.FC<PresentersProps> = ({
  title,
  presenters,
  onAddPresenter,
  onRemovePresenter,
}) => {
  return (
    <div className="presenters">
      <Title order={3}>{title}</Title>
      <Search existing={presenters} onSelect={onAddPresenter} />
      {presenters.map((presenter) => (
        <PresenterDetails key={presenter.id} presenter={presenter} onRemove={onRemovePresenter} />
      ))}
    </div>
  );
};
