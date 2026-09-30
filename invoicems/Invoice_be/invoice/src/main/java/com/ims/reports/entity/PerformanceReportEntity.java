package com.ims.reports.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "performance_reports")
public class PerformanceReportEntity {
    
    @Id
    @Column(name = "id", length = 20)
    private String id;
    
    @Column(name = "report_name", length = 100)
    private String reportName;
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    
    @Column(name = "report_type", length = 50)
    private String reportType;
    
    @Column(name = "filter_user_id", length = 20)
    private String filterUserId;
    
    @Column(name = "filter_customer_id", length = 20)
    private String filterCustomerId;
    
    @Column(name = "total_invoices")
    private Long totalInvoices;
    
    @Column(name = "total_revenue", precision = 15, scale = 2)
    private BigDecimal totalRevenue;
    
    @Column(name = "total_paid", precision = 15, scale = 2)
    private BigDecimal totalPaid;
    
    @Column(name = "total_outstanding", precision = 15, scale = 2)
    private BigDecimal totalOutstanding;
    
    @Column(name = "total_tax", precision = 15, scale = 2)
    private BigDecimal totalTax;
    
    @Column(name = "average_invoice_value", precision = 15, scale = 2)
    private BigDecimal averageInvoiceValue;
    
    @Column(name = "paid_invoices")
    private Long paidInvoices;
    
    @Column(name = "unpaid_invoices")
    private Long unpaidInvoices;
    
    @Column(name = "overdue_invoices")
    private Long overdueInvoices;
    
    @Column(name = "report_data", columnDefinition = "TEXT")
    private String reportData;
    
    @Column(name = "generated_by", length = 50)
    private String generatedBy;
    
    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt;

    public PerformanceReportEntity() {
        super();
    }

    public PerformanceReportEntity(String id, String reportName, LocalDate startDate, LocalDate endDate,
            String reportType, String filterUserId, String filterCustomerId, Long totalInvoices,
            BigDecimal totalRevenue, BigDecimal totalPaid, BigDecimal totalOutstanding, BigDecimal totalTax,
            BigDecimal averageInvoiceValue, Long paidInvoices, Long unpaidInvoices, Long overdueInvoices,
            String reportData, String generatedBy, LocalDateTime generatedAt) {
        super();
        this.id = id;
        this.reportName = reportName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.reportType = reportType;
        this.filterUserId = filterUserId;
        this.filterCustomerId = filterCustomerId;
        this.totalInvoices = totalInvoices;
        this.totalRevenue = totalRevenue;
        this.totalPaid = totalPaid;
        this.totalOutstanding = totalOutstanding;
        this.totalTax = totalTax;
        this.averageInvoiceValue = averageInvoiceValue;
        this.paidInvoices = paidInvoices;
        this.unpaidInvoices = unpaidInvoices;
        this.overdueInvoices = overdueInvoices;
        this.reportData = reportData;
        this.generatedBy = generatedBy;
        this.generatedAt = generatedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getReportName() {
        return reportName;
    }

    public void setReportName(String reportName) {
        this.reportName = reportName;
    }

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

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public String getFilterUserId() {
        return filterUserId;
    }

    public void setFilterUserId(String filterUserId) {
        this.filterUserId = filterUserId;
    }

    public String getFilterCustomerId() {
        return filterCustomerId;
    }

    public void setFilterCustomerId(String filterCustomerId) {
        this.filterCustomerId = filterCustomerId;
    }

    public Long getTotalInvoices() {
        return totalInvoices;
    }

    public void setTotalInvoices(Long totalInvoices) {
        this.totalInvoices = totalInvoices;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public BigDecimal getTotalPaid() {
        return totalPaid;
    }

    public void setTotalPaid(BigDecimal totalPaid) {
        this.totalPaid = totalPaid;
    }

    public BigDecimal getTotalOutstanding() {
        return totalOutstanding;
    }

    public void setTotalOutstanding(BigDecimal totalOutstanding) {
        this.totalOutstanding = totalOutstanding;
    }

    public BigDecimal getTotalTax() {
        return totalTax;
    }

    public void setTotalTax(BigDecimal totalTax) {
        this.totalTax = totalTax;
    }

    public BigDecimal getAverageInvoiceValue() {
        return averageInvoiceValue;
    }

    public void setAverageInvoiceValue(BigDecimal averageInvoiceValue) {
        this.averageInvoiceValue = averageInvoiceValue;
    }

    public Long getPaidInvoices() {
        return paidInvoices;
    }

    public void setPaidInvoices(Long paidInvoices) {
        this.paidInvoices = paidInvoices;
    }

    public Long getUnpaidInvoices() {
        return unpaidInvoices;
    }

    public void setUnpaidInvoices(Long unpaidInvoices) {
        this.unpaidInvoices = unpaidInvoices;
    }

    public Long getOverdueInvoices() {
        return overdueInvoices;
    }

    public void setOverdueInvoices(Long overdueInvoices) {
        this.overdueInvoices = overdueInvoices;
    }

    public String getReportData() {
        return reportData;
    }

    public void setReportData(String reportData) {
        this.reportData = reportData;
    }

    public String getGeneratedBy() {
        return generatedBy;
    }

    public void setGeneratedBy(String generatedBy) {
        this.generatedBy = generatedBy;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }
}
