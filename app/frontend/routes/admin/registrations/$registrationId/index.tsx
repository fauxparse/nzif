import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/admin/registrations/$registrationId/')({
  component: () => {
    const navigate = useNavigate();
    useEffect(() => {
      navigate({ to: './workshops', from: '/admin/registrations/$registrationId/', replace: true });
    }, []);
  },
});
