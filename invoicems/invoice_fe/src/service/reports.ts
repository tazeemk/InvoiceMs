import { smClient } from "@/lib";
import moment from "moment";

// Safe number utility
export function safeNumber(value: any): number {
  if (typeof value === "number" && !isNaN(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

export interface ReportFilters {
  startDate: string;
  endDate: string;
}

export interface FinancialReportData {
  revenueData: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  categoryExpenses: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  cashFlowData: Array<{
    month: string;
    inflow: number;
    outflow: number;
  }>;
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    totalProfit: number;
    profitMargin: number;
  };
}

export interface PerformanceReportData {
  collectionRate: number;
  overdueRate: number;
  averageDaysToPayment: number;
  largestInvoice: number;
  totalPaid: number;
  totalOutstanding: number;
  totalInvoices: number;
  overdueInvoices: number;
  averageInvoiceValue: number;
  smallestInvoice: number;
  statusBreakdown: Array<{
    status: string;
    count: number;
    totalAmount: number;
  }>;
  topCustomers: Array<{
    customerName: string;
    totalAmount: number;
    paidAmount: number;
    outstandingAmount: number;
    invoiceCount: number;
  }>;
  userPerformance: Array<{
    userName: string;
    totalAmount: number;
    collectedAmount: number;
    invoiceCount: number;
    collectionRate: number;
  }>;
  monthlyBreakdown: Array<{
    month: string;
    year: number;
    invoiceCount: number;
    totalAmount: number;
    paidAmount: number;
  }>;
}

// Alias for backward compatibility
export type PerformanceReport = PerformanceReportData;

/**
 * Fetch financial report data
 */
export const fetchFinancialReport = async (
  filters: ReportFilters
): Promise<FinancialReportData> => {
  try {
    console.log("Fetching financial report with filters:", filters);
    
    // Fetch all invoices first (some APIs might not support date filtering)
    const invoiceResponse = await smClient.post("/invoices/getAllInvoicesFilter", {
      limit: 1000,
      filters: []
    });

    console.log("Invoice response:", invoiceResponse.data);

    let invoices = invoiceResponse.data || [];
    
    // Filter by date range on the client side
    const startMoment = moment(filters.startDate);
    const endMoment = moment(filters.endDate);
    
    invoices = invoices.filter((invoice: any) => {
      const invoiceDate = moment(invoice.invoiceDate);
      return invoiceDate.isBetween(startMoment, endMoment, 'day', '[]');
    });

    console.log(`Filtered ${invoices.length} invoices between ${filters.startDate} and ${filters.endDate}`);

    // Group data by month
    const monthlyData: Record<
      string,
      { revenue: number; expenses: number; paidAmount: number }
    > = {};

    invoices.forEach((invoice: any) => {
      const month = moment(invoice.invoiceDate).format("MMM");
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, expenses: 0, paidAmount: 0 };
      }
      monthlyData[month].revenue += invoice.grandTotal || 0;
      monthlyData[month].paidAmount += invoice.paidAmount || 0;
      // Estimate expenses as 60% of revenue (adjust based on your business logic)
      monthlyData[month].expenses += (invoice.grandTotal || 0) * 0.6;
    });

    // Convert to array format and sort by month
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueData = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        revenue: Math.round(data.revenue),
        expenses: Math.round(data.expenses),
        profit: Math.round(data.revenue - data.expenses),
      }))
      .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

    console.log("Revenue data:", revenueData);

    // Calculate category expenses (estimated breakdown)
    const totalExpenses = revenueData.reduce((sum, item) => sum + item.expenses, 0);
    const categoryExpenses = [
      { name: "Operations", value: Math.round(totalExpenses * 0.35), color: "#10b981" },
      { name: "Marketing", value: Math.round(totalExpenses * 0.15), color: "#3b82f6" },
      { name: "Salaries", value: Math.round(totalExpenses * 0.35), color: "#f59e0b" },
      { name: "Utilities", value: Math.round(totalExpenses * 0.08), color: "#ef4444" },
      { name: "Others", value: Math.round(totalExpenses * 0.07), color: "#8b5cf6" },
    ];

    // Cash flow data
    const cashFlowData = revenueData.map((item) => ({
      month: item.month,
      inflow: item.revenue,
      outflow: item.expenses,
    }));

    // Summary calculations
    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
    const totalExpensesSum = revenueData.reduce((sum, item) => sum + item.expenses, 0);
    const totalProfit = totalRevenue - totalExpensesSum;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    const result = {
      revenueData,
      categoryExpenses,
      cashFlowData,
      summary: {
        totalRevenue,
        totalExpenses: totalExpensesSum,
        totalProfit,
        profitMargin: parseFloat(profitMargin.toFixed(1)),
      },
    };

    console.log("Financial report result:", result);
    return result;
  } catch (error) {
    console.error("Error fetching financial report:", error);
    throw error;
  }
};

/**
 * Fetch performance report data
 */
export const fetchPerformanceReport = async (
  startDate: string,
  endDate: string
): Promise<PerformanceReportData> => {
  try {
    console.log("Fetching performance report with filters:", { startDate, endDate });
    
    // Fetch all invoices
    const invoiceResponse = await smClient.post("/invoices/getAllInvoicesFilter", {
      limit: 10000,
      filters: []
    });

    console.log("📊 Raw Invoice response:", invoiceResponse);
    console.log("📊 Invoice response data:", invoiceResponse.data);
    console.log("📊 Invoice response data type:", typeof invoiceResponse.data);
    console.log("📊 Is array?:", Array.isArray(invoiceResponse.data));

    let invoices = invoiceResponse.data || [];
    
    console.log("📊 Total invoices fetched:", invoices.length);
    if (invoices.length > 0) {
      console.log("📊 Sample invoice:", invoices[0]);
    }
    
    // Filter by date range
    const startMoment = moment(startDate);
    const endMoment = moment(endDate);
    
    invoices = invoices.filter((invoice: any) => {
      const invoiceDate = moment(invoice.invoiceDate);
      return invoiceDate.isBetween(startMoment, endMoment, 'day', '[]');
    });

    console.log(`📊 Filtered ${invoices.length} invoices between ${startDate} and ${endDate}`);

    if (invoices.length === 0) {
      return {
        collectionRate: 0,
        overdueRate: 0,
        averageDaysToPayment: 0,
        largestInvoice: 0,
        totalPaid: 0,
        totalOutstanding: 0,
        totalInvoices: 0,
        overdueInvoices: 0,
        averageInvoiceValue: 0,
        smallestInvoice: 0,
        statusBreakdown: [],
        topCustomers: [],
        userPerformance: [],
        monthlyBreakdown: [],
      };
    }

    // Calculate basic metrics
    const totalAmount = invoices.reduce((sum: number, inv: any) => sum + (inv.grandTotal || 0), 0);
    const totalPaid = invoices.reduce((sum: number, inv: any) => sum + (inv.paidAmount || 0), 0);
    const totalOutstanding = invoices.reduce((sum: number, inv: any) => sum + (inv.balanceAmount || 0), 0);
    const collectionRate = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

    // Calculate overdue invoices
    const today = moment();
    const overdueInvoices = invoices.filter((inv: any) => {
      if (inv.status === 'PAID') return false;
      const dueDate = moment(inv.dueDate);
      return dueDate.isBefore(today);
    }).length;
    const overdueRate = invoices.length > 0 ? (overdueInvoices / invoices.length) * 100 : 0;

    // Calculate average days to payment
    const paidInvoices = invoices.filter((inv: any) => inv.status === 'PAID');
    let totalDays = 0;
    let validPaidInvoices = 0;
    
    paidInvoices.forEach((inv: any) => {
      const invoiceDate = moment(inv.invoiceDate);
      const dueDate = moment(inv.dueDate);
      // Use updatedAt as a proxy for payment date if available
      const paymentDate = inv.updatedAt ? moment(inv.updatedAt) : dueDate;
      const days = paymentDate.diff(invoiceDate, 'days');
      if (days >= 0) {
        totalDays += days;
        validPaidInvoices++;
      }
    });
    const averageDaysToPayment = validPaidInvoices > 0 ? Math.round(totalDays / validPaidInvoices) : 0;

    // Find largest and smallest invoices
    const invoiceAmounts = invoices.map((inv: any) => inv.grandTotal || 0).filter((amt: number) => amt > 0);
    const largestInvoice = invoiceAmounts.length > 0 ? Math.max(...invoiceAmounts) : 0;
    const smallestInvoice = invoiceAmounts.length > 0 ? Math.min(...invoiceAmounts) : 0;
    const averageInvoiceValue = invoices.length > 0 ? totalAmount / invoices.length : 0;

    // Status breakdown
    const statusMap: Record<string, { count: number; totalAmount: number }> = {};
    invoices.forEach((inv: any) => {
      const status = inv.status || 'UNKNOWN';
      if (!statusMap[status]) {
        statusMap[status] = { count: 0, totalAmount: 0 };
      }
      statusMap[status].count += 1;
      statusMap[status].totalAmount += inv.grandTotal || 0;
    });
    const statusBreakdown = Object.entries(statusMap).map(([status, data]) => ({
      status,
      count: data.count,
      totalAmount: Math.round(data.totalAmount),
    }));

    // Top customers
    const customerMap: Record<string, {
      customerName: string;
      totalAmount: number;
      paidAmount: number;
      outstandingAmount: number;
      invoiceCount: number;
    }> = {};
    
    invoices.forEach((inv: any) => {
      const customerId = inv.customerId || inv.customerName || 'Unknown';
      const customerName = inv.customerName || 'Unknown Customer';
      
      if (!customerMap[customerId]) {
        customerMap[customerId] = {
          customerName,
          totalAmount: 0,
          paidAmount: 0,
          outstandingAmount: 0,
          invoiceCount: 0,
        };
      }
      customerMap[customerId].totalAmount += inv.grandTotal || 0;
      customerMap[customerId].paidAmount += inv.paidAmount || 0;
      customerMap[customerId].outstandingAmount += inv.balanceAmount || 0;
      customerMap[customerId].invoiceCount += 1;
    });

    const topCustomers = Object.values(customerMap)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 10);

    // User performance
    const userMap: Record<string, {
      userName: string;
      totalAmount: number;
      collectedAmount: number;
      invoiceCount: number;
    }> = {};
    
    invoices.forEach((inv: any) => {
      // Use assignUserId or createdBy as the user identifier
      const userId = inv.assignUserId || inv.createdBy || 'unassigned';
      // Use assignUser or createdBy as the user name
      const userName = inv.assignUser || inv.createdBy || 'Unassigned';
      
      if (!userMap[userId]) {
        userMap[userId] = {
          userName,
          totalAmount: 0,
          collectedAmount: 0,
          invoiceCount: 0,
        };
      }
      userMap[userId].totalAmount += inv.grandTotal || 0;
      userMap[userId].collectedAmount += inv.paidAmount || 0;
      userMap[userId].invoiceCount += 1;
    });

    const userPerformance = Object.values(userMap)
      .map(user => ({
        ...user,
        collectionRate: user.totalAmount > 0 ? (user.collectedAmount / user.totalAmount) * 100 : 0,
      }))
      .filter(user => user.invoiceCount > 0); // Only include users with invoices

    // Monthly breakdown
    const monthlyMap: Record<string, {
      month: string;
      year: number;
      invoiceCount: number;
      totalAmount: number;
      paidAmount: number;
    }> = {};

    invoices.forEach((inv: any) => {
      const date = moment(inv.invoiceDate);
      const key = date.format('YYYY-MM');
      const month = date.format('MMM');
      const year = date.year();
      
      if (!monthlyMap[key]) {
        monthlyMap[key] = {
          month,
          year,
          invoiceCount: 0,
          totalAmount: 0,
          paidAmount: 0,
        };
      }
      monthlyMap[key].invoiceCount += 1;
      monthlyMap[key].totalAmount += inv.grandTotal || 0;
      monthlyMap[key].paidAmount += inv.paidAmount || 0;
    });

    const monthlyBreakdown = Object.values(monthlyMap)
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
      });

    const result = {
      collectionRate: parseFloat(collectionRate.toFixed(2)),
      overdueRate: parseFloat(overdueRate.toFixed(2)),
      averageDaysToPayment,
      largestInvoice: Math.round(largestInvoice),
      totalPaid: Math.round(totalPaid),
      totalOutstanding: Math.round(totalOutstanding),
      totalInvoices: invoices.length,
      overdueInvoices,
      averageInvoiceValue: Math.round(averageInvoiceValue),
      smallestInvoice: Math.round(smallestInvoice),
      statusBreakdown,
      topCustomers,
      userPerformance,
      monthlyBreakdown,
    };

    console.log("📊 Performance report result:", result);
    console.log("📊 Status breakdown:", statusBreakdown);
    console.log("📊 Top customers:", topCustomers);
    console.log("📊 User performance:", userPerformance);
    console.log("📊 Monthly breakdown:", monthlyBreakdown);
    return result;
  } catch (error) {
    console.error("Error fetching performance report:", error);
    throw error;
  }
};


export interface CollectionReportData {
  collectionTrend: Array<{
    month: string;
    collected: number;
    pending: number;
    failed: number;
  }>;
  paymentMethodBreakdown: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  collectionByStatus: Array<{
    status: string;
    count: number;
    amount: number;
  }>;
  topCollectors: Array<{
    name: string;
    collected: number;
    count: number;
  }>;
  summary: {
    totalCollected: number;
    totalPending: number;
    collectionRate: number;
    avgCollectionTime: number;
  };
}

/**
 * Fetch collection report data
 */
export const fetchCollectionReport = async (
  filters: ReportFilters
): Promise<CollectionReportData> => {
  try {
    console.log("Fetching collection report with filters:", filters);
    
    // Fetch all invoices to calculate collections
    const invoiceResponse = await smClient.post("/invoices/getAllInvoicesFilter", {
      limit: 1000,
      filters: []
    });

    console.log("Invoice response for collections:", invoiceResponse.data);

    let invoices = invoiceResponse.data || [];
    
    // Filter by date range
    const startMoment = moment(filters.startDate);
    const endMoment = moment(filters.endDate);
    
    invoices = invoices.filter((invoice: any) => {
      const invoiceDate = moment(invoice.invoiceDate);
      return invoiceDate.isBetween(startMoment, endMoment, 'day', '[]');
    });

    console.log(`Filtered ${invoices.length} invoices for collection report`);

    // Group collections by month
    const monthlyCollections: Record<
      string,
      { collected: number; pending: number; failed: number }
    > = {};

    invoices.forEach((invoice: any) => {
      const month = moment(invoice.invoiceDate).format("MMM");
      if (!monthlyCollections[month]) {
        monthlyCollections[month] = { collected: 0, pending: 0, failed: 0 };
      }
      
      if (invoice.status === 'PAID') {
        monthlyCollections[month].collected += invoice.paidAmount || 0;
      } else if (invoice.status === 'CANCELLED') {
        monthlyCollections[month].failed += invoice.balanceAmount || 0;
      } else {
        monthlyCollections[month].pending += invoice.balanceAmount || 0;
      }
    });

    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const collectionTrend = Object.entries(monthlyCollections)
      .map(([month, data]) => ({
        month,
        collected: Math.round(data.collected),
        pending: Math.round(data.pending),
        failed: Math.round(data.failed),
      }))
      .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

    // Payment method breakdown (estimated - replace with actual data if available)
    const totalCollected = collectionTrend.reduce((sum, item) => sum + item.collected, 0);
    const paymentMethodBreakdown = [
      { name: "Cash", value: Math.round(totalCollected * 0.35), color: "#10b981" },
      { name: "UPI", value: Math.round(totalCollected * 0.40), color: "#3b82f6" },
      { name: "Cheque", value: Math.round(totalCollected * 0.15), color: "#f59e0b" },
      { name: "Bank Transfer", value: Math.round(totalCollected * 0.10), color: "#8b5cf6" },
    ];

    // Collection by status
    const statusCounts: Record<string, { count: number; amount: number }> = {};
    invoices.forEach((invoice: any) => {
      const status = invoice.status || 'UNKNOWN';
      if (!statusCounts[status]) {
        statusCounts[status] = { count: 0, amount: 0 };
      }
      statusCounts[status].count += 1;
      statusCounts[status].amount += invoice.paidAmount || 0;
    });

    const collectionByStatus = Object.entries(statusCounts).map(([status, data]) => ({
      status,
      count: data.count,
      amount: Math.round(data.amount),
    }));

    // Top collectors (mock data - replace with actual user data)
    const topCollectors = [
      { name: "Ramesh Kumar", collected: Math.round(totalCollected * 0.30), count: 45 },
      { name: "Suresh Patel", collected: Math.round(totalCollected * 0.25), count: 38 },
      { name: "Amit Singh", collected: Math.round(totalCollected * 0.20), count: 32 },
      { name: "Rajesh Sharma", collected: Math.round(totalCollected * 0.15), count: 28 },
      { name: "Vijay Gupta", collected: Math.round(totalCollected * 0.10), count: 22 },
    ];

    // Summary calculations
    const totalPending = collectionTrend.reduce((sum, item) => sum + item.pending, 0);
    const totalAmount = totalCollected + totalPending;
    const collectionRate = totalAmount > 0 ? (totalCollected / totalAmount) * 100 : 0;

    const result = {
      collectionTrend,
      paymentMethodBreakdown,
      collectionByStatus,
      topCollectors,
      summary: {
        totalCollected,
        totalPending,
        collectionRate: parseFloat(collectionRate.toFixed(1)),
        avgCollectionTime: 5.2, // Mock data - calculate from actual collection dates
      },
    };

    console.log("Collection report result:", result);
    return result;
  } catch (error) {
    console.error("Error fetching collection report:", error);
    throw error;
  }
};

export interface CustomReportFilters extends ReportFilters {
  reportType: 'invoice' | 'order' | 'payment' | 'customer';
  groupBy: 'day' | 'week' | 'month' | 'year';
  metrics: string[];
}

export interface CustomReportData {
  chartData: Array<Record<string, any>>;
  tableData: Array<Record<string, any>>;
  summary: Record<string, any>;
}

/**
 * Fetch custom report data based on user selections
 */
export const fetchCustomReport = async (
  filters: CustomReportFilters
): Promise<CustomReportData> => {
  try {
    console.log("Fetching custom report with filters:", filters);
    
    let data: any[] = [];
    let endpoint = "";

    // Determine which data to fetch based on report type
    switch (filters.reportType) {
      case 'invoice':
        endpoint = "/invoices/getAllInvoicesFilter";
        break;
      case 'order':
        endpoint = "/order/filterOrder";
        break;
      case 'payment':
        endpoint = "/invoices/getAllInvoicesFilter"; // Payments are part of invoices
        break;
      case 'customer':
        endpoint = "/customers/getAllCustomers";
        break;
      default:
        endpoint = "/invoices/getAllInvoicesFilter";
    }

    const response = await smClient.post(endpoint, {
      limit: 1000,
      filters: []
    });

    data = response.data || [];

    // Filter by date range
    const startMoment = moment(filters.startDate);
    const endMoment = moment(filters.endDate);
    
    data = data.filter((item: any) => {
      const dateField = filters.reportType === 'order' ? 'orderDate' : 
                       filters.reportType === 'customer' ? 'createdAt' : 'invoiceDate';
      const itemDate = moment(item[dateField]);
      return itemDate.isBetween(startMoment, endMoment, 'day', '[]');
    });

    console.log(`Filtered ${data.length} records for custom report`);

    // Group data based on groupBy selection
    const groupedData: Record<string, any[]> = {};
    
    data.forEach((item: any) => {
      const dateField = filters.reportType === 'order' ? 'orderDate' : 
                       filters.reportType === 'customer' ? 'createdAt' : 'invoiceDate';
      const itemDate = moment(item[dateField]);
      
      let groupKey = '';
      switch (filters.groupBy) {
        case 'day':
          groupKey = itemDate.format('MMM DD');
          break;
        case 'week':
          groupKey = `Week ${itemDate.week()}`;
          break;
        case 'month':
          groupKey = itemDate.format('MMM YYYY');
          break;
        case 'year':
          groupKey = itemDate.format('YYYY');
          break;
      }
      
      if (!groupedData[groupKey]) {
        groupedData[groupKey] = [];
      }
      groupedData[groupKey].push(item);
    });

    // Calculate metrics for each group
    const chartData = Object.entries(groupedData).map(([period, items]) => {
      const result: Record<string, any> = { period };
      
      filters.metrics.forEach(metric => {
        switch (metric) {
          case 'count':
            result.count = items.length;
            break;
          case 'total':
            result.total = items.reduce((sum, item) => 
              sum + (item.grandTotal || item.totalAmount || 0), 0);
            break;
          case 'paid':
            result.paid = items.reduce((sum, item) => 
              sum + (item.paidAmount || 0), 0);
            break;
          case 'pending':
            result.pending = items.reduce((sum, item) => 
              sum + (item.balanceAmount || 0), 0);
            break;
          case 'average':
            const total = items.reduce((sum, item) => 
              sum + (item.grandTotal || item.totalAmount || 0), 0);
            result.average = items.length > 0 ? Math.round(total / items.length) : 0;
            break;
        }
      });
      
      return result;
    });

    // Create table data (top 10 records)
    const tableData = data.slice(0, 10).map((item: any) => {
      if (filters.reportType === 'invoice') {
        return {
          id: item.invoiceNo || item.id,
          date: moment(item.invoiceDate).format('MMM DD, YYYY'),
          customer: item.customerName,
          amount: item.grandTotal,
          paid: item.paidAmount,
          status: item.status,
        };
      } else if (filters.reportType === 'order') {
        return {
          id: item.orderNumber || item.id,
          date: moment(item.orderDate).format('MMM DD, YYYY'),
          customer: item.customer,
          amount: item.totalAmount,
          status: item.status,
        };
      } else if (filters.reportType === 'customer') {
        return {
          id: item.customerCode || item.id,
          name: item.businessName,
          contact: item.mobile,
          outstanding: item.currentOutstanding,
          status: item.status,
        };
      }
      return item;
    });

    // Calculate summary
    const summary: Record<string, any> = {
      totalRecords: data.length,
    };

    filters.metrics.forEach(metric => {
      switch (metric) {
        case 'total':
          summary.totalAmount = data.reduce((sum, item) => 
            sum + (item.grandTotal || item.totalAmount || 0), 0);
          break;
        case 'paid':
          summary.totalPaid = data.reduce((sum, item) => 
            sum + (item.paidAmount || 0), 0);
          break;
        case 'pending':
          summary.totalPending = data.reduce((sum, item) => 
            sum + (item.balanceAmount || 0), 0);
          break;
        case 'average':
          const total = data.reduce((sum, item) => 
            sum + (item.grandTotal || item.totalAmount || 0), 0);
          summary.averageAmount = data.length > 0 ? Math.round(total / data.length) : 0;
          break;
      }
    });

    const result = {
      chartData,
      tableData,
      summary,
    };

    console.log("Custom report result:", result);
    return result;
  } catch (error) {
    console.error("Error fetching custom report:", error);
    throw error;
  }
};


export interface CustomerReportData {
  customerGrowth: Array<{
    month: string;
    newCustomers: number;
    activeCustomers: number;
    inactiveCustomers: number;
  }>;
  customersByCity: Array<{
    city: string;
    count: number;
    outstanding: number;
  }>;
  customersByState: Array<{
    state: string;
    count: number;
    outstanding: number;
  }>;
  outstandingDistribution: Array<{
    range: string;
    count: number;
    totalOutstanding: number;
  }>;
  topCustomers: Array<{
    businessName: string;
    customerCode: string;
    totalPurchases: number;
    outstanding: number;
    creditDays: number;
  }>;
  summary: {
    totalCustomers: number;
    activeCustomers: number;
    inactiveCustomers: number;
    totalOutstanding: number;
    avgOutstanding: number;
    avgCreditDays: number;
  };
}

/**
 * Fetch customer report data
 */
export const fetchCustomerReport = async (
  filters: ReportFilters & { 
    status?: 'ACTIVE' | 'INACTIVE' | 'ALL';
    city?: string;
    state?: string;
  }
): Promise<CustomerReportData> => {
  try {
    console.log("Fetching customer report with filters:", filters);
    
    // Fetch all customers
    const customerResponse = await smClient.get("/customers/getAllCustomers");
    console.log("Customer response:", customerResponse.data);

    let customers = customerResponse.data || [];
    
    // Apply status filter
    if (filters.status && filters.status !== 'ALL') {
      customers = customers.filter((c: any) => c.status === filters.status);
    }

    // Apply city filter
    if (filters.city && filters.city !== 'ALL') {
      customers = customers.filter((c: any) => c.city === filters.city);
    }

    // Apply state filter
    if (filters.state && filters.state !== 'ALL') {
      customers = customers.filter((c: any) => c.state === filters.state);
    }

    // Filter by date range (based on createdAt)
    const startMoment = moment(filters.startDate);
    const endMoment = moment(filters.endDate);
    
    const filteredCustomers = customers.filter((customer: any) => {
      const createdDate = moment(customer.createdAt);
      return createdDate.isBetween(startMoment, endMoment, 'day', '[]');
    });

    console.log(`Filtered ${filteredCustomers.length} customers`);

    // Customer growth by month
    const monthlyGrowth: Record<
      string,
      { newCustomers: number; activeCustomers: number; inactiveCustomers: number }
    > = {};

    filteredCustomers.forEach((customer: any) => {
      const month = moment(customer.createdAt).format("MMM");
      if (!monthlyGrowth[month]) {
        monthlyGrowth[month] = { newCustomers: 0, activeCustomers: 0, inactiveCustomers: 0 };
      }
      monthlyGrowth[month].newCustomers += 1;
      if (customer.status === 'ACTIVE') {
        monthlyGrowth[month].activeCustomers += 1;
      } else {
        monthlyGrowth[month].inactiveCustomers += 1;
      }
    });

    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const customerGrowth = Object.entries(monthlyGrowth)
      .map(([month, data]) => ({
        month,
        newCustomers: data.newCustomers,
        activeCustomers: data.activeCustomers,
        inactiveCustomers: data.inactiveCustomers,
      }))
      .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

    // Customers by city
    const cityData: Record<string, { count: number; outstanding: number }> = {};
    customers.forEach((customer: any) => {
      const city = customer.city || 'Unknown';
      if (!cityData[city]) {
        cityData[city] = { count: 0, outstanding: 0 };
      }
      cityData[city].count += 1;
      cityData[city].outstanding += customer.currentOutstanding || 0;
    });

    const customersByCity = Object.entries(cityData)
      .map(([city, data]) => ({
        city,
        count: data.count,
        outstanding: Math.round(data.outstanding),
      }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10); // Top 10 cities

    // Customers by state
    const stateData: Record<string, { count: number; outstanding: number }> = {};
    customers.forEach((customer: any) => {
      const state = customer.state || 'Unknown';
      if (!stateData[state]) {
        stateData[state] = { count: 0, outstanding: 0 };
      }
      stateData[state].count += 1;
      stateData[state].outstanding += customer.currentOutstanding || 0;
    });

    const customersByState = Object.entries(stateData)
      .map(([state, data]) => ({
        state,
        count: data.count,
        outstanding: Math.round(data.outstanding),
      }))
      .sort((a: any, b: any) => b.count - a.count);

    // Outstanding distribution
    const outstandingRanges = [
      { range: '0-10K', min: 0, max: 10000 },
      { range: '10K-50K', min: 10000, max: 50000 },
      { range: '50K-1L', min: 50000, max: 100000 },
      { range: '1L-5L', min: 100000, max: 500000 },
      { range: '5L+', min: 500000, max: Infinity },
    ];

    const outstandingDistribution = outstandingRanges.map(range => {
      const customersInRange = customers.filter((c: any) => {
        const outstanding = c.currentOutstanding || 0;
        return outstanding >= range.min && outstanding < range.max;
      });
      return {
        range: range.range,
        count: customersInRange.length,
        totalOutstanding: Math.round(
          customersInRange.reduce((sum: number, c: any) => sum + (c.currentOutstanding || 0), 0)
        ),
      };
    });

    // Fetch invoices to calculate top customers by purchases
    let invoices: any[] = [];
    try {
      const invoiceResponse = await smClient.post("/invoices/getAllInvoicesFilter", {
        limit: 1000,
        filters: []
      });
      invoices = invoiceResponse.data || [];
    } catch (error) {
      console.warn("Could not fetch invoices for customer purchases:", error);
    }

    // Calculate total purchases per customer
    const customerPurchases: Record<string, number> = {};
    invoices.forEach((invoice: any) => {
      const customerId = invoice.customerId;
      if (!customerPurchases[customerId]) {
        customerPurchases[customerId] = 0;
      }
      customerPurchases[customerId] += invoice.grandTotal || 0;
    });

    // Top customers by purchases
    const topCustomers = customers
      .map((customer: any) => ({
        businessName: customer.businessName,
        customerCode: customer.customerCode,
        totalPurchases: Math.round(customerPurchases[customer.id] || 0),
        outstanding: customer.currentOutstanding || 0,
        creditDays: customer.creditDays || 0,
      }))
      .sort((a: any, b: any) => b.totalPurchases - a.totalPurchases)
      .slice(0, 10);

    // Summary calculations
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c: any) => c.status === 'ACTIVE').length;
    const inactiveCustomers = totalCustomers - activeCustomers;
    const totalOutstanding = customers.reduce((sum: number, c: any) => sum + (c.currentOutstanding || 0), 0);
    const avgOutstanding = totalCustomers > 0 ? totalOutstanding / totalCustomers : 0;
    const avgCreditDays = totalCustomers > 0 
      ? customers.reduce((sum: number, c: any) => sum + (c.creditDays || 0), 0) / totalCustomers 
      : 0;

    const result = {
      customerGrowth,
      customersByCity,
      customersByState,
      outstandingDistribution,
      topCustomers,
      summary: {
        totalCustomers,
        activeCustomers,
        inactiveCustomers,
        totalOutstanding: Math.round(totalOutstanding),
        avgOutstanding: Math.round(avgOutstanding),
        avgCreditDays: Math.round(avgCreditDays),
      },
    };

    console.log("Customer report result:", result);
    return result;
  } catch (error) {
    console.error("Error fetching customer report:", error);
    throw error;
  }
};
