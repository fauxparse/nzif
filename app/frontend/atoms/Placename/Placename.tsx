import React, { ElementType, forwardRef } from 'react';
import clsx from 'clsx';

import Tooltip from '../../helpers/Tooltip';
import Icon from '../Icon';

import { PlacenameComponent } from './Placename.types';

import './Placename.css';

export const Placename: PlacenameComponent = forwardRef(
  ({ as, className, name, indigenousName, showIndigenousNameByDefault = true, ...props }, ref) => {
    const Component = (as || 'span') as ElementType;

    if (indigenousName) {
      return (
        <Tooltip content={showIndigenousNameByDefault ? name : indigenousName}>
          <Placename
            ref={ref}
            as={as}
            className={className}
            name={showIndigenousNameByDefault ? indigenousName : name}
            {...props}
          />
        </Tooltip>
      );
    }

    return (
      <Component ref={ref} className={clsx('placename', className)} {...props}>
        <Icon name="location" className="placename__icon" />
        <span className="placename__name">{name}</span>
      </Component>
    );
  }
);

Placename.displayName = 'Placename';

export default Placename;
