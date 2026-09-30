package com.ims.reports.bean;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Production-Ready Performance Report DTO
 * - All numeric fields use BigDecimal for precision
 * - Never returns null - uses safe defaults
 * - Proper initialization in constructor
 */
public class PerformanceReportBean {
    private LocalDate startDate;
    private LocalDate endDate;
    private Long totalInvoices;
    private BigDecimal totalRevenue;
    private BigDecimal totalPaid;
    private BigDecimal totalOutstanding;
    private BigDecimal totalTax;
    private BigDecimal averageInvoiceValue;
    private Long paidInvoices;
    private Long unpaidInvoices;
    private Long overdueInvoices;
    private BigDecimal collectionRate;
    private BigDecimal overdueRate;
    private Integer averageDaysToPayment;
    private BigDecimal largestInvoice;
    private BigDecimal smallestInvoice;
    
    // Aging buckets
    private AgingBuckets agingBuckets;
    
    private List<CustomerPerformance> topCustomers;
    private List<MonthlyPerformance> monthlyBreakdown;
    private List<StatusBreakdown> statusBreakdown;
    private List<UserPerformance> userPerformance;

    public PerformanceReportBean() {
        // Initialize with safe defaults to prevent NaN/null issues
        this.totalInvoices = 0L;
        this.totalRevenue = BigDecimal.ZERO;
        this.totalPaid = BigDecimal.ZERO;
        this.totalOutstanding = BigDecimal.ZERO;
        this.totalTax = BigDecimal.ZERO;
        this.averageInvoiceValue = BigDecimal.ZERO;
        this.paidInvoices = 0L;
        this.unpaidInvoices = 0L;
        this.overdueInvoices = 0L;
        this.collectionRate = BigDecimal.ZERO;
        this.overdueRate = BigDecimal.ZERO;
        this.averageDaysToPayment = 0;
        this.largestInvoice = BigDecimal.ZERO;
        this.smallestInvoice = BigDecimal.ZERO;
        this.agingBuckets = new AgingBuckets();
        this.topCustomers = new ArrayList<>();
        this.monthlyBreakdown = new ArrayList<>();
        this.statusBreakdown = new ArrayList<>();
        this.userPerformance = new ArrayList<>();
    }

    // Getters with null-safe returns
    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Long getTotalInvoices() {
        return totalInvoices != null ? totalInvoices : 0L;
    }

    public void setTotalInvoices(Long totalInvoices) {
        this.totalInvoices = totalInvoices != null ? totalInvoices : 0L;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
    }

    public BigDecimal getTotalPaid() {
        return totalPaid != null ? totalPaid : BigDecimal.ZERO;
    }

    public void setTotalPaid(BigDecimal totalPaid) {
        this.totalPaid = totalPaid != null ? totalPaid : BigDecimal.ZERO;
    }

    public BigDecimal getTotalOutstanding() {
        return totalOutstanding != null ? totalOutstanding : BigDecimal.ZERO;
    }

    public void setTotalOutstanding(BigDecimal totalOutstanding) {
        this.totalOutstanding = totalOutstanding != null ? totalOutstanding : BigDecimal.ZERO;
    }

    public BigDecimal getTotalTax() {
        return totalTax != null ? totalTax : BigDecimal.ZERO;
    }

    public void setTotalTax(BigDecimal totalTax) {
        this.totalTax = totalTax != null ? totalTax : BigDecimal.ZERO;
    }

    public BigDecimal getAverageInvoiceValue() {
        return averageInvoiceValue != null ? averageInvoiceValue : BigDecimal.ZERO;
    }

    public void setAverageInvoiceValue(BigDecimal averageInvoiceValue) {
        this.averageInvoiceValue = averageInvoiceValue != null ? averageInvoiceValue : BigDecimal.ZERO;
    }

    public Long getPaidInvoices() {
        return paidInvoices != null ? paidInvoices : 0L;
    }

    public void setPaidInvoices(Long paidInvoices) {
        this.paidInvoices = paidInvoices != null ? paidInvoices : 0L;
    }

    public Long getUnpaidInvoices() {
        return unpaidInvoices != null ? unpaidInvoices : 0L;
    }

    public void setUnpaidInvoices(Long unpaidInvoices) {
        this.unpaidInvoices = unpaidInvoices != null ? unpaidInvoices : 0L;
    }

    public Long getOverdueInvoices() {
        return overdueInvoices != null ? overdueInvoices : 0L;
    }

    public void setOverdueInvoices(Long overdueInvoices) {
        this.overdueInvoices = overdueInvoices != null ? overdueInvoices : 0L;
    }

    public BigDecimal getCollectionRate() {
        return collectionRate != null ? collectionRate : BigDecimal.ZERO;
    }

    public void setCollectionRate(BigDecimal collectionRate) {
        this.collectionRate = collectionRate != null ? collectionRate : BigDecimal.ZERO;
    }

    public BigDecimal getOverdueRate() {
        return overdueRate != null ? overdueRate : BigDecimal.ZERO;
    }

    public void setOverdueRate(BigDecimal overdueRate) {
        this.overdueRate = overdueRate != null ? overdueRate : BigDecimal.ZERO;
    }

    public Integer getAverageDaysToPayment() {
        return averageDaysToPayment != null ? averageDaysToPayment : 0;
    }

    public void setAverageDaysToPayment(Integer averageDaysToPayment) {
        this.averageDaysToPayment = averageDaysToPayment != null ? averageDaysToPayment : 0;
    }

    public BigDecimal getLargestInvoice() {
        return largestInvoice != null ? largestInvoice : BigDecimal.ZERO;
    }

    public void setLargestInvoice(BigDecimal largestInvoice) {
        this.largestInvoice = largestInvoice != null ? largestInvoice : BigDecimal.ZERO;
    }

    public BigDecimal getSmallestInvoice() {
        return smallestInvoice != null ? smallestInvoice : BigDecimal.ZERO;
    }

    public void setSmallestInvoice(BigDecimal smallestInvoice) {
        this.smallestInvoice = smallestInvoice != null ? smallestInvoice : BigDecimal.ZERO;
    }

    public AgingBuckets getAgingBuckets() {
        return agingBuckets != null ? agingBuckets : new AgingBuckets();
    }

    public void setAgingBuckets(AgingBuckets agingBuckets) {
        this.agingBuckets = agingBuckets != null ? agingBuckets : new AgingBuckets();
    }

    public List<CustomerPerformance> getTopCustomers() {
        return topCustomers != null ? topCustomers : new ArrayList<>();
    }

    public void setTopCustomers(List<CustomerPerformance> topCustomers) {
        this.topCustomers = topCustomers != null ? topCustomers : new ArrayList<>();
    }

    public List<MonthlyPerformance> getMonthlyBreakdown() {
        return monthlyBreakdown != null ? monthlyBreakdown : new ArrayList<>();
    }

    public void setMonthlyBreakdown(List<MonthlyPerformance> monthlyBreakdown) {
        this.monthlyBreakdown = monthlyBreakdown != null ? monthlyBreakdown : new ArrayList<>();
    }

    public List<StatusBreakdown> getStatusBreakdown() {
        return statusBreakdown != null ? statusBreakdown : new ArrayList<>();
    }

    public void setStatusBreakdown(List<StatusBreakdown> statusBreakdown) {
        this.statusBreakdown = statusBreakdown != null ? statusBreakdown : new ArrayList<>();
    }

    public List<UserPerformance> getUserPerformance() {
        return userPerformance != null ? userPerformance : new ArrayList<>();
    }

    public void setUserPerformance(List<UserPerformance> userPerformance) {
        this.userPerformance = userPerformance != null ? userPerformance : new ArrayList<>();
    }

    // Nested classes with null-safe defaults
    public static class AgingBuckets {
        private BigDecimal days0to30;
        private BigDecimal days31to60;
        private BigDecimal days61to90;
        private BigDecimal days90Plus;
        
        public AgingBuckets() {
            this.days0to30 = BigDecimal.ZERO;
            this.days31to60 = BigDecimal.ZERO;
            this.days61to90 = BigDecimal.ZERO;
            this.days90Plus = BigDecimal.ZERO;
        }

        public BigDecimal getDays0to30() {
            return days0to30 != null ? days0to30 : BigDecimal.ZERO;
        }

        public void setDays0to30(BigDecimal days0to30) {
            this.days0to30 = days0to30 != null ? days0to30 : BigDecimal.ZERO;
        }

        public BigDecimal getDays31to60() {
            return days31to60 != null ? days31to60 : BigDecimal.ZERO;
        }

        public void setDays31to60(BigDecimal days31to60) {
            this.days31to60 = days31to60 != null ? days31to60 : BigDecimal.ZERO;
        }

        public BigDecimal getDays61to90() {
            return days61to90 != null ? days61to90 : BigDecimal.ZERO;
        }

        public void setDays61to90(BigDecimal days61to90) {
            this.days61to90 = days61to90 != null ? days61to90 : BigDecimal.ZERO;
        }

        public BigDecimal getDays90Plus() {
            return days90Plus != null ? days90Plus : BigDecimal.ZERO;
        }

        public void setDays90Plus(BigDecimal days90Plus) {
            this.days90Plus = days90Plus != null ? days90Plus : BigDecimal.ZERO;
        }
    }

    public static class CustomerPerformance {
        private String customerId;
        private String customerName;
        private Long invoiceCount;
        private BigDecimal totalAmount;
        private BigDecimal paidAmount;
        private BigDecimal outstandingAmount;

        public CustomerPerformance() {
            this.invoiceCount = 0L;
            this.totalAmount = BigDecimal.ZERO;
            this.paidAmount = BigDecimal.ZERO;
            this.outstandingAmount = BigDecimal.ZERO;
        }

        public String getCustomerId() {
            return customerId;
        }

        public void setCustomerId(String customerId) {
            this.customerId = customerId;
        }

        public String getCustomerName() {
            return customerName;
        }

        public void setCustomerName(String customerName) {
            this.customerName = customerName;
        }

        public Long getInvoiceCount() {
            return invoiceCount != null ? invoiceCount : 0L;
        }

        public void setInvoiceCount(Long invoiceCount) {
            this.invoiceCount = invoiceCount != null ? invoiceCount : 0L;
        }

        public BigDecimal getTotalAmount() {
            return totalAmount != null ? totalAmount : BigDecimal.ZERO;
        }

        public void setTotalAmount(BigDecimal totalAmount) {
            this.totalAmount = totalAmount != null ? totalAmount : BigDecimal.ZERO;
        }

        public BigDecimal getPaidAmount() {
            return paidAmount != null ? paidAmount : BigDecimal.ZERO;
        }

        public void setPaidAmount(BigDecimal paidAmount) {
            this.paidAmount = paidAmount != null ? paidAmount : BigDecimal.ZERO;
        }

        public BigDecimal getOutstandingAmount() {
            return outstandingAmount != null ? outstandingAmount : BigDecimal.ZERO;
        }

        public void setOutstandingAmount(BigDecimal outstandingAmount) {
            this.outstandingAmount = outstandingAmount != null ? outstandingAmount : BigDecimal.ZERO;
        }
    }

    public static class MonthlyPerformance {
        private String month;
        private Integer year;
        private Long invoiceCount;
        private BigDecimal totalAmount;
        private BigDecimal paidAmount;

        public MonthlyPerformance() {
            this.invoiceCount = 0L;
            this.totalAmount = BigDecimal.ZERO;
            this.paidAmount = BigDecimal.ZERO;
        }

        public String getMonth() {
            return month;
        }

        public void setMonth(String month) {
            this.month = month;
        }

        public Integer getYear() {
            return year;
        }

        public void setYear(Integer year) {
            this.year = year;
        }

        public Long getInvoiceCount() {
            return invoiceCount != null ? invoiceCount : 0L;
        }

        public void setInvoiceCount(Long invoiceCount) {
            this.invoiceCount = invoiceCount != null ? invoiceCount : 0L;
        }

        public BigDecimal getTotalAmount() {
            return totalAmount != null ? totalAmount : BigDecimal.ZERO;
        }

        public void setTotalAmount(BigDecimal totalAmount) {
            this.totalAmount = totalAmount != null ? totalAmount : BigDecimal.ZERO;
        }

        public BigDecimal getPaidAmount() {
            return paidAmount != null ? paidAmount : BigDecimal.ZERO;
        }

        public void setPaidAmount(BigDecimal paidAmount) {
            this.paidAmount = paidAmount != null ? paidAmount : BigDecimal.ZERO;
        }
    }

    public static class StatusBreakdown {
        private String status;
        private Long count;
        private BigDecimal totalAmount;
        private BigDecimal percentage;

        public StatusBreakdown() {
            this.count = 0L;
            this.totalAmount = BigDecimal.ZERO;
            this.percentage = BigDecimal.ZERO;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public Long getCount() {
            return count != null ? count : 0L;
        }

        public void setCount(Long count) {
            this.count = count != null ? count : 0L;
        }

        public BigDecimal getTotalAmount() {
            return totalAmount != null ? totalAmount : BigDecimal.ZERO;
        }

        public void setTotalAmount(BigDecimal totalAmount) {
            this.totalAmount = totalAmount != null ? totalAmount : BigDecimal.ZERO;
        }

        public BigDecimal getPercentage() {
            return percentage != null ? percentage : BigDecimal.ZERO;
        }

        public void setPercentage(BigDecimal percentage) {
            this.percentage = percentage != null ? percentage : BigDecimal.ZERO;
        }
    }

    public static class UserPerformance {
        private String userId;
        private String userName;
        private Long invoiceCount;
        private BigDecimal totalAmount;
        private BigDecimal collectedAmount;
        private BigDecimal collectionRate;

        public UserPerformance() {
            this.invoiceCount = 0L;
            this.totalAmount = BigDecimal.ZERO;
            this.collectedAmount = BigDecimal.ZERO;
            this.collectionRate = BigDecimal.ZERO;
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public Long getInvoiceCount() {
            return invoiceCount != null ? invoiceCount : 0L;
        }

        public void setInvoiceCount(Long invoiceCount) {
            this.invoiceCount = invoiceCount != null ? invoiceCount : 0L;
        }

        public BigDecimal getTotalAmount() {
            return totalAmount != null ? totalAmount : BigDecimal.ZERO;
        }

        public void setTotalAmount(BigDecimal totalAmount) {
            this.totalAmount = totalAmount != null ? totalAmount : BigDecimal.ZERO;
        }

        public BigDecimal getCollectedAmount() {
            return collectedAmount != null ? collectedAmount : BigDecimal.ZERO;
        }

        public void setCollectedAmount(BigDecimal collectedAmount) {
            this.collectedAmount = collectedAmount != null ? collectedAmount : BigDecimal.ZERO;
        }

        public BigDecimal getCollectionRate() {
            return collectionRate != null ? collectionRate : BigDecimal.ZERO;
        }

        public void setCollectionRate(BigDecimal collectionRate) {
            this.collectionRate = collectionRate != null ? collectionRate : BigDecimal.ZERO;
        }
    }
}
