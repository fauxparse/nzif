import { createIcon } from '@/components/atoms/Icon';

export default createIcon({
  title: 'Theme',
  displayName: 'ThemeIcon',
  viewBox: '-10 -10 20 20',
  path: (
    <>
      <defs>
        <mask id="moon">
          <rect x="-10" y="-10" width="20" height="20" fill="white" />
          <circle data-component="shadow" cx="0" cy="0" r="7" fill="black" />
        </mask>

        <filter id="blur" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="1" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0 10" />
          </feComponentTransfer>
        </filter>
      </defs>

      <g filter="url(#blur)">
        <g mask="url(#moon)">
          <circle data-component="sun" cx="0" cy="0" r="9" />
        </g>
      </g>

      <g>
        <path d="M7 0h1" />
        <path d="M7 0h1" />
        <path d="M7 0h1" />
        <path d="M7 0h1" />
        <path d="M7 0h1" />
        <path d="M7 0h1" />
        <path d="M7 0h1" />
        <path d="M7 0h1" />
      </g>
    </>
  ),
});
