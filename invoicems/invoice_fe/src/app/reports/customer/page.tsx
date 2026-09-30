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
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  RefreshCw,
  MapPin,
  Building2,
  CreditCard,
  Download,
} from "lucide-react";
import { useState, useEffect } from "react";
import moment from "moment";
import { fetchCustomerReport, CustomerReportData } from "@/service/reports";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function CustomerReport() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<CustomerReportData | null>(null);
  
  // Filters
  const [startDate, setStartDate] = useState(
    moment().subtract(1, "year").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'INACTIVE' | 'ALL'>('ALL');
  const [cityFilter, setCityFilter] = useState<string>('ALL');
  const [stateFilter, setStateFilter] = useState<string>('ALL');

  // Available cities and states (will be populated from data)
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableStates, setAvailableStates] = useState<string[]>([]);

  const loadReportData = async () => {
    setIsLoading(true);
    try {
      console.log("Loading customer report...");
      const data = await fetchCustomerReport({
        startDate,
        endDate,
        status: statusFilter,
        city: cityFilter,
        state: stateFilter,
      });
      console.log("Customer report loaded:", data);
      setReportData(data);

      // Extract unique cities and states
      const cities = [...new Set(data.customersByCity.map(c => c.city))];
      const states = [...new Set(data.customersByState.map(c => c.state))];
      setAvailableCities(cities);
      setAvailableStates(states);

      toast({
        title: "Success",
        description: "Customer report loaded successfully",
      });
    } catch (error: any) {
      console.error("Error loading customer report:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to load customer report data";
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

  const handleExport = () => {
    if (!reportData) return;
    
    const csvContent = [
      ['Customer Report', moment().format('YYYY-MM-DD')],
      [],
      ['Summary'],
      ['Total Customers', reportData.summary.totalCustomers],
      ['Active Customers', reportData.summary.activeCustomers],
      ['Inactive Customers', reportData.summary.inactiveCustomers],
      ['Total Outstanding', reportData.summary.totalOutstanding],
      ['Average Outstanding', reportData.summary.avgOutstanding],
      ['Average Credit Days', reportData.summary.avgCreditDays],
      [],
      ['Top Customers'],
      ['Business Name', 'Customer Code', 'Total Purchases', 'Outstanding', 'Credit Days'],
      ...reportData.topCustomers.map(c => [
        c.businessName, c.customerCode, c.totalPurchases, c.outstanding, c.creditDays
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customer-report-${moment().format('YYYY-MM-DD')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Customer report has been exported to CSV",
    });
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

  const {
    customerGrowth,
    customersByCity,
    customersByState,
    outstandingDistribution,
    topCustomers,
    summary,
  } = reportData;

  const hasData = customerGrowth.length > 0;

  // Colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Customer Report</h1>
        <Button onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Status, City, State Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Customer Status
                </label>
                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Customers</SelectItem>
                    <SelectItem value="ACTIVE">Active Only</SelectItem>
                    <SelectItem value="INACTIVE">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  City
                </label>
                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Cities</SelectItem>
                    {availableCities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  State
                </label>
                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All States</SelectItem>
                    {availableStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Date Range (Customer Creation Date)
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
                <Button onClick={handleApplyFilters} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {!hasData && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <p className="text-yellow-800 text-center">
              No customer data found for the selected filters. Try adjusting your filters.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalCustomers}</div>
            <p className="text-xs text-blue-100 mt-1">
              {summary.activeCustomers} active, {summary.inactiveCustomers} inactive
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <DollarSign className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{summary.totalOutstanding.toLocaleString()}</div>
            <p className="text-xs text-orange-100 mt-1">
              Across all customers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Outstanding</CardTitle>
            <TrendingUp className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{summary.avgOutstanding.toLocaleString()}</div>
            <p className="text-xs text-green-100 mt-1">
              Per customer
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.activeCustomers}</div>
            <p className="text-xs text-purple-100 mt-1">
              {((summary.activeCustomers / summary.totalCustomers) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Credit Days</CardTitle>
            <CreditCard className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.avgCreditDays} days</div>
            <p className="text-xs text-pink-100 mt-1">
              Average credit period
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Locations</CardTitle>
            <MapPin className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersByState.length}</div>
            <p className="text-xs text-indigo-100 mt-1">
              States with customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="newCustomers"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="New Customers"
                />
                <Line
                  type="monotone"
                  dataKey="activeCustomers"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Active"
                />
                <Line
                  type="monotone"
                  dataKey="inactiveCustomers"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Inactive"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Outstanding Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Outstanding Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={outstandingDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Customers" />
                <Bar dataKey="totalOutstanding" fill="#f59e0b" name="Outstanding (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customers by State */}
        <Card>
          <CardHeader>
            <CardTitle>Customers by State</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customersByState.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => {
                    const { state, percent } = props;
                    return `${state}: ${((percent || 0) * 100).toFixed(0)}%`;
                  }}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {customersByState.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Cities */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Cities by Customer Count</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={customersByCity} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="city" type="category" width={80} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8b5cf6" name="Customers" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Customers by Total Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Business Name</th>
                  <th className="text-left p-3">Customer Code</th>
                  <th className="text-right p-3">Total Purchases</th>
                  <th className="text-right p-3">Outstanding</th>
                  <th className="text-right p-3">Credit Days</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      {customer.businessName}
                    </td>
                    <td className="p-3 text-gray-600">{customer.customerCode}</td>
                    <td className="text-right p-3 font-semibold text-green-600">
                      ₹{customer.totalPurchases.toLocaleString()}
                    </td>
                    <td className="text-right p-3 text-orange-600">
                      ₹{customer.outstanding.toLocaleString()}
                    </td>
                    <td className="text-right p-3">{customer.creditDays} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* City-wise Outstanding */}
      <Card>
        <CardHeader>
          <CardTitle>City-wise Customer Distribution & Outstanding</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">City</th>
                  <th className="text-right p-3">Customer Count</th>
                  <th className="text-right p-3">Total Outstanding</th>
                  <th className="text-right p-3">Avg Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {customersByCity.map((city, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {city.city}
                    </td>
                    <td className="text-right p-3">{city.count}</td>
                    <td className="text-right p-3 font-semibold text-orange-600">
                      ₹{city.outstanding.toLocaleString()}
                    </td>
                    <td className="text-right p-3">
                      ₹{Math.round(city.outstanding / city.count).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Toaster />
    </div>
  );
}
