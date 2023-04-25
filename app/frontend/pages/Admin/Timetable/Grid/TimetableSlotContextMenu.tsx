import { useDestroySlotMutation } from '@/graphql/types';
import ContextMenu from '@/molecules/ContextMenu';
import { useContextMenu } from '@/molecules/ContextMenu/Context';
import Menu from '@/molecules/Menu';

const TimetableSlotContextMenu: React.FC = () => {
  const { currentTarget } = useContextMenu();

  const id = currentTarget?.getAttribute('data-id');

  const [destroySlot] = useDestroySlotMutation();

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
      <Menu.Item icon="trash" label="Delete" onClick={handleDelete} />
    </ContextMenu>
  );
};

export default TimetableSlotContextMenu;
