import { Spinner } from '@/components/atoms/Spinner';
import { JobState } from '@/graphql/types';
import CloseIcon from '@/icons/CloseIcon';
import { useApolloClient, useMutation, useSubscription } from '@apollo/client';
import {
  Box,
  Button,
  Dialog,
  Flex,
  IconButton,
  Progress,
  Text,
  VisuallyHidden,
} from '@radix-ui/themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAllocations } from './AllocationsProvider';
import { AllocateWorkshopsMutation, AllocationProgressSubscription } from './queries';

type GenerateProps = {
  open: boolean;
  canClose?: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
};

export const Generate: React.FC<GenerateProps> = ({
  open,
  canClose = false,
  onOpenChange,
  onComplete,
}) => {
  const { notYetAllocated } = useAllocations();

  const [running, setRunning] = useState(false);
  const [[progress, total], setProgress] = useState<[number, number]>([0, 100]);

  const [startJob, { data }] = useMutation(AllocateWorkshopsMutation);

  const client = useApolloClient();

  const start = () => {
    setRunning(true);
    startJob();
  };

  const finish = useCallback(() => {
    setRunning(false);
    client.refetchQueries({ include: ['WorkshopAllocation'] });
    onOpenChange(false);
    onComplete();
  }, [onComplete, client]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content size="4" maxWidth="30rem">
        {canClose && !running && (
          <Box position="absolute" top="4" right="4">
            <Dialog.Close>
              <IconButton size="2" variant="ghost" color="gray" radius="full">
                <CloseIcon />
              </IconButton>
            </Dialog.Close>
          </Box>
        )}
        <Dialog.Title align="center">Allocate workshops</Dialog.Title>
        <VisuallyHidden>
          <Dialog.Description>
            This will allocate workshops to participants based on their preferences.
          </Dialog.Description>
        </VisuallyHidden>
        <Flex direction="column" gap="4" align="center">
          {!notYetAllocated && (
            <Text size="3" align="center">
              <b>Warning:</b> This will override any manual changes you’ve made to the allocations.
            </Text>
          )}
          {data?.allocateWorkshops?.workshopAllocation?.id && (
            <AllocationProgress
              id={data.allocateWorkshops.workshopAllocation.id}
              onProgress={setProgress}
              onComplete={finish}
            />
          )}
          <Box asChild style={{ alignSelf: 'stretch' }}>
            <Progress size="3" value={progress} max={total} variant="soft" />
          </Box>
          <Button
            variant="solid"
            size="3"
            style={{ minWidth: '12rem' }}
            disabled={running}
            onClick={start}
          >
            {running ? (
              <>
                <Spinner color="gray" />
                Allocating…
              </>
            ) : (
              'Start'
            )}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

type AllocationProgressProps = {
  id: string;
  onProgress: ([progress, total]: [number, number]) => void;
  onComplete: () => void;
};

const AllocationProgress: React.FC<AllocationProgressProps> = ({ id, onProgress, onComplete }) => {
  const { data } = useSubscription(AllocationProgressSubscription, {
    variables: { id },
  });

  const completed = useRef(false);

  useEffect(() => {
    if (!data?.jobProgress) return;

    const { progress, state, total } = data.jobProgress;

    onProgress([progress, total]);

    if (state === JobState.Completed && !completed.current) {
      completed.current = true;
      onComplete();
    }
  }, [data, onComplete]);

  return null;
};
