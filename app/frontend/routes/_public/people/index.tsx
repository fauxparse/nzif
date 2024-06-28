import { People } from '@/components/pages/People/People';
import { AllPresentersQuery } from '@/components/pages/People/queries';
import { FestivalPresenter } from '@/components/pages/People/types';
import { useQuery } from '@apollo/client';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/people/')({
  component: () => {
    const { loading, data } = useQuery(AllPresentersQuery);

    const people = (data?.festival?.people || []) as FestivalPresenter[];

    return <People people={people} />;
  },
});
