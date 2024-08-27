import { Spinner } from '@/components/atoms/Spinner';
import { useAllocations } from '@/components/pages/admin/Allocations/AllocationsProvider';
import { Grid } from '@radix-ui/themes';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/admin/allocations/')({
  component: () => {
    const { loading, days } = useAllocations();

    const navigate = useNavigate();

    useEffect(() => {
      if (!loading && days.length > 0) {
        navigate({ to: '/admin/allocations/$date', params: { date: days[0][0] }, replace: true });
      }
    }, [loading, days, navigate]);

    return (
      <Grid justify="center" align="center" style={{ gridColumn: 'main' }}>
        <Spinner size="4" mx="auto" />
      </Grid>
    );
  },
});
