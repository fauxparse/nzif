import { IconProps, createIcon } from '@/components/atoms/Icon';
import { SortDirection } from '@tanstack/react-table';

type SortIconProps = IconProps & {
  sort: false | SortDirection;
};

export const SortIcon = ({ sort, ...props }: SortIconProps) => (
  <Icon data-sort={sort || undefined} {...props} />
);

const Icon = createIcon({
  title: 'Sort',
  displayName: 'SortIcon',
  viewBox: '0 0 20 20',
  path: (
    <>
      <path
        fill="blue"
        d="M15.53 8.78a.75.75 0 0 1-1.06 0L10 4.31 5.53 8.78a.75.75 0 0 1-1.06-1.06l5-5a.75.75 0 0 1 1.06 0l5 5a.75.75 0 0 1 0 1.06Z"
      />
      <path
        fill="red"
        d="M4.47 11.22a.75.75 0 0 1 1.06 0L10 15.69l4.47-4.47a.75.75 0 1 1 1.06 1.06l-5 5a.75.75 0 0 1-1.06 0l-5-5a.75.75 0 0 1 0-1.06Z"
      />
    </>
  ),
});
