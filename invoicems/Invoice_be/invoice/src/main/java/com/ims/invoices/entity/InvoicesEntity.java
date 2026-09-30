package com.ims.invoices.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "invoices")
public class InvoicesEntity {
    
    @Id
    @Column(name = "id", length = 20)
    private String id;
    
    @Column(name = "invoice_no", length = 50, nullable = false, unique = true)
    private String invoiceNo;
    
    @Column(name = "orderNumber", length = 50, nullable = false, unique = true)
    private String orderNumber;
    
    @Column(name = "assign_User_Id", length = 150)
    private String assignUserId;
    
    @Column(name = "assign_User", length = 150)
    private String assignUser;
    
    @Column(name = "invoice_date", nullable = false)
    private LocalDate invoiceDate;
    
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;
    
	@Column(name = "customer_id", length = 20, nullable = false)
    private String customerId;
    
    @Column(name = "customer_name", length = 150, nullable = false)
    private String customerName;
    
    @Column(name = "customer_code", length = 50, nullable = false)
    private String customerCode;
    
    @Column(name = "contact_person", length = 100)
    private String contactPerson;
    
    @Column(name = "last_collection_amount", length = 100)
    private String lastCollectionAmount;
    
    @Column(name = "mobile", length = 15)
    private String mobile;
    
    @Column(name = "email", length = 100)
    private String email;
    
    @Column(name = "billing_address", columnDefinition = "TEXT")
    private String billingAddress;
    
    @Column(name = "shipping_address", columnDefinition = "TEXT")
    private String shippingAddress;
    
    @Column(name = "gstin", length = 20)
    private String gstin;
    
    @Column(name = "pan", length = 20)
    private String pan;
    
    @Column(name = "state", length = 50)
    private String state;
    
    @Column(name = "city", length = 50)
    private String city;
    
    @Column(name = "subtotal", precision = 12, scale = 2, nullable = false)
    private BigDecimal subtotal = BigDecimal.ZERO;
    
    @Column(name = "discount_amount", precision = 12, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;
    
    @Column(name = "taxable_amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal taxableAmount = BigDecimal.ZERO;
    
    @Column(name = "cgst_amount", precision = 12, scale = 2)
    private BigDecimal cgstAmount = BigDecimal.ZERO;
    
    @Column(name = "sgst_amount", precision = 12, scale = 2)
    private BigDecimal sgstAmount = BigDecimal.ZERO;
    
    @Column(name = "igst_amount", precision = 12, scale = 2)
    private BigDecimal igstAmount = BigDecimal.ZERO;
    
    @Column(name = "total_tax", precision = 12, scale = 2)
    private BigDecimal totalTax = BigDecimal.ZERO;
    
    @Column(name = "round_off", precision = 10, scale = 2)
    private BigDecimal roundOff = BigDecimal.ZERO;
    
    @Column(name = "grand_total", precision = 12, scale = 2, nullable = false)
    private BigDecimal grandTotal;
    
    @Column(name = "paid_amount", precision = 12, scale = 2)
    private BigDecimal paidAmount = BigDecimal.ZERO;
    
    @Column(name = "balance_amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal balanceAmount;
    
    @Column(name = "payment_terms", length = 100)
    private String paymentTerms;
    
    @Column(name = "credit_days")
    private Integer creditDays = 30;
    
    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;
    
    @Column(name = "terms_conditions", columnDefinition = "TEXT")
    private String termsConditions;
    
    @Column(name = "invoice_type", length = 20)
    private String invoiceType = "TAX_INVOICE";
    
    @Column(name = "status", length = 20)
    private String status = "DRAFT";
    
    @Column(name = "tally_synced")
    private Boolean tallySynced = false;
    
    @Column(name = "tally_voucher_no", length = 50)
    private String tallyVoucherNo;
    
    @Column(name = "tally_ledger_id", length = 50)
    private String tallyLedgerId;
    
    @Column(name = "invoice_pdf_path", length = 255)
    private String invoicePdfPath;
    
    @Column(name = "sent_to_customer")
    private Boolean sentToCustomer = false;
    
    @Column(name = "sent_at")
    private LocalDateTime sentAt;
    
    @Column(name = "created_by", nullable = false)
    private String createdBy;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

	public InvoicesEntity() {
		super();
		// TODO Auto-generated constructor stub
	}

	public InvoicesEntity(String id, String invoiceNo, String orderNumber, String assignUserId, String assignUser,
			LocalDate invoiceDate, LocalDate dueDate, String customerId, String customerName, String customerCode,
			String contactPerson, String lastCollectionAmount, String mobile, String email, String billingAddress,
			String shippingAddress, String gstin, String pan, String state, String city, BigDecimal subtotal,
			BigDecimal discountAmount, BigDecimal taxableAmount, BigDecimal cgstAmount, BigDecimal sgstAmount,
			BigDecimal igstAmount, BigDecimal totalTax, BigDecimal roundOff, BigDecimal grandTotal,
			BigDecimal paidAmount, BigDecimal balanceAmount, String paymentTerms, Integer creditDays, String remarks,
			String termsConditions, String invoiceType, String status, Boolean tallySynced, String tallyVoucherNo,
			String tallyLedgerId, String invoicePdfPath, Boolean sentToCustomer, LocalDateTime sentAt, String createdBy,
			LocalDateTime createdAt, LocalDateTime updatedAt) {
		super();
		this.id = id;
		this.invoiceNo = invoiceNo;
		this.orderNumber = orderNumber;
		this.assignUserId = assignUserId;
		this.assignUser = assignUser;
		this.invoiceDate = invoiceDate;
		this.dueDate = dueDate;
		this.customerId = customerId;
		this.customerName = customerName;
		this.customerCode = customerCode;
		this.contactPerson = contactPerson;
		this.lastCollectionAmount = lastCollectionAmount;
		this.mobile = mobile;
		this.email = email;
		this.billingAddress = billingAddress;
		this.shippingAddress = shippingAddress;
		this.gstin = gstin;
		this.pan = pan;
		this.state = state;
		this.city = city;
		this.subtotal = subtotal;
		this.discountAmount = discountAmount;
		this.taxableAmount = taxableAmount;
		this.cgstAmount = cgstAmount;
		this.sgstAmount = sgstAmount;
		this.igstAmount = igstAmount;
		this.totalTax = totalTax;
		this.roundOff = roundOff;
		this.grandTotal = grandTotal;
		this.paidAmount = paidAmount;
		this.balanceAmount = balanceAmount;
		this.paymentTerms = paymentTerms;
		this.creditDays = creditDays;
		this.remarks = remarks;
		this.termsConditions = termsConditions;
		this.invoiceType = invoiceType;
		this.status = status;
		this.tallySynced = tallySynced;
		this.tallyVoucherNo = tallyVoucherNo;
		this.tallyLedgerId = tallyLedgerId;
		this.invoicePdfPath = invoicePdfPath;
		this.sentToCustomer = sentToCustomer;
		this.sentAt = sentAt;
		this.createdBy = createdBy;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

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

	public String getLastCollectionAmount() {
		return lastCollectionAmount;
	}

	public void setLastCollectionAmount(String lastCollectionAmount) {
		this.lastCollectionAmount = lastCollectionAmount;
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

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
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

	

	
}
	