import React, { ElementType, forwardRef, useContext } from 'react';
import clsx from 'clsx';

import Tooltip from '../../helpers/Tooltip';
import Icon from '../Icon';

import { PlacenameComponent } from './Placename.types';
import { PlacenameContext } from './PlacenameProvider';

import './Placename.css';

export const Placename: PlacenameComponent = forwardRef(
  ({ as, className, name, indigenousName, showIndigenousNameByDefault, ...props }, ref) => {
    const Component = (as || 'span') as ElementType;

    const { showIndigenousNameByDefault: defaultSetting } = useContext(PlacenameContext);

    const indigenousByDefault = showIndigenousNameByDefault ?? defaultSetting;

    if (indigenousName) {
      return (
        <Tooltip content={indigenousByDefault ? name : indigenousName}>
          <Placename
            ref={ref}
            as={as}
            className={className}
            name={indigenousByDefault ? indigenousName : name}
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
