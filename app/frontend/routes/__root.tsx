import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import '@/styles/new/application.css';
import { AuthenticationContextType } from '@/services/Authentication';

import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { CurrentFestival, CurrentFestivalQuery, FestivalProvider } from '@/hooks/useFestival';
import useTheme from '@/hooks/useTheme';
import { useEffect } from 'react';

const Root = () => {
  const { festival } = Route.useRouteContext();

  const { theme } = useTheme();

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <FestivalProvider festival={festival}>
      <Outlet />
      <TanStackRouterDevtools />
    </FestivalProvider>
  );
};

export type RouterContext = {
  auth: AuthenticationContextType;
  client: ApolloClient<NormalizedCacheObject>;
  festival: CurrentFestival;
  year: string;
  getTitle?: (data: unknown) => string;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }) => {
    const { data } = await context.client.query({ query: CurrentFestivalQuery });
    return {
      festival: data.festival as CurrentFestival,
      year: String(data.festival.id),
      getTitle: () => `NZIF ${data.festival.id}`,
    };
  },
  component: Root,
  staleTime: Infinity,
});
