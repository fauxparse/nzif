import type { RouterContext } from '@/RouterContext';
import { routeTree } from '@/routeTree.gen';
import type { AuthenticatedUser, AuthenticationContextType } from '@/services/Authentication';
import { ApolloClient, ApolloLink, InMemoryCache, Observable } from '@apollo/client';
import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const user: AuthenticatedUser = {
  id: '1',
  email: 'test@example.com',
  permissions: [],
  profile: { id: '1', name: 'Test User', picture: null },
};

const auth = (user: AuthenticatedUser | null): AuthenticationContextType => ({
  user,
  loading: false,
  error: null,
  logIn: () => Promise.resolve({}),
  signUp: () => Promise.resolve({}),
  logOut: () => Promise.resolve({}),
  requestPasswordReset: () => Promise.resolve(null),
  resetPassword: () => Promise.resolve({}),
  hasPermission: () => false,
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new ApolloLink(() =>
    Observable.of({
      data: {
        festival: {
          __typename: 'Festival',
          id: '2026',
          startDate: '2026-10-01',
          endDate: '2026-10-10',
        },
      },
    })
  ),
});

const setupRouter = (path: string) => {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
    context: { auth: auth(null), client } as RouterContext,
  });
  // Mirrors <RouterProvider>'s Transitioner, which loads matches on every history change
  router.history.subscribe(router.load);

  // Mirrors what <RouterProvider context={…}> does when the auth context re-renders
  const setAuth = (user: AuthenticatedUser | null) =>
    router.update({
      ...router.options,
      context: { ...router.options.context, auth: auth(user) },
    });

  // Real clicks are spaced out: background reloads of reused matches finish, and time passes.
  // Without that, the router treats a match updated in the same millisecond as fresh and
  // freezes its context exactly like the bug under test, failing spuriously.
  const navigate = async (to: '/' | '/login' | '/profile') => {
    await router.navigate({ to });
    await Promise.all(
      router.state.matches
        .filter((match) => match.isFetching === 'loader')
        .map((match) => match.loadPromise)
    );
    vi.setSystemTime(Date.now() + 1000);
  };

  return { router, setAuth, navigate };
};

describe('authenticated routes', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('are reachable after logging in without a page reload', async () => {
    const { router, setAuth, navigate } = setupRouter('/');
    await router.load();
    await navigate('/login');

    setAuth(user);
    await navigate('/');
    await navigate('/profile');

    expect(router.state.location.pathname).toBe('/profile');
  });

  it('redirect to login after logging out without a page reload', async () => {
    const { router, setAuth, navigate } = setupRouter('/login');
    await router.load();

    setAuth(user);
    await navigate('/');
    await navigate('/profile');

    setAuth(null);
    await navigate('/');
    await navigate('/profile');

    expect(router.state.location.pathname).toBe('/login');
  });
});
