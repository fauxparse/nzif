import { useMemo } from 'react';

import { useTimetableContext } from '../Context';
import { SlotAttributes, useDestroySlotMutation, useUpdateSlotMutation } from '@/graphql/types';
import ContextMenu from '@/molecules/ContextMenu';
import { useContextMenu } from '@/molecules/ContextMenu/Context';
import Menu from '@/molecules/Menu';

const TimetableSlotContextMenu: React.FC = () => {
  const { currentTarget } = useContextMenu();

  const { slots } = useTimetableContext();

  const id = currentTarget?.getAttribute('data-id');

  const slot = useMemo(() => slots.find((s) => s.id === id), [id, slots]);

  const [updateSlot] = useUpdateSlotMutation();
  const [destroySlot] = useDestroySlotMutation();

  const handleClear = () => {
    if (!id || !slot) return;
    updateSlot({
      variables: { id, attributes: { activityId: null } as SlotAttributes },
      optimisticResponse: {
        __typename: 'Mutation',
        updateSlot: {
          __typename: 'UpdateSlotPayload',
          slot: {
            ...slot,
            activity: null,
          },
        },
      },
    });
  };

  const handleDelete = () => {
    if (!id) return;
    destroySlot({
      variables: { id },
      update: (cache) => cache.evict({ id: cache.identify({ __typename: 'Slot', id }) }),
      optimisticResponse: {
        __typename: 'Mutation',
        destroySlot: true,
      },
    });
  };

  return (
    <ContextMenu id="slot">
      {slot?.activity && <Menu.Item icon="edit" label="Activity details" />}
      <Menu.Separator />
      {slot?.activity && <Menu.Item icon="close" label="Clear activity" onClick={handleClear} />}
      <Menu.Item icon="trash" label="Delete" onClick={handleDelete} />
    </ContextMenu>
  );
};

export default TimetableSlotContextMenu;
