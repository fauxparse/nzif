import React, { ElementType, forwardRef, useContext } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { Link } from 'react-router-dom';
import { FloatingPortal } from '@floating-ui/react';
import clsx from 'clsx';

import Button from '../Button';
import Icon from '../Icon';
import Tooltip from '@/helpers/Tooltip';
import Popover from '@/molecules/Popover';

import { PlacenameComponent } from './Placename.types';
import { PlacenameContext } from './PlacenameProvider';

import './Placename.css';

export const ABOUT_TRADITIONAL_PLACENAMES = `
Where possible, we are committed to honouring the traditional names of the land on
which we live and work. We recognise that these names may not be familiar to some
people.
`.replace(/\n/g, ' ');

const Placename: PlacenameComponent = forwardRef(
  ({ as, className, name, traditionalName, showTraditionalNameByDefault, ...props }, ref) => {
    const Component = (as || 'span') as ElementType;

    const { showTraditionalNameByDefault: defaultSetting, setShowTraditionalNameByDefault } =
      useContext(PlacenameContext);

    const showTraditional = showTraditionalNameByDefault ?? defaultSetting;

    const translated = name && traditionalName && name !== traditionalName;

    const displayName = translated && showTraditional ? traditionalName : name;

    const otherName = showTraditional ? name : traditionalName;

    const [reference, setReference] = React.useState<HTMLElement | null>(null);

    const [popupOpen, setPopupOpen] = React.useState(false);

    const changeSetting = () => {
      setShowTraditionalNameByDefault(!showTraditional);
      setPopupOpen(false);
    };

    return (
      <>
        <Component
          ref={mergeRefs([ref, setReference])}
          className={clsx('placename', className)}
          onClick={translated ? () => setPopupOpen((current) => !current) : undefined}
          {...props}
        >
          <Icon name="location" className="placename__icon" />
          {translated ? (
            <Tooltip content={`${otherName} (click for more)`} enabled={!popupOpen}>
              <span className="placename__name">{displayName}</span>
            </Tooltip>
          ) : (
            <span className="placename__name">{displayName}</span>
          )}
        </Component>
        <FloatingPortal>
          {reference && translated && (
            <Popover
              className="placename__popover"
              reference={reference}
              placement="bottom"
              open={popupOpen}
              onOpenChange={setPopupOpen}
            >
              <Popover.Body>
                <p>
                  <b>{traditionalName}</b> is the traditional name for the area also known as {name}
                  .
                </p>
                <p>{ABOUT_TRADITIONAL_PLACENAMES}</p>
                <Button
                  secondary
                  onClick={changeSetting}
                  text={`Show ${showTraditional ? 'English' : 'traditional'} names by default`}
                />
                <Button as={Link} to="/acknowledgements" ghost>
                  Learn more
                </Button>
              </Popover.Body>
            </Popover>
          )}
        </FloatingPortal>
      </>
    );
  }
);

Placename.displayName = 'Placename';

export default Placename;
