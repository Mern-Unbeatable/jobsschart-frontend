import React, { memo, useMemo } from 'react';

const CHART_W = 1000;
const CHART_H = 300;
const GRADIENT_ID = 'consultantEarningsGradient';

function buildSvgPaths(values, w, h, maxVal) {
  if (!values?.length) return { line: '', area: '' };
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => ({
    x: i * step,
    y: h - (v / maxVal) * h,
  }));

  let line = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const cx = ((pts[i - 1].x + pts[i].x) / 2).toFixed(2);
    line += ` C ${cx} ${pts[i - 1].y.toFixed(2)} ${cx} ${pts[i].y.toFixed(2)} ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)}`;
  }

  const lastX = pts[pts.length - 1].x.toFixed(2);
  const area = `${line} L ${lastX} ${h} L 0 ${h} Z`;
  return { line, area };
}

const EarningsChart = memo(({ chartData }) => {
  const monthlyEarnings = chartData?.monthlyEarnings || [];

  const months = useMemo(() => monthlyEarnings.map((item) => item.month), [monthlyEarnings]);
  const values = useMemo(() => monthlyEarnings.map((item) => item.earnings ?? 0), [monthlyEarnings]);

  const maxVal = useMemo(() => {
    const max = Math.max(...values, 10);
    return Math.ceil(max / 50) * 50;
  }, [values]);

  const Y_LABELS = useMemo(() => [
    maxVal,
    Math.round(maxVal * 0.75),
    Math.round(maxVal * 0.5),
    Math.round(maxVal * 0.25),
    0
  ], [maxVal]);

  const { line, area } = useMemo(
    () => buildSvgPaths(values, CHART_W, CHART_H, maxVal),
    [values, maxVal],
  );

  return (
    <div className='bg-white border border-gray-100 rounded-lg overflow-hidden'>
      {/* Chart header */}
      <div className='flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
        <div className='flex flex-col gap-1'>
          <h3 className='text-[#191b1c] text-2xl font-medium'>
            Earnings Over Time
          </h3>
          <p className='text-[#464646] text-lg'>
            Net earnings after platform fees
          </p>
        </div>
      </div>

      {/* Chart body */}
      <div className='px-3 pt-6 pb-4 sm:px-6 sm:pt-7 sm:pb-5'>
        <div className='flex items-start gap-2 sm:gap-3'>
          {/* Y-axis labels */}
          <div className='relative h-64 w-11 shrink-0 overflow-visible text-right text-sm text-[#717171] sm:h-72 sm:w-12'>
            {Y_LABELS.map((val, idx) => {
              const yPercent = (1 - val / maxVal) * 100;

              return (
                <span
                  key={`${val}-${idx}`}
                  className='absolute right-0 -translate-y-1/2 leading-none'
                  style={{ top: `${yPercent}%` }}
                >
                  €{val}
                </span>
              );
            })}
          </div>

          {/* SVG chart + X-axis labels */}
          <div className='min-w-0 flex-1'>
            {values.length === 0 ? (
              <div className="h-64 sm:h-72 flex items-center justify-center text-lg text-[#717171]">
                No earnings data available for chart.
              </div>
            ) : (
              <div className='flex min-w-0 flex-col gap-2'>
                <svg
                  viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                  className='h-64 w-full sm:h-72'
                  preserveAspectRatio='none'
                  aria-hidden='true'
                >
                  <defs>
                    <linearGradient
                      id={GRADIENT_ID}
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop
                        offset='0%'
                        stopColor='#E2AB0B'
                        stopOpacity='0.35'
                      />
                      <stop offset='100%' stopColor='#E2AB0B' stopOpacity='0' />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  {Y_LABELS.map((val, idx) => {
                    const yPos = CHART_H - (val / maxVal) * CHART_H;
                    return (
                      <line
                        key={`${val}-${idx}`}
                        x1='0'
                        y1={yPos}
                        x2={CHART_W}
                        y2={yPos}
                        stroke='#e5e7e8'
                        strokeWidth='1.5'
                      />
                    );
                  })}

                  {/* Area fill */}
                  <path d={area} fill={`url(#${GRADIENT_ID})`} />

                  {/* Line */}
                  <path
                    d={line}
                    fill='none'
                    stroke='#E2AB0B'
                    strokeWidth='2.5'
                    strokeLinejoin='round'
                    strokeLinecap='round'
                  />
                </svg>

                {/* X-axis labels */}
                <div className='flex justify-between text-base text-[#616874]'>
                  {months.map((month, idx) => (
                    <span key={`${month}-${idx}`}>{month}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

EarningsChart.displayName = 'EarningsChart';

export default EarningsChart;
