import Button from '@/atoms/Button';
import {
  FestivalWorkshopAllocationDocument,
  FestivalWorkshopAllocationQuery,
  JobState,
  useAllocateWorkshopsMutation,
  useFestivalWorkshopAllocationQuery,
} from '@/graphql/types';
import Breadcrumbs from '@/molecules/Breadcrumbs';
import PageHeader from '@/molecules/PageHeader';

import AllocationProgress from './AllocationProgress';

import './Allocations.css';

export const Component: React.FC = () => {
  const { loading, data, refetch } = useFestivalWorkshopAllocationQuery();

  const id = data?.festival?.workshopAllocation?.id;

  const [startJob] = useAllocateWorkshopsMutation({
    update: (cache, { data }) => {
      const existing = cache.readQuery({
        query: FestivalWorkshopAllocationDocument,
      }) as FestivalWorkshopAllocationQuery;
      if (existing && data?.allocateWorkshops?.workshopAllocation?.id) {
        cache.writeQuery({
          query: FestivalWorkshopAllocationDocument,
          data: {
            ...existing,
            festival: {
              ...existing.festival,
              workshopAllocation: {
                ...data.allocateWorkshops.workshopAllocation,
                state: JobState.Working,
              },
            },
          },
        });
      }
    },
  });

  return (
    <>
      <PageHeader>
        <Breadcrumbs />
        <h1>Workshop allocation</h1>
      </PageHeader>
      <div className="no-allocations inset">
        {id ? (
          <AllocationProgress id={id} onComplete={refetch} />
        ) : (
          !loading && (
            <>
              <p>Click below to start searching for a workshop allocation solution.</p>
              <Button large primary text="Start" onClick={() => startJob()} />
            </>
          )
        )}
      </div>
    </>
  );
};
