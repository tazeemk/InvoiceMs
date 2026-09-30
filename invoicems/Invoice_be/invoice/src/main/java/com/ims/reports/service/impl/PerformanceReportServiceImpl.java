package com.ims.reports.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ims.invoices.entity.InvoicesEntity;
import com.ims.invoices.repository.InvoicesRepository;
import com.ims.reports.bean.PerformanceReportBean;
import com.ims.reports.entity.PerformanceReportEntity;
import com.ims.reports.repository.PerformanceReportRepository;
import com.ims.reports.service.PerformanceReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Production-Ready Performance Report Service
 * - Null-safe operations
 * - BigDecimal for precision
 * - No NaN/division by zero
 * - Optimized calculations
 */
@Service
public class PerformanceReportServiceImpl implements PerformanceReportService {

    @Autowired
    private InvoicesRepository invoicesRepository;
    
    @Autowired
    private PerformanceReportRepository performanceReportRepository;

    /**
     * Safe division that prevents ArithmeticException and returns ZERO for invalid operations
     */
    private BigDecimal safeDivide(BigDecimal numerator, BigDecimal denominator, int scale) {
        if (denominator == null || denominator.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        if (numerator == null) {
            return BigDecimal.ZERO;
        }
        try {
            return numerator.divide(denominator, scale, RoundingMode.HALF_UP);
        } catch (ArithmeticException e) {
            return BigDecimal.ZERO;
        }
    }

    /**
     * Calculate percentage with null/zero safety
     */
    private BigDecimal calculatePercentage(BigDecimal part, BigDecimal whole) {
        return safeDivide(part, whole, 2).multiply(BigDecimal.valueOf(100));
    }

    /**
     * Safe null-to-zero conversion for BigDecimal
     */
    private BigDecimal nullSafe(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    @Override
    public PerformanceReportBean generatePerformanceReport(LocalDate startDate, LocalDate endDate) {
        List<InvoicesEntity> invoices = invoicesRepository.findByInvoiceDateBetween(startDate, endDate);
        return buildPerformanceReport(invoices, startDate, endDate);
    }

    @Override
    public PerformanceReportBean generatePerformanceReportByUser(String userId, LocalDate startDate, LocalDate endDate) {
        List<InvoicesEntity> allInvoices = invoicesRepository.findByInvoiceDateBetween(startDate, endDate);
        List<InvoicesEntity> userInvoices = allInvoices.stream()
                .filter(inv -> userId.equals(inv.getAssignUserId()))
                .collect(Collectors.toList());
        return buildPerformanceReport(userInvoices, startDate, endDate);
    }

    @Override
    public PerformanceReportBean generatePerformanceReportByCustomer(String customerId, LocalDate startDate, LocalDate endDate) {
        List<InvoicesEntity> allInvoices = invoicesRepository.findByInvoiceDateBetween(startDate, endDate);
        List<InvoicesEntity> customerInvoices = allInvoices.stream()
                .filter(inv -> customerId.equals(inv.getCustomerId()))
                .collect(Collectors.toList());
        return buildPerformanceReport(customerInvoices, startDate, endDate);
    }

    private PerformanceReportBean buildPerformanceReport(List<InvoicesEntity> invoices, LocalDate startDate, LocalDate endDate) {
        PerformanceReportBean report = new PerformanceReportBean();
        report.setStartDate(startDate);
        report.setEndDate(endDate);

        // Handle empty dataset
        if (invoices == null || invoices.isEmpty()) {
            return report; // Returns with all zero values
        }

        // Basic metrics with null-safe aggregation
        report.setTotalInvoices((long) invoices.size());
        
        BigDecimal totalRevenue = invoices.stream()
                .map(inv -> nullSafe(inv.getGrandTotal()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        report.setTotalRevenue(totalRevenue);

        BigDecimal totalPaid = invoices.stream()
                .map(inv -> nullSafe(inv.getPaidAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        report.setTotalPaid(totalPaid);

        BigDecimal totalOutstanding = invoices.stream()
                .map(inv -> nullSafe(inv.getBalanceAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        report.setTotalOutstanding(totalOutstanding);

        BigDecimal totalTax = invoices.stream()
                .map(inv -> nullSafe(inv.getTotalTax()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        report.setTotalTax(totalTax);

        // Average invoice value with safe division
        report.setAverageInvoiceValue(
            safeDivide(totalRevenue, BigDecimal.valueOf(invoices.size()), 2)
        );

        // Status counts
        long paidCount = invoices.stream()
                .filter(inv -> "PAID".equalsIgnoreCase(inv.getStatus()))
                .count();
        report.setPaidInvoices(paidCount);

        long unpaidCount = invoices.stream()
                .filter(inv -> !"PAID".equalsIgnoreCase(inv.getStatus()))
                .count();
        report.setUnpaidInvoices(unpaidCount);

        // Overdue invoices
        LocalDate today = LocalDate.now();
        long overdueCount = invoices.stream()
                .filter(inv -> inv.getDueDate() != null && inv.getDueDate().isBefore(today))
                .filter(inv -> !"PAID".equalsIgnoreCase(inv.getStatus()))
                .count();
        report.setOverdueInvoices(overdueCount);

        // Collection efficiency with safe division
        report.setCollectionRate(calculatePercentage(totalPaid, totalRevenue));

        // Overdue rate
        report.setOverdueRate(
            safeDivide(BigDecimal.valueOf(overdueCount), BigDecimal.valueOf(invoices.size()), 2)
                .multiply(BigDecimal.valueOf(100))
        );

        // Average days to payment (for paid invoices only)
        List<InvoicesEntity> paidInvoices = invoices.stream()
                .filter(inv -> "PAID".equalsIgnoreCase(inv.getStatus()))
                .filter(inv -> inv.getInvoiceDate() != null && inv.getUpdatedAt() != null)
                .collect(Collectors.toList());
        
        if (!paidInvoices.isEmpty()) {
            long totalDays = paidInvoices.stream()
                    .mapToLong(inv -> java.time.temporal.ChronoUnit.DAYS.between(
                            inv.getInvoiceDate(), inv.getUpdatedAt().toLocalDate()))
                    .sum();
            report.setAverageDaysToPayment((int) (totalDays / paidInvoices.size()));
        }

        // Largest and smallest invoice with null filtering
        report.setLargestInvoice(
            invoices.stream()
                    .map(InvoicesEntity::getGrandTotal)
                    .filter(Objects::nonNull)
                    .max(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO)
        );
        
        report.setSmallestInvoice(
            invoices.stream()
                    .map(InvoicesEntity::getGrandTotal)
                    .filter(Objects::nonNull)
                    .filter(amount -> amount.compareTo(BigDecimal.ZERO) > 0)
                    .min(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO)
        );

        // Aging buckets
        report.setAgingBuckets(calculateAgingBuckets(invoices));

        // Aggregated data
        report.setTopCustomers(calculateTopCustomers(invoices));
        report.setMonthlyBreakdown(calculateMonthlyBreakdown(invoices));
        report.setStatusBreakdown(calculateStatusBreakdown(invoices, totalRevenue));
        report.setUserPerformance(calculateUserPerformance(invoices));

        return report;
    }

    /**
     * Calculate aging buckets for outstanding amounts
     */
    private PerformanceReportBean.AgingBuckets calculateAgingBuckets(List<InvoicesEntity> invoices) {
        PerformanceReportBean.AgingBuckets buckets = new PerformanceReportBean.AgingBuckets();
        LocalDate today = LocalDate.now();

        for (InvoicesEntity invoice : invoices) {
            // Skip paid invoices or those without due dates
            if (invoice.getDueDate() == null || "PAID".equalsIgnoreCase(invoice.getStatus())) {
                continue;
            }

            long daysOverdue = java.time.temporal.ChronoUnit.DAYS.between(invoice.getDueDate(), today);
            BigDecimal balance = nullSafe(invoice.getBalanceAmount());

            if (daysOverdue <= 0) {
                // Not yet due - include in 0-30 bucket
                buckets.setDays0to30(buckets.getDays0to30().add(balance));
            } else if (daysOverdue <= 30) {
                buckets.setDays0to30(buckets.getDays0to30().add(balance));
            } else if (daysOverdue <= 60) {
                buckets.setDays31to60(buckets.getDays31to60().add(balance));
            } else if (daysOverdue <= 90) {
                buckets.setDays61to90(buckets.getDays61to90().add(balance));
            } else {
                buckets.setDays90Plus(buckets.getDays90Plus().add(balance));
            }
        }

        return buckets;
    }

    private List<PerformanceReportBean.CustomerPerformance> calculateTopCustomers(List<InvoicesEntity> invoices) {
        Map<String, PerformanceReportBean.CustomerPerformance> customerMap = new HashMap<>();

        for (InvoicesEntity invoice : invoices) {
            String customerId = invoice.getCustomerId();
            if (customerId == null || customerId.isEmpty()) continue;
            
            PerformanceReportBean.CustomerPerformance perf = customerMap.computeIfAbsent(customerId, k -> {
                PerformanceReportBean.CustomerPerformance cp = new PerformanceReportBean.CustomerPerformance();
                cp.setCustomerId(customerId);
                cp.setCustomerName(invoice.getCustomerName());
                return cp;
            });

            perf.setInvoiceCount(perf.getInvoiceCount() + 1);
            perf.setTotalAmount(perf.getTotalAmount().add(nullSafe(invoice.getGrandTotal())));
            perf.setPaidAmount(perf.getPaidAmount().add(nullSafe(invoice.getPaidAmount())));
            perf.setOutstandingAmount(perf.getOutstandingAmount().add(nullSafe(invoice.getBalanceAmount())));
        }

        return customerMap.values().stream()
                .sorted((a, b) -> b.getTotalAmount().compareTo(a.getTotalAmount()))
                .limit(10)
                .collect(Collectors.toList());
    }

    private List<PerformanceReportBean.MonthlyPerformance> calculateMonthlyBreakdown(List<InvoicesEntity> invoices) {
        Map<String, PerformanceReportBean.MonthlyPerformance> monthlyMap = new HashMap<>();

        for (InvoicesEntity invoice : invoices) {
            if (invoice.getInvoiceDate() == null) continue;
            
            String key = invoice.getInvoiceDate().getYear() + "-" + invoice.getInvoiceDate().getMonthValue();
            PerformanceReportBean.MonthlyPerformance mp = monthlyMap.computeIfAbsent(key, k -> {
                PerformanceReportBean.MonthlyPerformance perf = new PerformanceReportBean.MonthlyPerformance();
                perf.setMonth(invoice.getInvoiceDate().getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH));
                perf.setYear(invoice.getInvoiceDate().getYear());
                return perf;
            });

            mp.setInvoiceCount(mp.getInvoiceCount() + 1);
            mp.setTotalAmount(mp.getTotalAmount().add(nullSafe(invoice.getGrandTotal())));
            mp.setPaidAmount(mp.getPaidAmount().add(nullSafe(invoice.getPaidAmount())));
        }

        return monthlyMap.values().stream()
                .sorted(Comparator.comparing(PerformanceReportBean.MonthlyPerformance::getYear)
                        .thenComparing(mp -> java.time.Month.valueOf(mp.getMonth().toUpperCase()).getValue()))
                .collect(Collectors.toList());
    }

    private List<PerformanceReportBean.StatusBreakdown> calculateStatusBreakdown(List<InvoicesEntity> invoices, BigDecimal totalRevenue) {
        Map<String, PerformanceReportBean.StatusBreakdown> statusMap = new HashMap<>();

        for (InvoicesEntity invoice : invoices) {
            String status = invoice.getStatus() != null ? invoice.getStatus() : "UNKNOWN";
            PerformanceReportBean.StatusBreakdown sb = statusMap.computeIfAbsent(status, k -> {
                PerformanceReportBean.StatusBreakdown breakdown = new PerformanceReportBean.StatusBreakdown();
                breakdown.setStatus(status);
                return breakdown;
            });

            sb.setCount(sb.getCount() + 1);
            sb.setTotalAmount(sb.getTotalAmount().add(nullSafe(invoice.getGrandTotal())));
        }

        // Calculate percentages with safe division
        for (PerformanceReportBean.StatusBreakdown sb : statusMap.values()) {
            sb.setPercentage(calculatePercentage(sb.getTotalAmount(), totalRevenue));
        }

        return new ArrayList<>(statusMap.values());
    }

    private List<PerformanceReportBean.UserPerformance> calculateUserPerformance(List<InvoicesEntity> invoices) {
        Map<String, PerformanceReportBean.UserPerformance> userMap = new HashMap<>();

        for (InvoicesEntity invoice : invoices) {
            String userId = invoice.getAssignUserId();
            if (userId == null || userId.isEmpty()) continue;
            
            PerformanceReportBean.UserPerformance perf = userMap.computeIfAbsent(userId, k -> {
                PerformanceReportBean.UserPerformance up = new PerformanceReportBean.UserPerformance();
                up.setUserId(userId);
                up.setUserName(invoice.getAssignUser() != null ? invoice.getAssignUser() : userId);
                return up;
            });

            perf.setInvoiceCount(perf.getInvoiceCount() + 1);
            perf.setTotalAmount(perf.getTotalAmount().add(nullSafe(invoice.getGrandTotal())));
            perf.setCollectedAmount(perf.getCollectedAmount().add(nullSafe(invoice.getPaidAmount())));
        }

        // Calculate collection rate for each user with safe division
        for (PerformanceReportBean.UserPerformance perf : userMap.values()) {
            perf.setCollectionRate(calculatePercentage(perf.getCollectedAmount(), perf.getTotalAmount()));
        }

        return userMap.values().stream()
                .sorted((a, b) -> b.getTotalAmount().compareTo(a.getTotalAmount()))
                .limit(10)
                .collect(Collectors.toList());
    }


    @Override
    public PerformanceReportEntity saveReport(PerformanceReportBean reportBean, String reportName, String reportType, String generatedBy) {
        PerformanceReportEntity entity = new PerformanceReportEntity();
        entity.setId(UUID.randomUUID().toString());
        entity.setReportName(reportName);
        entity.setStartDate(reportBean.getStartDate());
        entity.setEndDate(reportBean.getEndDate());
        entity.setReportType(reportType);
        entity.setTotalInvoices(reportBean.getTotalInvoices());
        entity.setTotalRevenue(reportBean.getTotalRevenue());
        entity.setTotalPaid(reportBean.getTotalPaid());
        entity.setTotalOutstanding(reportBean.getTotalOutstanding());
        entity.setTotalTax(reportBean.getTotalTax());
        entity.setAverageInvoiceValue(reportBean.getAverageInvoiceValue());
        entity.setPaidInvoices(reportBean.getPaidInvoices());
        entity.setUnpaidInvoices(reportBean.getUnpaidInvoices());
        entity.setOverdueInvoices(reportBean.getOverdueInvoices());
        entity.setGeneratedBy(generatedBy);
        entity.setGeneratedAt(LocalDateTime.now());
        
        try {
            ObjectMapper mapper = new ObjectMapper();
            entity.setReportData(mapper.writeValueAsString(reportBean));
        } catch (Exception e) {
            entity.setReportData("{}");
        }
        
        return performanceReportRepository.save(entity);
    }

    @Override
    public List<PerformanceReportEntity> getSavedReports() {
        return performanceReportRepository.findAll();
    }

    @Override
    public PerformanceReportEntity getSavedReportById(String id) {
        return performanceReportRepository.findById(id).orElse(null);
    }
}