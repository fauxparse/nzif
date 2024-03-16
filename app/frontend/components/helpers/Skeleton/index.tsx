import { Skeleton } from '@mantine/core';
import './Skeleton.css';
import { range } from 'lodash-es';

const lineWidths = range(10).map(() => Math.random() * 20 + 80);

export const ParagraphSkeleton = () => (
  <>
    {range(5).map((i) => (
      <Skeleton key={i} height="1em" width={`${lineWidths[i % 10]}%`} mt="0.5em" />
    ))}
    <Skeleton height="1em" width="40%" mt="0.5em" />
  </>
);

export default Skeleton;
