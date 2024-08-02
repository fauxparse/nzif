import { RouterContext } from '@/RouterContext';
import { NotFound } from '@/components/pages/NotFound';
import type { CurrentFestival } from '@/hooks/useFestival';
import { CurrentFestivalQuery, FestivalProvider } from '@/hooks/useFestival';
import { PlacenamesProvider } from '@/services/Placenames';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Suspense } from 'react';

const Root = () => {
  const { festival } = Route.useRouteContext();

  return (
    <PlacenamesProvider>
      <FestivalProvider festival={festival}>
        <Outlet />
        <Suspense fallback={null}>{import.meta.env.DEV && <TanStackRouterDevtools />}</Suspense>
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
