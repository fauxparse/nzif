import type { CurrentFestival } from '@/hooks/useFestival';
import { CurrentFestivalQuery, FestivalProvider } from '@/hooks/useFestival';
import type { AuthenticationContextType } from '@/services/Authentication';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { useMantineColorScheme } from '@mantine/core';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Suspense, useEffect } from 'react';

import '@/styles/new/application.css';

const Root = () => {
  const { festival } = Route.useRouteContext();

  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    document.body.setAttribute('data-theme', colorScheme);
  }, [colorScheme]);

  return (
    <FestivalProvider festival={festival}>
      <Outlet />
      <Suspense fallback={null}>
        <TanStackRouterDevtools />
      </Suspense>
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
