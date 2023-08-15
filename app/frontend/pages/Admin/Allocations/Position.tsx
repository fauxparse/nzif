import Icon from '@/atoms/Icon';

type PositionProps = {
  position: number | null;
};

const Position: React.FC<PositionProps> = ({ position }) => (
  <span className="allocations__position" data-position={position || undefined}>
    {position || <Icon name="cancel" />}
  </span>
);

export default Position;
