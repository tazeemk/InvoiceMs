package com.ims.invoices.bean;

import com.ims.invoiceItems.bean.InvoiceItemsBean;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


public class InvoicesBean {
    private String id;
    private String invoiceNo;
    private String orderNumber;
    private String assignUserId;
    private String assignUser;
    private LocalDate invoiceDate;
    private LocalDate dueDate;
    private String customerId;
    private String customerName;
    private String customerCode;
    private String contactPerson;
    private String mobile;
    private String email;
    private String billingAddress;
    private String shippingAddress;
    private String collectionAddress;
    private String collectionAmount;
    private String paymentMethod;
    private String remarks;
    
    private String gstin;
    private String pan;
    private String state;
    private String city;
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal taxableAmount;
    private BigDecimal cgstAmount;
    private BigDecimal sgstAmount;
    private BigDecimal igstAmount;
    private BigDecimal totalTax;
    private BigDecimal roundOff;
    private BigDecimal grandTotal;
    private BigDecimal paidAmount;
    private BigDecimal balanceAmount;
    private String paymentTerms;
    private Integer creditDays;
    private String termsConditions;
    private String invoiceType;
    private String status;
    private Boolean tallySynced;
    private String tallyVoucherNo;
    private String tallyLedgerId;
    private String invoicePdfPath;
    private Boolean sentToCustomer;
    private LocalDateTime sentAt;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<InvoiceItemsBean> items;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getInvoiceNo() {
		return invoiceNo;
	}
	public void setInvoiceNo(String invoiceNo) {
		this.invoiceNo = invoiceNo;
	}
	public String getOrderNumber() {
		return orderNumber;
	}
	public void setOrderNumber(String orderNumber) {
		this.orderNumber = orderNumber;
	}
	public String getAssignUserId() {
		return assignUserId;
	}
	public void setAssignUserId(String assignUserId) {
		this.assignUserId = assignUserId;
	}
	public String getAssignUser() {
		return assignUser;
	}
	public void setAssignUser(String assignUser) {
		this.assignUser = assignUser;
	}
	public LocalDate getInvoiceDate() {
		return invoiceDate;
	}
	public void setInvoiceDate(LocalDate invoiceDate) {
		this.invoiceDate = invoiceDate;
	}
	public LocalDate getDueDate() {
		return dueDate;
	}
	public void setDueDate(LocalDate dueDate) {
		this.dueDate = dueDate;
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
	public String getCustomerCode() {
		return customerCode;
	}
	public void setCustomerCode(String customerCode) {
		this.customerCode = customerCode;
	}
	public String getContactPerson() {
		return contactPerson;
	}
	public void setContactPerson(String contactPerson) {
		this.contactPerson = contactPerson;
	}
	public String getMobile() {
		return mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getBillingAddress() {
		return billingAddress;
	}
	public void setBillingAddress(String billingAddress) {
		this.billingAddress = billingAddress;
	}
	public String getShippingAddress() {
		return shippingAddress;
	}
	public void setShippingAddress(String shippingAddress) {
		this.shippingAddress = shippingAddress;
	}
	public String getCollectionAddress() {
		return collectionAddress;
	}
	public void setCollectionAddress(String collectionAddress) {
		this.collectionAddress = collectionAddress;
	}
	public String getCollectionAmount() {
		return collectionAmount;
	}
	public void setCollectionAmount(String collectionAmount) {
		this.collectionAmount = collectionAmount;
	}
	public String getPaymentMethod() {
		return paymentMethod;
	}
	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	public String getGstin() {
		return gstin;
	}
	public void setGstin(String gstin) {
		this.gstin = gstin;
	}
	public String getPan() {
		return pan;
	}
	public void setPan(String pan) {
		this.pan = pan;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public BigDecimal getSubtotal() {
		return subtotal;
	}
	public void setSubtotal(BigDecimal subtotal) {
		this.subtotal = subtotal;
	}
	public BigDecimal getDiscountAmount() {
		return discountAmount;
	}
	public void setDiscountAmount(BigDecimal discountAmount) {
		this.discountAmount = discountAmount;
	}
	public BigDecimal getTaxableAmount() {
		return taxableAmount;
	}
	public void setTaxableAmount(BigDecimal taxableAmount) {
		this.taxableAmount = taxableAmount;
	}
	public BigDecimal getCgstAmount() {
		return cgstAmount;
	}
	public void setCgstAmount(BigDecimal cgstAmount) {
		this.cgstAmount = cgstAmount;
	}
	public BigDecimal getSgstAmount() {
		return sgstAmount;
	}
	public void setSgstAmount(BigDecimal sgstAmount) {
		this.sgstAmount = sgstAmount;
	}
	public BigDecimal getIgstAmount() {
		return igstAmount;
	}
	public void setIgstAmount(BigDecimal igstAmount) {
		this.igstAmount = igstAmount;
	}
	public BigDecimal getTotalTax() {
		return totalTax;
	}
	public void setTotalTax(BigDecimal totalTax) {
		this.totalTax = totalTax;
	}
	public BigDecimal getRoundOff() {
		return roundOff;
	}
	public void setRoundOff(BigDecimal roundOff) {
		this.roundOff = roundOff;
	}
	public BigDecimal getGrandTotal() {
		return grandTotal;
	}
	public void setGrandTotal(BigDecimal grandTotal) {
		this.grandTotal = grandTotal;
	}
	public BigDecimal getPaidAmount() {
		return paidAmount;
	}
	public void setPaidAmount(BigDecimal paidAmount) {
		this.paidAmount = paidAmount;
	}
	public BigDecimal getBalanceAmount() {
		return balanceAmount;
	}
	public void setBalanceAmount(BigDecimal balanceAmount) {
		this.balanceAmount = balanceAmount;
	}
	public String getPaymentTerms() {
		return paymentTerms;
	}
	public void setPaymentTerms(String paymentTerms) {
		this.paymentTerms = paymentTerms;
	}
	public Integer getCreditDays() {
		return creditDays;
	}
	public void setCreditDays(Integer creditDays) {
		this.creditDays = creditDays;
	}
	public String getTermsConditions() {
		return termsConditions;
	}
	public void setTermsConditions(String termsConditions) {
		this.termsConditions = termsConditions;
	}
	public String getInvoiceType() {
		return invoiceType;
	}
	public void setInvoiceType(String invoiceType) {
		this.invoiceType = invoiceType;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public Boolean getTallySynced() {
		return tallySynced;
	}
	public void setTallySynced(Boolean tallySynced) {
		this.tallySynced = tallySynced;
	}
	public String getTallyVoucherNo() {
		return tallyVoucherNo;
	}
	public void setTallyVoucherNo(String tallyVoucherNo) {
		this.tallyVoucherNo = tallyVoucherNo;
	}
	public String getTallyLedgerId() {
		return tallyLedgerId;
	}
	public void setTallyLedgerId(String tallyLedgerId) {
		this.tallyLedgerId = tallyLedgerId;
	}
	public String getInvoicePdfPath() {
		return invoicePdfPath;
	}
	public void setInvoicePdfPath(String invoicePdfPath) {
		this.invoicePdfPath = invoicePdfPath;
	}
	public Boolean getSentToCustomer() {
		return sentToCustomer;
	}
	public void setSentToCustomer(Boolean sentToCustomer) {
		this.sentToCustomer = sentToCustomer;
	}
	public LocalDateTime getSentAt() {
		return sentAt;
	}
	public void setSentAt(LocalDateTime sentAt) {
		this.sentAt = sentAt;
	}
	public String getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}
	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
	public List<InvoiceItemsBean> getItems() {
		return items;
	}
	public void setItems(List<InvoiceItemsBean> items) {
		this.items = items;
	}
    
    
	
    
}