import React, { useEffect, useMemo, useRef } from 'react';
import { spline } from '@georgedoescode/spline';
import { crimson, cyan, yellow } from '@radix-ui/colors';
import clsx from 'clsx';
import { createNoise2D } from 'simplex-noise';

import { LogoProps } from './Logo.types';

import './Logo.css';

import './spline.d.ts';

const POINTS = [
  { x: 300, y: 85 },
  { x: 490, y: 110 },
  { x: 650, y: 225 },
  { x: 650, y: 430 },
  { x: 460, y: 500 },
  { x: 250, y: 515 },
  { x: 80, y: 400 },
  { x: 100, y: 160 },
];

const map = (n: number, start1: number, end1: number, start2: number, end2: number) =>
  ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;

const makePoints = (points: { x: number; y: number }[]) =>
  points.map(({ x, y }) => ({
    x,
    y,
    originX: x,
    originY: y,
    noiseOffsetX: Math.random() * 1000,
    noiseOffsetY: Math.random() * 1000,
  }));

const COLORS = [crimson.crimson9, cyan.cyan9, yellow.yellow9] as const;

const NOISE_STEP = 0.005;

export const Logo: React.FC<LogoProps> = ({ className, ...props }) => {
  const blobRef = useRef<SVGPathElement[]>([]);

  const blobs = useMemo(
    () =>
      COLORS.map((color) => ({
        points: makePoints(POINTS),
        color,
      })),
    []
  );

  useEffect(() => {
    const noise = createNoise2D();
    let frame: number;

    const animate = () => {
      blobs.forEach((blob, i) => {
        blob.points.forEach((point) => {
          const nX = noise(point.noiseOffsetX, point.noiseOffsetX);
          const nY = noise(point.noiseOffsetY, point.noiseOffsetY);
          const x = map(nX, -1, 1, point.originX - 20, point.originX + 20);
          const y = map(nY, -1, 1, point.originY - 20, point.originY + 20);
          point.x = x;
          point.y = y;
          point.noiseOffsetX += NOISE_STEP;
          point.noiseOffsetY += NOISE_STEP;
        });
        if (blobRef.current[i]) blobRef.current[i].setAttribute('d', spline(blob.points, 1, true));
      });
      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, [blobs]);

  return (
    <svg className={clsx('logo', className)} {...props}>
      {blobs.map((blob, i) => (
        <path
          className="logo__blob"
          key={i}
          ref={(el) => {
            if (el) blobRef.current[i] = el;
          }}
          d={spline(blob.points, 1, true)}
          stroke="none"
          fill={blob.color}
        />
      ))}
      <path
        className="logo__nz"
        d="M189.919 358.627c0 9.055.232 12.305 2.322 16.485 2.67 5.456 9.055 9.287 16.717 9.287 7.662 0 14.047-3.831 16.717-9.287 2.09-4.18 2.322-7.43 2.322-16.485v-55.028c0-13.235-1.857-25.076-12.538-35.757-6.733-6.733-16.253-10.68-28.094-10.68-9.984 0-21.593 3.947-29.255 11.609-2.787-5.34-7.43-11.145-17.879-11.145-7.662 0-14.047 3.831-16.717 9.288-2.09 4.179-2.322 7.43-2.322 16.485v75.228c0 9.055.232 12.305 2.322 16.485 2.67 5.456 9.055 9.287 16.717 9.287 7.662 0 14.047-3.831 16.718-9.287 2.089-4.18 2.321-7.43 2.321-16.485v-49.92c0-14.396 10.217-17.182 15.325-17.182 5.108 0 15.324 2.786 15.324 17.182v49.92ZM324.586 383.47c8.01 0 11.145-.232 14.86-2.089 4.875-2.438 8.358-8.127 8.358-15.092 0-6.966-3.483-12.654-8.358-15.092-3.715-1.858-6.85-2.09-14.86-2.09H297.42l42.722-56.653c5.921-7.894 7.662-11.609 7.662-18.11 0-4.876-2.322-10.449-7.894-13.235-4.063-2.09-7.546-2.554-15.324-2.554h-52.474c-8.01 0-11.145.232-14.86 2.09-4.876 2.438-8.358 8.126-8.358 15.092 0 6.965 3.482 12.654 8.358 15.092 3.715 1.857 6.85 2.089 14.86 2.089h24.147l-42.489 56.653c-5.921 7.895-7.663 11.61-7.663 18.111 0 4.876 2.322 10.448 7.895 13.234 4.063 2.09 7.546 2.554 15.324 2.554h55.26Z"
      />
      <path
        className="logo__if"
        d="M367.076 358.627c0 9.055.232 12.305 2.321 16.485 2.67 5.456 9.056 9.287 16.718 9.287 7.662 0 14.047-3.831 16.717-9.287 2.09-4.18 2.322-7.43 2.322-16.485v-72.954c0-9.055-.232-12.306-2.322-16.485-2.67-5.457-9.055-9.288-16.717-9.288-7.662 0-14.048 3.831-16.718 9.288-2.089 4.179-2.321 7.43-2.321 16.485v72.954ZM441.491 358.627c0 9.055.232 12.305 2.321 16.485 2.671 5.456 9.056 9.287 16.718 9.287 7.662 0 14.047-3.831 16.717-9.287 2.09-4.18 2.322-7.43 2.322-16.485v-65.941h4.411c7.082 0 9.404-.348 12.538-1.857 4.528-2.206 7.198-6.85 7.198-12.77 0-5.921-2.67-10.565-7.198-12.771-3.134-1.509-5.456-1.857-12.538-1.857h-4.411v-8.127c0-4.875 2.554-7.662 7.662-7.894 3.599-.116 6.733-1.045 8.823-2.089 4.644-2.322 7.662-6.966 7.662-13.699 0-6.734-3.25-11.145-7.894-13.467-3.251-1.625-8.359-2.554-15.324-2.554h-.697c-26.933 0-38.31 19.736-38.31 36.917v10.913h-.116c-7.082 0-9.404.348-12.538 1.857-4.528 2.206-7.198 6.85-7.198 12.771 0 5.92 2.67 10.564 7.198 12.77 3.134 1.509 5.456 1.857 12.538 1.857h.116v65.941ZM528.328 384.167c13.466 0 24.379-10.913 24.379-24.379 0-13.467-10.913-24.38-24.379-24.38-13.467 0-24.38 10.913-24.38 24.38 0 13.466 10.913 24.379 24.38 24.379Zm68.494 0c13.467 0 24.379-10.913 24.379-24.379 0-13.467-10.912-24.38-24.379-24.38s-24.379 10.913-24.379 24.38c0 13.466 10.912 24.379 24.379 24.379Zm68.494 0c13.467 0 24.38-10.913 24.38-24.379 0-13.467-10.913-24.38-24.38-24.38-13.466 0-24.379 10.913-24.379 24.38 0 13.466 10.913 24.379 24.379 24.379Z"
      />
    </svg>
  );
};

export default Logo;
