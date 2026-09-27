'use client';

'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface StatusDistributionPieChartProps {
  items: Array<{ status: string }>;
  onSelectStatus?: (status: 'all' | 'pending' | 'approved' | 'rejected') => void;
  selectedStatus?: string;
}

interface StatusSlice {
  status: 'pending' | 'approved' | 'rejected';
  label: string;
  count: number;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export const StatusDistributionPieChart: React.FC<StatusDistributionPieChartProps> = ({
  items,
  onSelectStatus,
  selectedStatus = 'all',
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Calculate status counts
  const pendingCount = items.filter((i) => i.status === 'pending' || !i.status).length;
  const approvedCount = items.filter((i) => i.status === 'approved').length;
  const rejectedCount = items.filter((i) => i.status === 'rejected').length;
  const total = items.length;

  const data: StatusSlice[] = [
    {
      status: 'pending',
      label: 'Pending',
      count: pendingCount,
      color: '#f59e0b', // Amber-500
      badgeBg: 'bg-amber-950/60',
      badgeBorder: 'border-amber-700/60',
      badgeText: 'text-amber-400',
    },
    {
      status: 'approved',
      label: 'Approved',
      count: approvedCount,
      color: '#10b981', // Emerald-500
      badgeBg: 'bg-emerald-950/60',
      badgeBorder: 'border-emerald-700/60',
      badgeText: 'text-emerald-400',
    },
    {
      status: 'rejected',
      label: 'Rejected',
      count: rejectedCount,
      color: '#f43f5e', // Rose-500
      badgeBg: 'bg-rose-950/60',
      badgeBorder: 'border-rose-700/60',
      badgeText: 'text-rose-400',
    },
  ];

  useEffect(() => {
    if (!svgRef.current || total === 0) return;

    const width = 110;
    const height = 110;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.58; // Donut style for modern aesthetics

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // D3 Pie Generator
    const pie = d3
      .pie<StatusSlice>()
      .value((d) => d.count)
      .sort(null)
      .padAngle(0.04);

    // Arc Generator
    const arc = d3
      .arc<d3.PieArcDatum<StatusSlice>>()
      .innerRadius(innerRadius)
      .outerRadius(radius - 2)
      .cornerRadius(4);

    const arcHover = d3
      .arc<d3.PieArcDatum<StatusSlice>>()
      .innerRadius(innerRadius - 2)
      .outerRadius(radius)
      .cornerRadius(4);

    // Non-zero slices
    const pieData = pie(data.filter((d) => d.count > 0));

    // Render slices
    const paths = g
      .selectAll('path')
      .data(pieData)
      .enter()
      .append('path')
      .attr('d', arc as any)
      .attr('fill', (d) => d.data.color)
      .attr('stroke', '#020617')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .style('opacity', (d) => (selectedStatus === 'all' || selectedStatus === d.data.status ? 1 : 0.4))
      .style('transition', 'all 0.25s ease-in-out');

    // Add interactivity
    paths
      .on('mouseenter', function (_event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('d', arcHover as any)
          .style('opacity', 1);
      })
      .on('mouseleave', function (_event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('d', arc as any)
          .style('opacity', selectedStatus === 'all' || selectedStatus === d.data.status ? 1 : 0.4);
      })
      .on('click', function (_event, d) {
        if (onSelectStatus) {
          onSelectStatus(selectedStatus === d.data.status ? 'all' : d.data.status);
        }
      });

    // Center Total Count Text
    const centerGroup = g.append('g').attr('text-anchor', 'middle');

    centerGroup
      .append('text')
      .attr('dy', '-0.1em')
      .attr('font-size', '15px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'monospace')
      .attr('fill', '#f8fafc')
      .text(total);

    centerGroup
      .append('text')
      .attr('dy', '1.1em')
      .attr('font-size', '8px')
      .attr('font-weight', '600')
      .attr('fill', '#94a3b8')
      .text('TOTAL');
  }, [items, total, pendingCount, approvedCount, rejectedCount, selectedStatus, onSelectStatus]);

  if (total === 0) return null;

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left: Title & Explainer */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-950/70 border border-blue-800/80 flex items-center justify-center text-base">
          📊
        </div>
        <div>
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <span>Status Distribution</span>
            <span className="text-[10px] font-normal text-slate-400 font-mono">(D3.js Visualization)</span>
          </h4>
          <p className="text-[11px] text-slate-400">
            Click any status badge or slice below to filter the requests.
          </p>
        </div>
      </div>

      {/* Center & Right: D3 Pie + Status Legend Chips */}
      <div className="flex items-center gap-5">
        {/* D3 SVG Pie Canvas */}
        <div className="relative w-[110px] h-[110px] flex-shrink-0">
          <svg ref={svgRef} className="w-full h-full" />
        </div>

        {/* Legend Badges */}
        <div className="flex flex-col gap-1.5 min-w-[140px]">
          {data.map((item) => {
            const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
            const isSelected = selectedStatus === item.status;

            return (
              <button
                type="button"
                key={item.status}
                onClick={() => {
                  if (onSelectStatus) {
                    onSelectStatus(isSelected ? 'all' : item.status);
                  }
                }}
                className={`flex items-center justify-between px-2.5 py-1 rounded-xl border text-xs transition-all cursor-pointer ${
                  item.badgeBg
                } ${item.badgeBorder} ${
                  isSelected
                    ? 'ring-2 ring-cyan-400 shadow-sm'
                    : 'opacity-85 hover:opacity-100 hover:scale-[1.02]'
                }`}
                title={`Click to filter by ${item.label}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className={`font-semibold ${item.badgeText}`}>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="text-slate-200 font-bold">{item.count}</span>
                  <span className="text-slate-500">({pct}%)</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
