import { useAuthentication } from '@/services/Authentication';
import { Navigate, Outlet, createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/logout')({
  beforeLoad: async ({ context }) => {
    await context.auth.logOut();
    throw redirect({
      to: '/',
      replace: true,
    });
  },
});
