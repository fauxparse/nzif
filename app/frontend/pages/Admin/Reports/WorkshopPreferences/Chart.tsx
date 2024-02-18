import { crimson } from '@radix-ui/colors';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridColumns } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { BarStackHorizontal } from '@visx/shape';
import { SeriesPoint } from '@visx/shape/lib/types';
import { Tooltip, defaultStyles, withTooltip } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { upperFirst } from 'lodash-es';
import { useMemo } from 'react';

type Choice = 'first' | 'second' | 'third';

type Workshop = {
  id: string;
  name: string;
} & { [key in Choice]: number };

type TooltipData = {
  bar: SeriesPoint<Workshop>;
  key: Choice;
  index: number;
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
};

export type BarStackHorizontalProps = {
  data: Workshop[];
  width: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

export const background = '#eaedff';
const defaultMargin = { top: 24, left: 240, right: 24, bottom: 48 };
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  maxWidth: 240,
  backgroundColor: 'var(--tooltip-background)',
  color: 'var(--tooltip-foreground)',
  lineHeight: 'var(--line-height-medium)',
  padding: 'var(--small) var(--medium)',
  boxShadow: 'var(--shadow-3)',
};

const keys = ['first', 'second', 'third'] as Choice[];

let tooltipTimeout: number;

const colorScale = scaleOrdinal<Choice, string>({
  domain: keys,
  range: [crimson.crimson9, crimson.crimson8, crimson.crimson7],
});

const Chart = withTooltip<BarStackHorizontalProps, TooltipData>(
  ({
    data,
    width,
    margin = defaultMargin,
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  }: BarStackHorizontalProps & WithTooltipProvidedProps<TooltipData>) => {
    const height = data.length * 32 + margin.top + margin.bottom;

    // bounds
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    const totals = useMemo(
      () => data.map((workshop) => keys.reduce((t, k: Choice) => t + Number(workshop[k]), 0)),
      [data]
    );

    // scales
    const countScale = useMemo(
      () =>
        scaleLinear<number>({
          domain: [0, Math.max(...totals)],
          nice: true,
        }),
      [totals]
    );

    const yScale = scaleBand<string>({
      domain: data.map((d) => d.name),
      padding: 0.2,
    });

    countScale.rangeRound([0, xMax]);
    yScale.rangeRound([yMax, 0]);

    return width < 10 ? null : (
      <div>
        <svg width={width} height={height}>
          <title>Workshop preferences graph</title>
          <Group top={margin.top} left={margin.left}>
            <BarStackHorizontal<Workshop, Choice>
              data={data}
              keys={keys}
              height={yMax}
              y={(w) => w.name}
              xScale={countScale}
              yScale={yScale}
              color={colorScale}
            >
              {(barStacks) =>
                barStacks.map((barStack) =>
                  barStack.bars.map((bar) => (
                    <rect
                      key={`barstack-horizontal-${barStack.index}-${bar.index}`}
                      x={bar.x}
                      y={bar.y}
                      width={bar.width}
                      height={bar.height}
                      fill={bar.color}
                      onMouseLeave={() => {
                        tooltipTimeout = window.setTimeout(() => {
                          hideTooltip();
                        }, 300);
                      }}
                      onMouseMove={() => {
                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                        const top = bar.y + margin.top;
                        const left = bar.x + bar.width + margin.left;
                        showTooltip({
                          tooltipData: bar,
                          tooltipTop: top,
                          tooltipLeft: left,
                        });
                      }}
                    />
                  ))
                )
              }
            </BarStackHorizontal>

            <AxisLeft
              hideAxisLine
              hideTicks
              scale={yScale}
              stroke="var(--text-subtle)"
              tickStroke="var(--text-subtle)"
              tickLabelProps={{
                fill: 'var(--text)',
                fontSize: 11,
                fontFamily: 'DIN Round Pro',
                textAnchor: 'end',
                dy: '0.33em',
              }}
              numTicks={data.length}
            />
            <AxisBottom
              top={yMax}
              scale={countScale}
              stroke="var(--text-subtle)"
              tickStroke="var(--text-subtle)"
              tickLabelProps={{
                fill: 'var(--text)',
                fontSize: 11,
                fontFamily: 'DIN Round Pro',
                textAnchor: 'middle',
              }}
            />
          </Group>
          <GridColumns
            top={margin.top}
            left={margin.left}
            scale={countScale}
            width={xMax}
            height={yMax}
            stroke="var(--text-accent)"
            tickValues={[16]}
          />
        </svg>
        {tooltipOpen && tooltipData && (
          <Tooltip top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
            <div>{tooltipData.bar.data.name}</div>
            <div>{`${upperFirst(tooltipData.key)} choice`}</div>
            <div
              style={{
                color: colorScale(tooltipData.key),
                fontSize: 'var(--font-size-large)',
                lineHeight: 'var(--line-height-large)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              {tooltipData.bar.data[tooltipData.key]}
            </div>
          </Tooltip>
        )}
      </div>
    );
  }
);

export default Chart;
