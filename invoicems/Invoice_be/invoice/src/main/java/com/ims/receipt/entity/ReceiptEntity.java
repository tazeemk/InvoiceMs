package com.ims.receipt.entity;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "receipts")
public class ReceiptEntity {

    @Id
    @Column(length = 36)
    private String id;

    @NotNull
    @Column(name = "receipt_no", length = 50, nullable = false, unique = true)
    private String receiptNo;

    @NotNull
    @Column(name = "order_number", length = 20, nullable = false)
    private String orderNumber;

    @NotNull
    @Column(name = "invoice_number", length = 20, nullable = false)
    private String invoiceNumber;

    @NotNull
    @Column(name = "receipt_date", nullable = false)
    private LocalDate receiptDate;

    @NotNull
    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    @Column(name = "payment_ref", length = 50)
    private String paymentRef;

    @Column(name = "previous_outstanding", precision = 12, scale = 2)
    private BigDecimal previousOutstanding;

    @Column(name = "balance_outstanding", precision = 12, scale = 2)
    private BigDecimal balanceOutstanding;

    @Column(name = "collected_by", length = 100)
    private String collectedBy;

    @Column(name = "customer_name", length = 150)
    private String customerName;

    @Column(name = "contact_person", length = 100)
    private String contactPerson;

    @Column(name = "customer_address", length = 255)
    private String customerAddress;

    @Column(name = "remarks", length = 255)
    private String remarks;

    @Column(name = "collection_address", length = 255)
    private String collectionAddress;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /* ───────────── Lifecycle Hooks ───────────── */

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
        createdAt = LocalDateTime.now();
    }

    /* ───────────── Getters & Setters ───────────── */

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getReceiptNo() { return receiptNo; }
    public void setReceiptNo(String receiptNo) { this.receiptNo = receiptNo; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public LocalDate getReceiptDate() { return receiptDate; }
    public void setReceiptDate(LocalDate receiptDate) { this.receiptDate = receiptDate; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentRef() { return paymentRef; }
    public void setPaymentRef(String paymentRef) { this.paymentRef = paymentRef; }

    public BigDecimal getPreviousOutstanding() { return previousOutstanding; }
    public void setPreviousOutstanding(BigDecimal previousOutstanding) { this.previousOutstanding = previousOutstanding; }

    public BigDecimal getBalanceOutstanding() { return balanceOutstanding; }
    public void setBalanceOutstanding(BigDecimal balanceOutstanding) { this.balanceOutstanding = balanceOutstanding; }

    public String getCollectedBy() { return collectedBy; }
    public void setCollectedBy(String collectedBy) { this.collectedBy = collectedBy; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

    public String getCustomerAddress() { return customerAddress; }
    public void setCustomerAddress(String customerAddress) { this.customerAddress = customerAddress; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getCollectionAddress() { return collectionAddress; }
    public void setCollectionAddress(String collectionAddress) { this.collectionAddress = collectionAddress; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}