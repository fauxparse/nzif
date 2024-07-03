import { useBreadcrumbs } from '@/hooks/useRoutesWithTitles';
import ChevronRightIcon from '@/icons/ChevronRightIcon';
import { Link } from '@tanstack/react-router';
import { Fragment } from 'react';

import classes from './Header.module.css';

const Breadcrumbs: React.FC = () => {
  const breadcrumbs = useBreadcrumbs();

  return (
    <div className={classes.breadcrumbs}>
      {breadcrumbs.map((crumb, index) => (
        <Fragment key={crumb.pathname}>
          {index > 0 && <ChevronRightIcon className={classes.icon} />}
          <Link {...crumb.link} className={classes.breadcrumb}>
            {crumb.title}
          </Link>
        </Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
