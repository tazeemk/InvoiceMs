'use client';

import React, { useState, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

// TypeScript Interfaces
interface SalesummaryData {
  totalSales: number;
  totalOrders: number;
  totalQuantity: number;
  averageOrderValue: number;
}

interface MonthlySalesData {
  month: number;
  totalSales: number;
}

interface CategorySalesData {
  category: string;
  totalSales: number;
}

interface SalesReportData {
  summary: SalesummaryData;
  monthly: MonthlySalesData[];
  byCategory: CategorySalesData[];
}

// Month names array for X-axis labels
const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// Helper: Build full 12-month dataset filling missing months with 0
const buildFullYearData = (monthly: MonthlySalesData[]) => {
  const map: Record<number, number> = {};
  monthly.forEach((item) => {
    map[item.month] = item.totalSales;
  });
  return MONTH_NAMES.map((_, i) => map[i + 1] ?? 0);
};

// Summary Card Component
const SummaryCard: React.FC<{
  title: string;
  value: string | number;
  icon: string;
  color: string;
}> = ({ title, value, icon, color }) => (
  <div className="col-md-6 col-lg-3 mb-4">
    <div className={`card border-0 shadow-sm h-100 bg-${color} bg-opacity-10`}>
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <p className="text-muted mb-2 small fw-semibold text-uppercase">{title}</p>
            <h4 className="mb-0 fw-bold">{value}</h4>
          </div>
          <div className="fs-2">{icon}</div>
        </div>
      </div>
    </div>
  </div>
);

// Chart color palette
const CHART_COLORS = [
  '#0d6efd',
  '#6f42c1',
  '#20c997',
  '#fd7e14',
  '#dc3545',
  '#0dcaf0',
  '#198754',
  '#ffc107',
];

// Main Sales Report Component
const SalesReport: React.FC = () => {
  const [data, setData] = useState<SalesReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [summaryRes, monthlyRes, categoryRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL || "http://192.168.1.65:8060/"}order/summary`),
          fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL || "http://192.168.1.65:8060/"}order/monthly`),
          fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL || "http://192.168.1.65:8060/"}order/by-category`),
        ]);

        if (!summaryRes.ok || !monthlyRes.ok || !categoryRes.ok) {
          throw new Error('Failed to fetch data from API');
        }

        const summary: SalesummaryData = await summaryRes.json();
        const monthly: MonthlySalesData[] = await monthlyRes.json();
        const byCategory: CategorySalesData[] = await categoryRes.json();

        setData({ summary, monthly, byCategory });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ── Line Chart ──────────────────────────────────────────────────────────────
  // Always show all 12 months; missing months default to 0
  const lineChartData = {
    labels: MONTH_NAMES,
    datasets: [
      {
        label: 'Monthly Sales ',
        data: data ? buildFullYearData(data.monthly) : Array(12).fill(0),
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13, 110, 253, 0.08)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#0d6efd',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 7,
      },
    ],
  };

  // ── Pie Chart ───────────────────────────────────────────────────────────────
  const pieChartData = {
    labels: data?.byCategory.map((item) => item.category) || [],
    datasets: [
      {
        label: 'Sales by Category',
        data: data?.byCategory.map((item) => item.totalSales) || [],
        backgroundColor: CHART_COLORS,
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  // ── Bar Chart ───────────────────────────────────────────────────────────────
  const barChartData = {
    labels: data?.byCategory.map((item) => item.category) || [],
    datasets: [
      {
        label: 'Sales by Category ',
        data: data?.byCategory.map((item) => item.totalSales) || [],
        backgroundColor: CHART_COLORS,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // ── Shared Line / Bar Options (maintainAspectRatio: false) ──────────────────
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // ← KEY FIX: lets chart fill the container height
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          padding: 15,
          font: { size: 12, weight: 'bold' as const },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${Number(ctx.raw).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: {
          callback: (value: any) => `${Number(value).toLocaleString()}`,
        },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  // ── Pie Options (maintainAspectRatio: false) ────────────────────────────────
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false, // ← KEY FIX
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) =>
            ` ${ctx.label}: ${Number(ctx.raw).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        },
      },
    },
  };

  // ── Loading State ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container-fluid p-4 bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // ── Error State ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger" role="alert">
          <strong>Error!</strong> {error}
        </div>
      </div>
    );
  }

  // ── Main Render ─────────────────────────────────────────────────────────────
  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="mb-4">
        <h1 className="fw-bold mb-1">Sales Report Dashboard</h1>
        <p className="text-muted mb-0">Overview of your sales performance</p>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <SummaryCard
          title="Total Sales"
          value={`$${data?.summary.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon="💰"
          color="primary"
        />
        <SummaryCard
          title="Total Orders"
          value={data?.summary.totalOrders?.toLocaleString() ?? '0'}
          icon="📦"
          color="success"
        />
        <SummaryCard
          title="Total Quantity Sold"
          value={data?.summary.totalQuantity?.toLocaleString() ?? '0'}
          icon="📊"
          color="info"
        />
        <SummaryCard
          title="Average Order Value"
          value={`$${data?.summary.averageOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon="📈"
          color="warning"
        />
      </div>

      {/* Line Chart + Pie Chart */}
      <div className="row mb-4">
        {/* Line Chart */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title fw-bold mb-4">Monthly Sales Trend</h5>
              {/* position:relative + fixed height = Chart.js renders correctly */}
              <div style={{ position: 'relative', height: '320px', width: '100%' }}>
                <Line data={lineChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title fw-bold mb-4">Sales by Category</h5>
              {/* position:relative + fixed height = Pie renders correctly */}
              <div style={{ position: 'relative', height: '320px', width: '100%' }}>
                <Pie data={pieChartData} options={pieOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Category Sales Comparison</h5>
              <div style={{ position: 'relative', height: '350px', width: '100%' }}>
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;