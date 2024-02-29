import { useBreadcrumbs } from '@/hooks/useRoutesWithTitles';
import ChevronRightIcon from '@/icons/ChevronRightIcon';
import { Link } from '@tanstack/react-router';
import { Fragment } from 'react';

const Breadcrumbs: React.FC = () => {
  const breadcrumbs = useBreadcrumbs();
  return (
    <div className="page-header__breadcrumbs">
      {breadcrumbs.map((crumb, index) => (
        <Fragment key={crumb.pathname}>
          {index > 0 && <ChevronRightIcon />}
          <Link {...crumb.link}>{crumb.title}</Link>
        </Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
