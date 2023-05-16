import { useParams } from 'react-router-dom';

import Breadcrumbs, { BreadcrumbProvider } from '@/molecules/Breadcrumbs';

const Person: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <BreadcrumbProvider label="People" url="/admin/people">
      <div className="page">
        <header className="page__header">
          <Breadcrumbs />
        </header>
      </div>
    </BreadcrumbProvider>
  );
};

export default Person;
