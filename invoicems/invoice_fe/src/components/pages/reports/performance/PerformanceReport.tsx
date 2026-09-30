"use client";
import { useState, useEffect, useMemo } from "react";
import { fetchPerformanceReport, PerformanceReport as ReportData, safeNumber } from "@/service/reports";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#f43f5e', '#14b8a6', '#ec4899', '#6366f1'];


export default function PerformanceReport() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // ...existing code...

  // ...existing code...

  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, []);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPerformanceReport(startDate, endDate);
      setReport(data);
    } catch (error: any) {
      console.error("Error fetching report:", error);
      setError(error?.response?.data?.message || error?.message || "Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ...existing code...

  const formatCurrency = (value: number | null | undefined) => {
    const safe = safeNumber(value);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(safe);
  };

  const formatCompactCurrency = (value: number | null | undefined) => {
    const safe = safeNumber(value);
    if (safe >= 10000000) return `₹${(safe / 10000000).toFixed(1)}Cr`;
    if (safe >= 100000) return `₹${(safe / 100000).toFixed(1)}L`;
    if (safe >= 1000) return `₹${(safe / 1000).toFixed(1)}K`;
    return `₹${safe}`;
  };

  const formatSafeNumber = (value: number | null | undefined): string => {
    const safe = safeNumber(value);
    return safe.toLocaleString();
  };

  const formatSafePercentage = (value: number | null | undefined): string => {
    const safe = safeNumber(value);
    return `${safe.toFixed(2)}%`;
  };



  return (
    <div className="min-h-full bg-[#f4f6f9] p-4 md:p-6 space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Performance Report</h1>
        
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={handleGenerateReport}
            disabled={loading || !startDate || !endDate}
            className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="text-sm font-semibold text-rose-900">Error Loading Report</h3>
              <p className="text-sm text-rose-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !report && !error && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 shadow-sm text-center">
          <div className="max-w-md mx-auto">
            <span className="text-6xl mb-4 block">📊</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Report Generated</h3>
            <p className="text-gray-600 mb-6">Select a date range and click "Generate Report" to view performance analytics.</p>
          </div>
        </div>
      )}

      {/* ...existing code... */}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4" />
              <div className="h-8 bg-gray-200 rounded w-32" />
            </div>
          ))}
        </div>
      )}

      {report && !loading && (
        <>
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Collection Rate</h3>
                <span className="text-2xl">💵</span>
              </div>
              <p className="text-3xl font-bold text-emerald-600">{report && typeof report.collectionRate === 'number' ? report.collectionRate.toFixed(1) : '--'}%</p>
              <p className="text-xs text-gray-500 mt-1">Revenue collected</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Overdue Rate</h3>
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-3xl font-bold text-rose-600">{report && typeof report.overdueRate === 'number' ? report.overdueRate.toFixed(1) : '--'}%</p>
              <p className="text-xs text-gray-500 mt-1">Invoices overdue</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Avg Days to Payment</h3>
                <span className="text-2xl">📅</span>
              </div>
              <p className="text-3xl font-bold text-blue-600">{report.averageDaysToPayment}</p>
              <p className="text-xs text-gray-500 mt-1">Days average</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Largest Invoice</h3>
                <span className="text-2xl">🏆</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(report.largestInvoice)}</p>
              <p className="text-xs text-gray-500 mt-1">Highest value</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Overview Pie Chart */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Paid', value: report.totalPaid },
                      { name: 'Outstanding', value: report.totalOutstanding },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${typeof percent === 'number' ? (percent * 100).toFixed(0) : '--'}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip formatter={(value: number | undefined) => typeof value === 'number' ? formatCurrency(value) : '--'} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Invoice Status Distribution */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Invoice Status Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={report.statusBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={props => `${props.payload.status}: ${props.payload.count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="status"
                  >
                    {report.statusBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ...existing code... */}

          {/* Top Customers Bar Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Top 10 Customers by Revenue</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={report.topCustomers ?? []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  tickFormatter={value => typeof value === 'number' ? formatCompactCurrency(value) : '--'}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  type="category" 
                  dataKey="customerName" 
                  width={150}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip 
                  formatter={(value?: number) => typeof value === 'number' ? formatCurrency(value) : '--'}
                  labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Bar dataKey="totalAmount" fill="#3b82f6" name="Total Amount" />
                <Bar dataKey="paidAmount" fill="#10b981" name="Paid Amount" />
                <Bar dataKey="outstandingAmount" fill="#f59e0b" name="Outstanding" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Breakdown Bar Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Status-wise Revenue Breakdown</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={report.statusBreakdown ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="status" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tickFormatter={formatCompactCurrency}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value?: number, name?: string) => {
                    if (name === 'count') return typeof value === 'number' ? value : '--';
                    return typeof value === 'number' ? formatCurrency(value) : '--';
                  }}
                  labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Bar dataKey="count" fill="#8b5cf6" name="Invoice Count" />
                <Bar dataKey="totalAmount" fill="#3b82f6" name="Total Amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* User Performance Chart */}
          {report.userPerformance && report.userPerformance.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">User Performance & Collection Efficiency</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={report.userPerformance ?? []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    tickFormatter={value => typeof value === 'number' ? formatCompactCurrency(value) : '--'}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="userName" 
                    width={120}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip 
                      formatter={(value?: number, name?: string) => {
                      if (name === 'Collection Rate') return typeof value === 'number' ? `${value.toFixed(1)}%` : '--';
                      return typeof value === 'number' ? formatCurrency(value) : '--';
                    }}
                    labelStyle={{ color: '#000' }}
                  />
                  <Legend />
                  <Bar dataKey="totalAmount" fill="#3b82f6" name="Total Amount" />
                  <Bar dataKey="collectedAmount" fill="#10b981" name="Collected Amount" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Collection Efficiency Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Collection Efficiency</h2>
              <div className="flex items-center justify-center h-64">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#e5e7eb"
                      strokeWidth="16"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#10b981"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${(report.collectionRate / 100) * 502.4} 502.4`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">{report && typeof report.collectionRate === 'number' ? report.collectionRate.toFixed(1) : '--'}%</span>
                    <span className="text-sm text-gray-500 mt-1">Collected</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Collected</p>
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(report.totalPaid)}</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Outstanding</p>
                  <p className="text-lg font-bold text-amber-600">{formatCurrency(report.totalOutstanding)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Invoice Value Distribution</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Largest Invoice</span>
                    <span className="text-lg font-bold text-purple-600">{formatCurrency(report.largestInvoice)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Average Invoice</span>
                    <span className="text-lg font-bold text-blue-600">{formatCurrency(report.averageInvoiceValue)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ 
                        width: `${(report.averageInvoiceValue / report.largestInvoice) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Smallest Invoice</span>
                    <span className="text-lg font-bold text-teal-600">{formatCurrency(report.smallestInvoice)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-500 rounded-full" 
                      style={{ 
                        width: `${(report.smallestInvoice / report.largestInvoice) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Total Invoices</p>
                      <p className="text-2xl font-bold text-blue-600">{report.totalInvoices}</p>
                    </div>
                    <div className="text-center p-3 bg-rose-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Overdue</p>
                      <p className="text-2xl font-bold text-rose-600">{report.overdueInvoices}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Top Customers Details</h2>
              <div className="space-y-3">
                {report.topCustomers.map((customer, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{customer.customerName}</p>
                      <p className="text-xs text-gray-500">{customer.invoiceCount} invoices</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">{formatCurrency(customer.totalAmount)}</p>
                      <p className="text-xs text-gray-500">Outstanding: {formatCurrency(customer.outstandingAmount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {report.userPerformance && report.userPerformance.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">User Performance Details</h2>
                <div className="space-y-3">
                  {report.userPerformance.map((user, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{user.userName}</p>
                        <p className="text-xs text-gray-500">{user.invoiceCount} invoices</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{formatCurrency(user.totalAmount)}</p>
                        <p className="text-xs text-emerald-600 font-semibold">{typeof user.collectionRate === 'number' ? user.collectionRate.toFixed(1) : '--'}% collected</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly Performance Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Month</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-700">Invoices</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-700">Total</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-700">Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {(report.monthlyBreakdown ?? []).map((month: any, idx: number) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 text-gray-900">{month.month} {month.year}</td>
                      <td className="py-3 px-2 text-right text-gray-700">{month.invoiceCount}</td>
                      <td className="py-3 px-2 text-right font-semibold text-gray-900">
                        {formatCurrency(month.totalAmount)}
                      </td>
                      <td className="py-3 px-2 text-right text-emerald-600 font-semibold">
                        {formatCurrency(month.paidAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

