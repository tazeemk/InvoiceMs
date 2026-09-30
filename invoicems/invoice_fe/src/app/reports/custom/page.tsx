"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  RefreshCw,
  Download,
  Filter,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import moment from "moment";
import { fetchCustomReport, CustomReportData, CustomReportFilters } from "@/service/reports";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function CustomReport() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<CustomReportData | null>(null);
  
  // Filters
  const [startDate, setStartDate] = useState(
    moment().subtract(3, "months").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [reportType, setReportType] = useState<'invoice' | 'order' | 'payment' | 'customer'>('invoice');
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['count', 'total']);

  const availableMetrics = [
    { value: 'count', label: 'Count' },
    { value: 'total', label: 'Total Amount' },
    { value: 'paid', label: 'Paid Amount' },
    { value: 'pending', label: 'Pending Amount' },
    { value: 'average', label: 'Average Amount' },
  ];

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const loadReportData = async () => {
    if (selectedMetrics.length === 0) {
      toast({
        title: "No Metrics Selected",
        description: "Please select at least one metric to display",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Loading custom report...");
      const filters: CustomReportFilters = {
        startDate,
        endDate,
        reportType,
        groupBy,
        metrics: selectedMetrics,
      };
      const data = await fetchCustomReport(filters);
      console.log("Custom report loaded:", data);
      setReportData(data);
      toast({
        title: "Success",
        description: "Custom report generated successfully",
      });
    } catch (error: any) {
      console.error("Error loading custom report:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to generate custom report";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = () => {
    if (moment(startDate).isAfter(moment(endDate))) {
      toast({
        title: "Invalid Date Range",
        description: "Start date must be before end date",
        variant: "destructive",
      });
      return;
    }
    loadReportData();
  };

  const handleExport = () => {
    if (!reportData) return;
    
    // Convert data to CSV
    const csvContent = [
      // Headers
      ['Period', ...selectedMetrics].join(','),
      // Data rows
      ...reportData.chartData.map(row => 
        [row.period, ...selectedMetrics.map(m => row[m] || 0)].join(',')
      )
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `custom-report-${moment().format('YYYY-MM-DD')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Report has been exported to CSV",
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Custom Report Builder</h1>
        {reportData && (
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Report Type and Group By */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Report Type
                </label>
                <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invoice">Invoices</SelectItem>
                    <SelectItem value="order">Orders</SelectItem>
                    <SelectItem value="payment">Payments</SelectItem>
                    <SelectItem value="customer">Customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Group By
                </label>
                <Select value={groupBy} onValueChange={(value: any) => setGroupBy(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Daily</SelectItem>
                    <SelectItem value="week">Weekly</SelectItem>
                    <SelectItem value="month">Monthly</SelectItem>
                    <SelectItem value="year">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Metrics Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Metrics to Display
              </label>
              <div className="flex flex-wrap gap-2">
                {availableMetrics.map(metric => (
                  <Button
                    key={metric.value}
                    variant={selectedMetrics.includes(metric.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleMetric(metric.value)}
                  >
                    {metric.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Date Range
              </label>
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-xs text-gray-600 mb-1 block">Start Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={endDate}
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="text-xs text-gray-600 mb-1 block">End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                  />
                </div>
                <Button onClick={handleGenerateReport} className="gap-2" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Spinner />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Spinner />
        </div>
      )}

      {!isLoading && reportData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                <TrendingUp className="h-5 w-5" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.summary.totalRecords}</div>
                <p className="text-xs text-blue-100 mt-1">
                  In selected period
                </p>
              </CardContent>
            </Card>

            {reportData.summary.totalAmount !== undefined && (
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                  <TrendingUp className="h-5 w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{reportData.summary.totalAmount.toLocaleString()}
                  </div>
                  <p className="text-xs text-green-100 mt-1">
                    Cumulative total
                  </p>
                </CardContent>
              </Card>
            )}

            {reportData.summary.totalPaid !== undefined && (
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                  <TrendingUp className="h-5 w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{reportData.summary.totalPaid.toLocaleString()}
                  </div>
                  <p className="text-xs text-purple-100 mt-1">
                    Collected amount
                  </p>
                </CardContent>
              </Card>
            )}

            {reportData.summary.averageAmount !== undefined && (
              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Average Amount</CardTitle>
                  <TrendingUp className="h-5 w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{reportData.summary.averageAmount.toLocaleString()}
                  </div>
                  <p className="text-xs text-orange-100 mt-1">
                    Per record
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={reportData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {selectedMetrics.includes('count') && (
                    <Bar dataKey="count" fill="#3b82f6" name="Count" />
                  )}
                  {selectedMetrics.includes('total') && (
                    <Bar dataKey="total" fill="#10b981" name="Total" />
                  )}
                  {selectedMetrics.includes('paid') && (
                    <Bar dataKey="paid" fill="#8b5cf6" name="Paid" />
                  )}
                  {selectedMetrics.includes('pending') && (
                    <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                  )}
                  {selectedMetrics.includes('average') && (
                    <Bar dataKey="average" fill="#ef4444" name="Average" />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Data (Top 10 Records)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      {Object.keys(reportData.tableData[0] || {}).map(key => (
                        <th key={key} className="text-left p-3 capitalize">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.tableData.map((row, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        {Object.values(row).map((value: any, i) => (
                          <td key={i} className="p-3">
                            {typeof value === 'number' && value > 1000 
                              ? `₹${value.toLocaleString()}`
                              : value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!isLoading && !reportData && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-blue-800 text-center">
              Configure your report settings above and click "Generate Report" to view the data.
            </p>
          </CardContent>
        </Card>
      )}

      <Toaster />
    </div>
  );
}
