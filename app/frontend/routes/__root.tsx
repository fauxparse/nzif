import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import '@/styles/new/application.css';
import { AuthenticationContextType } from '@/services/Authentication';

import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { CurrentFestival, CurrentFestivalQuery, FestivalProvider } from '@/hooks/useFestival';

const Root = () => {
  const festival = Route.useLoaderData();

  return (
    <FestivalProvider festival={festival}>
      <Outlet />
      <TanStackRouterDevtools />
    </FestivalProvider>
  );
};

type RouterContext = {
  auth: AuthenticationContextType;
  client: ApolloClient<NormalizedCacheObject>;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
  loader: async ({ context: { client } }) => {
    const { data } = await client.query({ query: CurrentFestivalQuery });
    return data.festival as CurrentFestival;
  },
  staleTime: Infinity,
});
