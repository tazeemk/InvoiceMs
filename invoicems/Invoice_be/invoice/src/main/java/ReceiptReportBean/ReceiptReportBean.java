package ReceiptReportBean;






import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.ims.receipt.bean.ReceiptBean;

public class ReceiptReportBean {

    private LocalDate startDate;
    private LocalDate endDate;

    // ── KPIs ──
    private int totalReceipts;
    private BigDecimal totalAmount;
    private BigDecimal totalBalanceOutstanding;
    private BigDecimal averageReceiptAmount;

    // ── Charts ──
    private Map<String, BigDecimal> monthlyTrend;          // month -> total amount
    private Map<String, Long>       paymentMethodBreakdown; // method -> count
    private Map<String, BigDecimal> paymentMethodAmount;    // method -> total amount
    private Map<String, BigDecimal> collectedByAmount;      // collector -> total amount

    // ── Tables ──
    private List<CustomerSummary> topCustomers;
    private List<ReceiptBean>     recentReceipts;

    /* ─── Inner class ─── */
    public static class CustomerSummary {
        private String customerName;
        private BigDecimal totalAmount;
        private int receiptCount;

        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }

        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

        public int getReceiptCount() { return receiptCount; }
        public void setReceiptCount(int receiptCount) { this.receiptCount = receiptCount; }
    }

    /* ─── Getters & Setters ─── */

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public int getTotalReceipts() { return totalReceipts; }
    public void setTotalReceipts(int totalReceipts) { this.totalReceipts = totalReceipts; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getTotalBalanceOutstanding() { return totalBalanceOutstanding; }
    public void setTotalBalanceOutstanding(BigDecimal totalBalanceOutstanding) {
        this.totalBalanceOutstanding = totalBalanceOutstanding;
    }

    public BigDecimal getAverageReceiptAmount() { return averageReceiptAmount; }
    public void setAverageReceiptAmount(BigDecimal averageReceiptAmount) {
        this.averageReceiptAmount = averageReceiptAmount;
    }

    public Map<String, BigDecimal> getMonthlyTrend() { return monthlyTrend; }
    public void setMonthlyTrend(Map<String, BigDecimal> monthlyTrend) {
        this.monthlyTrend = monthlyTrend;
    }

    public Map<String, Long> getPaymentMethodBreakdown() { return paymentMethodBreakdown; }
    public void setPaymentMethodBreakdown(Map<String, Long> paymentMethodBreakdown) {
        this.paymentMethodBreakdown = paymentMethodBreakdown;
    }

    public Map<String, BigDecimal> getPaymentMethodAmount() { return paymentMethodAmount; }
    public void setPaymentMethodAmount(Map<String, BigDecimal> paymentMethodAmount) {
        this.paymentMethodAmount = paymentMethodAmount;
    }

    public Map<String, BigDecimal> getCollectedByAmount() { return collectedByAmount; }
    public void setCollectedByAmount(Map<String, BigDecimal> collectedByAmount) {
        this.collectedByAmount = collectedByAmount;
    }

    public List<CustomerSummary> getTopCustomers() { return topCustomers; }
    public void setTopCustomers(List<CustomerSummary> topCustomers) {
        this.topCustomers = topCustomers;
    }

    public List<ReceiptBean> getRecentReceipts() { return recentReceipts; }
    public void setRecentReceipts(List<ReceiptBean> recentReceipts) {
        this.recentReceipts = recentReceipts;
    }
}