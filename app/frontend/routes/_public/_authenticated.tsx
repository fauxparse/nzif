import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/_authenticated')({
  beforeLoad: async ({ location, context }) => {
    if (context?.auth?.user === null) {
      throw redirect({
        to: '/login',
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
        replace: true, // Necessary for the back button to work correctly
      });
    }
  },
});
