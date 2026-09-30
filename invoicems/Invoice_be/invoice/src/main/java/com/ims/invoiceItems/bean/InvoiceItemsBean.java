package com.ims.invoiceItems.bean;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class InvoiceItemsBean {
    private String id;
    private String invoiceId;
    private Integer lineNo;
    private String itemCode;
    private String itemName;
    private String description;
    private String hsnCode;
    private BigDecimal quantity;
    private String unit;
    private BigDecimal rate;
    private BigDecimal discountPercent;
    private BigDecimal discountAmount;
    private BigDecimal taxableAmount;
    private BigDecimal cgstRate;
    private BigDecimal cgstAmount;
    private BigDecimal sgstRate;
    private BigDecimal sgstAmount;
    private BigDecimal igstRate;
    private BigDecimal igstAmount;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getInvoiceId() {
		return invoiceId;
	}
	public void setInvoiceId(String invoiceId) {
		this.invoiceId = invoiceId;
	}
	public Integer getLineNo() {
		return lineNo;
	}
	public void setLineNo(Integer lineNo) {
		this.lineNo = lineNo;
	}
	public String getItemCode() {
		return itemCode;
	}
	public void setItemCode(String itemCode) {
		this.itemCode = itemCode;
	}
	public String getItemName() {
		return itemName;
	}
	public void setItemName(String itemName) {
		this.itemName = itemName;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getHsnCode() {
		return hsnCode;
	}
	public void setHsnCode(String hsnCode) {
		this.hsnCode = hsnCode;
	}
	public BigDecimal getQuantity() {
		return quantity;
	}
	public void setQuantity(BigDecimal quantity) {
		this.quantity = quantity;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public BigDecimal getRate() {
		return rate;
	}
	public void setRate(BigDecimal rate) {
		this.rate = rate;
	}
	public BigDecimal getDiscountPercent() {
		return discountPercent;
	}
	public void setDiscountPercent(BigDecimal discountPercent) {
		this.discountPercent = discountPercent;
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
	public BigDecimal getCgstRate() {
		return cgstRate;
	}
	public void setCgstRate(BigDecimal cgstRate) {
		this.cgstRate = cgstRate;
	}
	public BigDecimal getCgstAmount() {
		return cgstAmount;
	}
	public void setCgstAmount(BigDecimal cgstAmount) {
		this.cgstAmount = cgstAmount;
	}
	public BigDecimal getSgstRate() {
		return sgstRate;
	}
	public void setSgstRate(BigDecimal sgstRate) {
		this.sgstRate = sgstRate;
	}
	public BigDecimal getSgstAmount() {
		return sgstAmount;
	}
	public void setSgstAmount(BigDecimal sgstAmount) {
		this.sgstAmount = sgstAmount;
	}
	public BigDecimal getIgstRate() {
		return igstRate;
	}
	public void setIgstRate(BigDecimal igstRate) {
		this.igstRate = igstRate;
	}
	public BigDecimal getIgstAmount() {
		return igstAmount;
	}
	public void setIgstAmount(BigDecimal igstAmount) {
		this.igstAmount = igstAmount;
	}
	public BigDecimal getTotalAmount() {
		return totalAmount;
	}
	public void setTotalAmount(BigDecimal totalAmount) {
		this.totalAmount = totalAmount;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
    
    
}
