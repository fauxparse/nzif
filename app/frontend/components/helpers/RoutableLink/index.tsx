import { Link, LinkProps, useRouter } from '@tanstack/react-router';
import { isFunction } from 'lodash-es';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

export const RoutableLink = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<typeof Link>>(
  ({ to = '', params, search, state, children, ...props }, ref) => {
    const router = useRouter();

    if (router) {
      return (
        <Link ref={ref} to={to} params={params} search={search} state={state} {...props}>
          {children}
        </Link>
      );
    }

    return (
      <a
        ref={ref}
        href={to.replaceAll(
          /\$([^/]+)/g,
          (_, match) => (params?.[match as keyof LinkProps['params']] || '') as string
        )}
        {...(props as ComponentPropsWithoutRef<'a'>)}
      >
        {isFunction(children) ? children({ isActive: false, isTransitioning: false }) : children}
      </a>
    );
  }
);
