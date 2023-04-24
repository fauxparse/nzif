import React, { forwardRef, useEffect } from 'react';
import clsx from 'clsx';
import { useDarkMode } from 'usehooks-ts';

import Button from '../Button';
import Icon from '../Icon';

import { ThemeSwitcherProps } from './ThemeSwitcher.types';

import './ThemeSwitcher.css';

export const ThemeSwitcher = forwardRef<HTMLButtonElement, ThemeSwitcherProps>(
  ({ className, ...props }, ref) => {
    const { isDarkMode, toggle } = useDarkMode();

    useEffect(() => {
      document.body.classList[isDarkMode ? 'add' : 'remove']('dark-theme');
      document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    return (
      <Button
        ghost
        ref={ref}
        className={clsx('theme-switcher', className)}
        title="Toggles light & dark"
        aria-label="auto"
        aria-live="polite"
        icon={
          <Icon className="sun-and-moon" aria-hidden="true">
            <mask className="moon" id="moon-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <circle cx="24" cy="10" r="6" fill="black" />
            </mask>
            <circle
              className="sun"
              cx="12"
              cy="12"
              r="6"
              mask="url(#moon-mask)"
              fill="currentColor"
            />
            <path
              className="sun-beams"
              d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M 1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            />
          </Icon>
        }
        {...props}
        onClick={toggle}
      />
    );
  }
);

ThemeSwitcher.displayName = 'ThemeSwitcher';

export default ThemeSwitcher;
