import { Title } from '@mantine/core';
import { Presenter } from '../types';
import { Search } from './Search';

import './Presenters.css';
import { PresenterDetails } from './PresenterDetails';

type PresentersProps = {
  title: string;
  presenters: Presenter[];
  onAddPresenter: (presenter: Presenter) => void;
  onUpdatePresenter: (presenter: Presenter) => void;
  onRemovePresenter: (presenter: Presenter) => void;
};

export const Presenters: React.FC<PresentersProps> = ({
  title,
  presenters,
  onAddPresenter,
  onUpdatePresenter,
  onRemovePresenter,
}) => {
  return (
    <div className="presenters">
      <Title order={3}>{title}</Title>
      <Search existing={presenters} onSelect={onAddPresenter} />
      {presenters.map((presenter) => (
        <PresenterDetails
          key={presenter.id}
          presenter={presenter}
          onChange={console.log}
          onRemove={console.log}
        />
      ))}
    </div>
  );
};
