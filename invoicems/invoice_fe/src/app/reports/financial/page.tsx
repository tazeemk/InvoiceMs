"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, TrendingUp, Wallet, Calendar, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import moment from "moment";
import { fetchFinancialReport, FinancialReportData } from "@/service/reports";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function FinancialReport() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<FinancialReportData | null>(null);
  
  // Date filters - default to last 6 months
  const [startDate, setStartDate] = useState(
    moment().subtract(6, "months").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));

  const loadReportData = async () => {
    setIsLoading(true);
    try {
      console.log("Loading financial report...");
      const data = await fetchFinancialReport({ startDate, endDate });
      console.log("Financial report loaded:", data);
      setReportData(data);
      toast({
        title: "Success",
        description: "Financial report loaded successfully",
      });
    } catch (error: any) {
      console.error("Error loading financial report:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to load financial report data";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  const handleApplyFilters = () => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500">No data available</p>
        <Button onClick={loadReportData}>Retry</Button>
      </div>
    );
  }

  const { revenueData, categoryExpenses, cashFlowData, summary } = reportData;

  // Show message if no data in the selected range
  const hasData = revenueData.length > 0;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Financial Report</h1>
      </div>

      {/* Date Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filter by Date Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Quick Date Range Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStartDate(moment().subtract(7, "days").format("YYYY-MM-DD"));
                  setEndDate(moment().format("YYYY-MM-DD"));
                }}
              >
                Last 7 Days
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStartDate(moment().subtract(1, "month").format("YYYY-MM-DD"));
                  setEndDate(moment().format("YYYY-MM-DD"));
                }}
              >
                Last Month
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStartDate(moment().subtract(3, "months").format("YYYY-MM-DD"));
                  setEndDate(moment().format("YYYY-MM-DD"));
                }}
              >
                Last 3 Months
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStartDate(moment().subtract(6, "months").format("YYYY-MM-DD"));
                  setEndDate(moment().format("YYYY-MM-DD"));
                }}
              >
                Last 6 Months
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStartDate(moment().subtract(1, "year").format("YYYY-MM-DD"));
                  setEndDate(moment().format("YYYY-MM-DD"));
                }}
              >
                Last Year
              </Button>
            </div>

            {/* Custom Date Range */}
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  End Date
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                />
              </div>
              <Button onClick={handleApplyFilters} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {!hasData && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <p className="text-yellow-800 text-center">
              No invoice data found for the selected date range. Try selecting a different date range or check if invoices exist in your system.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{summary.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-emerald-100 mt-1">
              From {moment(startDate).format("MMM DD")} to {moment(endDate).format("MMM DD, YYYY")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Wallet className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{summary.totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-blue-100 mt-1">
              {((summary.totalExpenses / summary.totalRevenue) * 100).toFixed(1)}% of revenue
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{summary.totalProfit.toLocaleString()}</div>
            <p className="text-xs text-purple-100 mt-1">
              {summary.totalProfit >= 0 ? "Profit" : "Loss"} for selected period
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <TrendingUp className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.profitMargin}%</div>
            <p className="text-xs text-orange-100 mt-1">
              Net profit percentage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stackId="2"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryExpenses}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryExpenses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Profit Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Profit Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cash Flow */}
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="inflow" fill="#10b981" />
                <Bar dataKey="outflow" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
