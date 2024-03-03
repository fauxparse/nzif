import { createIcon } from '@/components/atoms/Icon';

export default createIcon({
  title: 'Menu',
  displayName: 'MenuIcon',
  viewBox: '0 0 20 20',
  path: (
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <path d="M0.75 2.75h18.5" />
      <path d="M0.75 10h18.5" />
      <path d="M0.75 17.25h18.5" />
    </g>
  ),
});
