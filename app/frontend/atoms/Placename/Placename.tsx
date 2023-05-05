import React, { ElementType, forwardRef, useContext } from 'react';
import clsx from 'clsx';

import Icon from '../Icon';
import Tooltip from '@/helpers/Tooltip';

import { PlacenameComponent } from './Placename.types';
import { PlacenameContext } from './PlacenameProvider';

import './Placename.css';

const Placename: PlacenameComponent = forwardRef(
  ({ as, className, name, traditionalName, showTraditionalNameByDefault, ...props }, ref) => {
    const Component = (as || 'span') as ElementType;

    const { showTraditionalNameByDefault: defaultSetting } = useContext(PlacenameContext);

    const traditionalByDefault = showTraditionalNameByDefault ?? defaultSetting;

    if (traditionalName) {
      return (
        <Tooltip content={traditionalByDefault ? name : traditionalName}>
          <Placename
            ref={ref}
            as={as}
            className={className}
            name={traditionalByDefault ? traditionalName : name}
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
