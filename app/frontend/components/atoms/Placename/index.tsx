import LocationIcon from '@/icons/LocationIcon';
import Tag, { TagProps } from '../Tag';

type PlacenameProps = TagProps & {
  name: string;
  traditionalName: string | null;
};

const Placename = ({ name, traditionalName, ...props }: PlacenameProps) => (
  <Tag color="magenta" leftSection={<LocationIcon variant="filled" />} {...props}>
    {traditionalName}
  </Tag>
);

export default Placename;
