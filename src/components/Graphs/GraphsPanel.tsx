import React, { useState, useRef } from 'react';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { exportCanvasAsImage } from '../../services/exportService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Pause, Play, Download, LineChart, Layers, Sliders } from 'lucide-react';
import { toast } from 'sonner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type ActiveTab = 'altitude' | 'pressure' | 'temperature' | 'battery' | 'descent';

export const GraphsPanel: React.FC = () => {
  const { packets, graphPaused, toggleGraphPause } = useTelemetryStore();
  const [activeMetric, setActiveMetric] = useState<ActiveTab>('altitude');
  const [timeWindow, setTimeWindow] = useState<number>(60);
  const [isOverlayMode, setIsOverlayMode] = useState<boolean>(false);
  const chartRef = useRef<any>(null);

  const displayedPackets = timeWindow > 0 ? packets.slice(-timeWindow) : packets;
  const labels = displayedPackets.map((p) => `-${timeWindow - (p.missionTime % timeWindow)}s`);

  const getMetricDataset = (metric: ActiveTab) => {
    switch (metric) {
      case 'altitude':
        return {
          label: 'Altitude (m)',
          data: displayedPackets.map((p) => p.altitude),
          borderColor: '#00D4FF',
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(0, 212, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 212, 255, 0.0)');
            return gradient;
          },
          yAxisID: 'y',
        };
      case 'pressure':
        return {
          label: 'Pressure (hPa)',
          data: displayedPackets.map((p) => p.pressure),
          borderColor: '#FACC15',
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(250, 204, 21, 0.3)');
            gradient.addColorStop(1, 'rgba(250, 204, 21, 0.0)');
            return gradient;
          },
          yAxisID: isOverlayMode ? 'y1' : 'y',
        };
      case 'temperature':
        return {
          label: 'Temperature (°C)',
          data: displayedPackets.map((p) => p.temperature),
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.0)',
          yAxisID: 'y',
        };
      case 'battery':
        return {
          label: 'Battery (V)',
          data: displayedPackets.map((p) => p.batteryVoltage),
          borderColor: '#00FF84',
          backgroundColor: 'rgba(0, 255, 132, 0.0)',
          yAxisID: 'y',
        };
      case 'descent':
        return {
          label: 'Descent Rate (m/s)',
          data: displayedPackets.map((p) => p.descentRate),
          borderColor: '#C084FC',
          backgroundColor: 'rgba(192, 132, 252, 0.0)',
          yAxisID: 'y',
        };
    }
  };

  const primaryDataset = getMetricDataset(activeMetric);
  const datasets: any[] = [
    {
      fill: !isOverlayMode,
      label: primaryDataset.label,
      data: primaryDataset.data,
      borderColor: primaryDataset.borderColor,
      backgroundColor: primaryDataset.backgroundColor,
      borderWidth: 2,
      pointRadius: 2.5,
      pointBackgroundColor: primaryDataset.borderColor,
      tension: 0.35,
      yAxisID: 'y',
    },
  ];

  if (isOverlayMode) {
    const secondaryMetric: ActiveTab = activeMetric === 'altitude' ? 'descent' : 'altitude';
    const secondaryDataset = getMetricDataset(secondaryMetric);
    datasets.push({
      fill: false,
      label: secondaryDataset.label,
      data: secondaryDataset.data,
      borderColor: secondaryDataset.borderColor,
      borderWidth: 2,
      borderDash: [4, 4],
      pointRadius: 2,
      pointBackgroundColor: secondaryDataset.borderColor,
      tension: 0.35,
      yAxisID: 'y1',
    });
  }

  const chartData = {
    labels,
    datasets,
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    scales: {
      x: {
        grid: { color: '#1F2937' },
        ticks: { color: '#94A3B8', font: { family: 'Inter', size: 10 }, maxTicksLimit: 10 },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: { color: '#1F2937' },
        ticks: { color: '#94A3B8', font: { family: 'Inter', size: 10 } },
      },
      ...(isOverlayMode && {
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { color: '#C084FC', font: { family: 'Inter', size: 10 } },
        },
      }),
    },
    plugins: {
      legend: {
        display: isOverlayMode,
        position: 'top' as const,
        labels: { color: '#94A3B8', font: { family: 'Inter', size: 10 }, boxWidth: 12 },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: '#0C1220',
        titleColor: '#F8FAFC',
        borderColor: '#1F2937',
        borderWidth: 1,
      },
    },
  };

  const handleExportPNG = () => {
    if (chartRef.current) {
      exportCanvasAsImage(chartRef.current.canvas, `OrbitOps_${activeMetric}_graph.png`);
      toast.success(`Graph exported as PNG image`);
    }
  };

  const toggleOverlay = () => {
    setIsOverlayMode(!isOverlayMode);
    toast.info(!isOverlayMode ? 'Overlay Comparison Mode Activated' : 'Single Metric View');
  };

  return (
    <div className="h-full flex flex-col bg-[#0C1220] border border-[#1F2937] rounded-xl p-3 select-none">
      {/* Graph Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#1F2937]">
        <div className="flex items-center space-x-2">
          <LineChart className="w-4 h-4 text-[#00D4FF]" />
          <span className="font-orbitron text-xs font-semibold text-slate-200 tracking-wider">
            REAL-TIME TELEMETRY GRAPHS
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <select
            value={timeWindow}
            onChange={(e) => setTimeWindow(Number(e.target.value))}
            className="bg-[#111827] border border-[#1F2937] text-slate-300 text-[10px] rounded-md px-2 py-1 font-mono outline-none"
          >
            <option value={30}>Last 30s</option>
            <option value={60}>Last 60s</option>
            <option value={300}>Last 5m</option>
            <option value={0}>All</option>
          </select>

          {/* Overlay Comparison Toggle Button */}
          <button
            onClick={toggleOverlay}
            className={`px-2 py-1 rounded-md border text-[10px] flex items-center gap-1 font-mono transition-all ${
              isOverlayMode
                ? 'bg-[#00D4FF]/20 text-[#00D4FF] border-[#00D4FF]/50 font-bold shadow-cyan-glow'
                : 'bg-[#111827] text-slate-400 border-[#1F2937] hover:text-slate-200'
            }`}
            title="Toggle Dual Metric Overlay Comparison"
          >
            <Layers className="w-3 h-3" />
            <span>OVERLAY</span>
          </button>

          <button
            onClick={toggleGraphPause}
            className={`px-2 py-1 rounded-md border text-[10px] flex items-center gap-1 font-mono transition-all ${
              graphPaused
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold'
                : 'bg-[#111827] text-slate-300 border-[#1F2937] hover:bg-[#1F2937]'
            }`}
          >
            {graphPaused ? <Play className="w-3 h-3 text-amber-400" /> : <Pause className="w-3 h-3 text-slate-400" />}
            <span>{graphPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>

          <button
            onClick={handleExportPNG}
            className="p-1 rounded-md bg-[#111827] hover:bg-[#1F2937] text-slate-300 border border-[#1F2937] text-xs transition-all"
            title="Export PNG"
          >
            <Download className="w-3.5 h-3.5 text-[#00FF84]" />
          </button>
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex items-center space-x-1 my-2 bg-[#111827] p-1 rounded-md border border-[#1F2937]">
        {(['altitude', 'pressure', 'temperature', 'battery', 'descent'] as ActiveTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveMetric(tab)}
            className={`flex-1 py-1 rounded text-[10px] font-mono uppercase transition-all ${
              activeMetric === tab
                ? 'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40 font-bold shadow-cyan-glow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'descent' ? 'DESCENT RATE' : tab}
          </button>
        ))}
      </div>

      {/* Chart Canvas Area */}
      <div className="flex-1 w-full relative min-h-[220px]">
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};
