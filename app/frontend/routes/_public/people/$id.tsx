import { NotFound } from '@/components/pages/NotFound';
import { Person } from '@/components/pages/People/Person';
import { PersonQuery } from '@/components/pages/People/queries';
import { useQuery } from '@apollo/client';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/people/$id')({
  component: () => {
    const { id } = Route.useParams();

    const { loading, data, error } = useQuery(PersonQuery, {
      variables: { id },
    });

    const person = data?.person;

    if (!loading && (!!error || !person)) {
      return <NotFound />;
    }

    return <Person person={person ?? null} />;
  },
});
