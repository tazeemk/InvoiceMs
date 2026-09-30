

package com.ims.receipt.controller;

import com.ims.receipt.bean.ReceiptBean;

import com.ims.receipt.service.ReceiptService;

import ReceiptReportBean.ReceiptReportBean;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/receipts/report")
public class ReceiptReportController {

    @Autowired
    private ReceiptService receiptService;

    /**
     * GET /receipts/report/summary?startDate=2024-01-01&endDate=2024-12-31
     * Returns full report summary including KPIs, monthly trend, payment breakdown, top customers.
     */
    @GetMapping("/summary")
    public ResponseEntity<ReceiptReportBean> getReceiptReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<ReceiptBean> receipts;

            if (startDate != null && endDate != null) {
                receipts = receiptService.getReceiptsByDateRange(startDate, endDate);
            } else {
                receipts = receiptService.getAllReceipts();
            }

            ReceiptReportBean report = buildReport(receipts, startDate, endDate);
            return ResponseEntity.ok(report);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /* ─────────── Private Builder ─────────── */

    private ReceiptReportBean buildReport(List<ReceiptBean> receipts,
                                          LocalDate startDate, LocalDate endDate) {

        ReceiptReportBean report = new ReceiptReportBean();

        report.setStartDate(startDate);
        report.setEndDate(endDate);
        report.setTotalReceipts(receipts.size());

        // ── KPIs ──
        BigDecimal totalAmount = receipts.stream()
                .map(r -> r.getAmount() != null ? r.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        report.setTotalAmount(totalAmount);

        BigDecimal totalBalance = receipts.stream()
                .map(r -> r.getBalanceOutstanding() != null ? r.getBalanceOutstanding() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        report.setTotalBalanceOutstanding(totalBalance);

        BigDecimal avgAmount = receipts.isEmpty() ? BigDecimal.ZERO
                : totalAmount.divide(BigDecimal.valueOf(receipts.size()), 2, java.math.RoundingMode.HALF_UP);
        report.setAverageReceiptAmount(avgAmount);

        // ── Monthly Trend ──
        Map<String, BigDecimal> monthlyTrend = new LinkedHashMap<>();
        String[] months = {"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"};
        for (String m : months) monthlyTrend.put(m, BigDecimal.ZERO);

        receipts.stream()
                .filter(r -> r.getReceiptDate() != null)
                .forEach(r -> {
                    String month = months[r.getReceiptDate().getMonthValue() - 1];
                    monthlyTrend.merge(month,
                            r.getAmount() != null ? r.getAmount() : BigDecimal.ZERO,
                            BigDecimal::add);
                });
        report.setMonthlyTrend(monthlyTrend);

        // ── Payment Method Breakdown ──
        Map<String, Long> paymentMethodCount = receipts.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getPaymentMethod() != null ? r.getPaymentMethod() : "Unknown",
                        Collectors.counting()));
        report.setPaymentMethodBreakdown(paymentMethodCount);

        Map<String, BigDecimal> paymentMethodAmount = receipts.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getPaymentMethod() != null ? r.getPaymentMethod() : "Unknown",
                        Collectors.reducing(BigDecimal.ZERO,
                                r -> r.getAmount() != null ? r.getAmount() : BigDecimal.ZERO,
                                BigDecimal::add)));
        report.setPaymentMethodAmount(paymentMethodAmount);

        // ── Top Customers by Amount ──
        Map<String, BigDecimal> customerAmount = receipts.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getCustomerName() != null ? r.getCustomerName() : "Unknown",
                        Collectors.reducing(BigDecimal.ZERO,
                                r -> r.getAmount() != null ? r.getAmount() : BigDecimal.ZERO,
                                BigDecimal::add)));

        List<ReceiptReportBean.CustomerSummary> topCustomers = customerAmount.entrySet().stream()
                .sorted(Map.Entry.<String, BigDecimal>comparingByValue().reversed())
                .limit(10)
                .map(e -> {
                    ReceiptReportBean.CustomerSummary cs = new ReceiptReportBean.CustomerSummary();
                    cs.setCustomerName(e.getKey());
                    cs.setTotalAmount(e.getValue());
                    cs.setReceiptCount((int) receipts.stream()
                            .filter(r -> e.getKey().equals(r.getCustomerName()))
                            .count());
                    return cs;
                })
                .collect(Collectors.toList());
        report.setTopCustomers(topCustomers);

        // ── Collected By Summary ──
        Map<String, BigDecimal> collectedByAmount = receipts.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getCollectedBy() != null ? r.getCollectedBy() : "Unknown",
                        Collectors.reducing(BigDecimal.ZERO,
                                r -> r.getAmount() != null ? r.getAmount() : BigDecimal.ZERO,
                                BigDecimal::add)));
        report.setCollectedByAmount(collectedByAmount);

        // ── Recent Receipts (last 5) ──
        List<ReceiptBean> recent = receipts.stream()
                .sorted(Comparator.comparing(ReceiptBean::getReceiptDate,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .collect(Collectors.toList());
        report.setRecentReceipts(recent);

        return report;
    }
}