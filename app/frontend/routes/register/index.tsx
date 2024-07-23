import { useRegistration } from '@/services/Registration';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/register/')({
  component: () => {
    const navigate = useNavigate();
    const { defaultNextStep, loading } = useRegistration();

    useEffect(() => {
      if (loading) return;
      navigate({ to: `/register/${defaultNextStep}` });
    }, [navigate, defaultNextStep]);

    return null;
  },
});
