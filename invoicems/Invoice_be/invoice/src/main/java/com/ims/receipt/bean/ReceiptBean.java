package com.ims.receipt.bean;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ReceiptBean {

    private String id;
    private String receiptNo;
    private String orderNumber;
    private String invoiceNumber;
    private LocalDate receiptDate;
    private BigDecimal amount;
    private String paymentMethod;
    private String paymentRef;
    private BigDecimal previousOutstanding;
    private BigDecimal balanceOutstanding;
    private String collectedBy;
    private String customerName;
    private String contactPerson;
    private String customerAddress;
    private String remarks;
    private String collectionAddress;
    private LocalDateTime createdAt;

    /* ───────────── Getters & Setters ───────────── */

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getReceiptNo() {
        return receiptNo;
    }

    public void setReceiptNo(String receiptNo) {
        this.receiptNo = receiptNo;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public LocalDate getReceiptDate() {
        return receiptDate;
    }

    public void setReceiptDate(LocalDate receiptDate) {
        this.receiptDate = receiptDate;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentRef() {
        return paymentRef;
    }

    public void setPaymentRef(String paymentRef) {
        this.paymentRef = paymentRef;
    }

    public BigDecimal getPreviousOutstanding() {
        return previousOutstanding;
    }

    public void setPreviousOutstanding(BigDecimal previousOutstanding) {
        this.previousOutstanding = previousOutstanding;
    }

    public BigDecimal getBalanceOutstanding() {
        return balanceOutstanding;
    }

    public void setBalanceOutstanding(BigDecimal balanceOutstanding) {
        this.balanceOutstanding = balanceOutstanding;
    }

    public String getCollectedBy() {
        return collectedBy;
    }

    public void setCollectedBy(String collectedBy) {
        this.collectedBy = collectedBy;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getCollectionAddress() {
        return collectionAddress;
    }

    public void setCollectionAddress(String collectionAddress) {
        this.collectionAddress = collectionAddress;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}