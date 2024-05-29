import { rootRouteId, useRouterState } from '@tanstack/react-router';
import { last } from 'lodash-es';
import { useMemo } from 'react';

type WithTitle<M, T = unknown> = M & {
  routeContext: {
    getTitle(data: T): string;
  };
  loaderData: T;
  pathname: string;
};

const useRoutesWithTitles = () => {
  const matches = useRouterState({ select: (state) => state.matches });

  type MatchedRoute = (typeof matches)[number];

  const hasTitle = (match: MatchedRoute): match is WithTitle<MatchedRoute> =>
    'getTitle' in match.routeContext;

  const routesWithTitles = matches.filter(hasTitle);

  return routesWithTitles;
};

export const useTitle = () => {
  const route = last(useRoutesWithTitles());

  return route ? route.routeContext.getTitle(route.loaderData) : 'NZIF';
};

const stripLastPathSegment = (pathname: string) => pathname.replace(/\/[^/]+$/, '');

export const useBreadcrumbs = (includeCurrent = false) => {
  const routesWithTitles = useRoutesWithTitles();

  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const isCurrentOrSibling = (route: (typeof routesWithTitles)[number]) =>
    route.pathname === pathname ||
    stripLastPathSegment(pathname) === stripLastPathSegment(route.pathname);

  const routes = useMemo(
    () => routesWithTitles.filter((route) => includeCurrent || !isCurrentOrSibling(route)),
    [routesWithTitles, includeCurrent, pathname]
  );

  return routes.map((route) => ({
    title: route.routeContext.getTitle(route.loaderData),
    pathname: route.pathname,
    link: {
      to: route.routeId === rootRouteId ? '/' : route.routeId.replace(/\/_[^/]+/g, ''),
      params: route.params,
    },
  }));
};

export default useRoutesWithTitles;
