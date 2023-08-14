import { useEffect, useRef } from 'react';

import ProgressBar from '@/atoms/ProgressBar';
import { JobState, useAllocationProgressSubscription } from '@/graphql/types';

type AllocationProgressProps = {
  id: string;
  onComplete: () => void;
};

const AllocationProgress: React.FC<AllocationProgressProps> = ({ id, onComplete }) => {
  const { data } = useAllocationProgressSubscription({
    variables: { id },
  });

  const completed = useRef(false);

  useEffect(() => {
    if (data?.jobProgress?.state === JobState.Completed && !completed.current) {
      completed.current = true;
      onComplete();
    }
  }, [data, onComplete]);

  if (!data?.jobProgress) return null;

  return (
    <>
      <p>Finding optimal allocation…</p>
      <ProgressBar value={data.jobProgress.progress} max={data.jobProgress.total} />
    </>
  );
};

export default AllocationProgress;
