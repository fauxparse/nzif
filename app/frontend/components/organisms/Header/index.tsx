import Scrollable from '@/components/helpers/Scrollable';
import BlurrableImage from '@/components/molecules/BlurrableImage';
import { useTitle } from '@/hooks/useRoutesWithTitles';
import { Heading } from '@radix-ui/themes';
import clsx from 'clsx';
import { debounce, isString } from 'lodash-es';
import { ComponentPropsWithoutRef, ReactNode, forwardRef, useEffect, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import Breadcrumbs from './Breadcrumbs';

import classes from './Header.module.css';

type HeaderSlot = ReactNode | false;

type BaseHeaderProps = {
  breadcrumbs?: HeaderSlot;
  actions?: HeaderSlot;
  title?: HeaderSlot;
  children?: HeaderSlot;
  tabs?: HeaderSlot;
  background?: {
    src: string;
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
      children = false,
      tabs = false,
      background,
      className,
      ...props
    },
    ref
  ) => {
    const ownRef = useRef<HTMLElement>(null);

    useEffect(() => {
      const header = ownRef.current;

      if (!header) return;

      const resizeObserver = new ResizeObserver(
        debounce(
          () => {
            header.style.setProperty('--header-height', `${header.offsetHeight}px`);
          },
          100,
          { trailing: true }
        )
      );

      resizeObserver.observe(header);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    return (
      <header ref={mergeRefs([ref, ownRef])} className={clsx(classes.header, className)} {...props}>
        {background && (
          <BlurrableImage
            className={classes.background}
            src={background.src}
            blurhash={background.blurhash}
          />
        )}
        <div className={classes.container}>
          {(breadcrumbs || actions) && (
            <div className={classes.topOuter}>
              <div className={classes.top}>
                {breadcrumbs}
                <div className={classes.actions}>{actions}</div>
              </div>
            </div>
          )}
          {(title || children) && (
            <div className={classes.title}>
              {isString(title) ? <Heading as="h1">{title}</Heading> : title}
              {children}
            </div>
          )}
          {tabs && (
            <Scrollable className={classes.bottomOuter} orientation="horizontal">
              <div className={classes.bottom}>
                <div className={classes.tabs}>{tabs}</div>
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
