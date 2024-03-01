import {
  ComponentProps,
  ComponentPropsWithoutRef,
  ReactNode,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import Breadcrumbs from './Breadcrumbs';

import './Header.css';
import { debounce, isString } from 'lodash-es';
import { useTitle } from '@/hooks/useRoutesWithTitles';
import Scrollable from '../Scrollable';
import { mergeRefs } from 'react-merge-refs';
import { ImageProps } from '@mantine/core';
import BlurrableImage from '../BlurrableImage';
import clsx from 'clsx';

type HeaderSlot = ReactNode | false;

type BaseHeaderProps = {
  breadcrumbs?: HeaderSlot;
  actions?: HeaderSlot;
  title?: HeaderSlot;
  tabs?: HeaderSlot;
  background?: {
    src: ImageProps['src'];
    blurhash: string;
  };
};

type HeaderProps = Omit<ComponentPropsWithoutRef<'header'>, keyof BaseHeaderProps> &
  BaseHeaderProps;

const Header = forwardRef<HTMLElement, HeaderProps>(
  (
    {
      title = <DefaultTitle />,
      breadcrumbs = <Breadcrumbs />,
      actions = false,
      tabs = false,
      background,
      className,
      ...props
    },
    ref
  ) => {
    const ownRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (!ownRef.current) return;

      const resizeObserver = new ResizeObserver(
        debounce(
          (entries) => {
            const el = entries[0].target as HTMLElement;
            el.style.setProperty('--header-height', `${entries[0].contentRect.height}px`);
          },
          100,
          { trailing: true }
        )
      );

      resizeObserver.observe(ownRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    return (
      <header ref={mergeRefs([ref, ownRef])} className={clsx('header', className)} {...props}>
        {background && (
          <BlurrableImage
            className="header__background"
            src={background.src}
            blurhash={background.blurhash}
          />
        )}
        <div className="container">
          {(breadcrumbs || actions) && (
            <div className="header__top-outer">
              <div className="header__top">
                <div className="header__breadcrumbs">{breadcrumbs}</div>
                <div className="header__actions">{actions}</div>
              </div>
            </div>
          )}
          {title && (
            <div className="header__title">{isString(title) ? <h1>{title}</h1> : title}</div>
          )}
          {tabs && (
            <Scrollable className="header__bottom-outer" orientation="horizontal">
              <div className="header__bottom">
                <div className="header__tabs">{tabs}</div>
              </div>
            </Scrollable>
          )}
        </div>
      </header>
    );
  }
);

const DefaultTitle = () => {
  const title = useTitle();
  return <h1>{title}</h1>;
};

export default Header;
