import { debounce, drop, range } from 'lodash-es';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createNoise2D } from 'simplex-noise';
import { spline } from '@georgedoescode/spline';

const noise = createNoise2D();

const WAVELENGTH = 300;

const LEVEL = 72;

const AMPLITUDE = 8;

const LAYERS = [
  { fill: 'var(--cyan-9)' },
  { fill: 'var(--magenta-9)' },
  { fill: 'var(--yellow-9)' },
] as const;

type Point = {
  x: number;
  y: number;
  originY: number;
  noiseOffset: number;
};

type Layer = {
  fill: string;
  points: Point[];
};

const map = (n: number, start1: number, end1: number, start2: number, end2: number) =>
  ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;

const Waves = () => {
  const [svg, setSvg] = useState<SVGSVGElement | null>(null);

  const [width, setWidth] = useState(1000);

  const paths = useRef<SVGPathElement[]>([]);

  useEffect(() => {
    if (!svg) return;

    const resized = debounce(
      () => {
        setWidth(svg.clientWidth);
      },
      100,
      { leading: true, trailing: true }
    );

    const observer = new ResizeObserver(resized);
    observer.observe(svg);
    resized();

    return () => {
      observer.disconnect();
    };
  }, [svg]);

  const n = Math.ceil(width / WAVELENGTH);

  const layers = useMemo(() => {
    return LAYERS.map(({ fill }, j) => ({
      fill,
      points: range(0, n + 2).map((i) => {
        const x = i * WAVELENGTH - WAVELENGTH / 2 + (j * WAVELENGTH) / 6;
        const y = LEVEL;

        return {
          x,
          y,
          originY: y,
          noiseOffset: Math.random() * 1000,
        };
      }),
    }));
  }, [n]);

  useEffect(() => {
    let frame: number;

    const animate = () => {
      layers.forEach((layer, i) => {
        for (const point of layer.points) {
          const nY = noise(point.noiseOffset, point.noiseOffset);
          const y = map(nY, -1, 1, point.originY - AMPLITUDE, point.originY + AMPLITUDE);
          point.y = y;
          point.noiseOffset += 0.002;
        }
        if (paths.current[i]) {
          const path = spline(layer.points, 1, false);
          paths.current[i].setAttribute('d', `M${layer.points[0].x} 0L${path.substring(1)}V0Z`);
        }
      });
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [layers]);

  return (
    <svg
      ref={setSvg}
      className="header__waves"
      viewBox={`0 0 ${width} 80`}
      role="presentation"
      preserveAspectRatio="none"
    >
      {layers.map(({ fill }, i) => (
        <path
          className="blend"
          key={i}
          ref={(el) => {
            if (el) paths.current[i] = el;
          }}
          d={`M0 0H${width}V${LEVEL}H0Z`}
          fill={fill}
        />
      ))}
    </svg>
  );
};

export default Waves;
