import { RouterContext } from '@/RouterContext';
import { NotFound } from '@/components/pages/NotFound';
import type { CurrentFestival } from '@/hooks/useFestival';
import { CurrentFestivalQuery, FestivalProvider } from '@/hooks/useFestival';
import { PlacenamesProvider } from '@/services/Placenames';
import { useMantineColorScheme } from '@mantine/core';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Suspense, useEffect } from 'react';

const Root = () => {
  const { festival } = Route.useRouteContext();

  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    document.body.setAttribute('data-theme', colorScheme);
  }, [colorScheme]);

  return (
    <PlacenamesProvider>
      <FestivalProvider festival={festival}>
        <Outlet />
        <Suspense fallback={null}>
          <TanStackRouterDevtools />
        </Suspense>
      </FestivalProvider>
    </PlacenamesProvider>
  );
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
  errorComponent: NotFound,
});
