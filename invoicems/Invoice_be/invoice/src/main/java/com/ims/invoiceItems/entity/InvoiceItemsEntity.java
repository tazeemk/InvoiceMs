package com.ims.invoiceItems.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name = "invoice_items")
public class InvoiceItemsEntity {
    
    @Id
    @Column(name = "id", length = 20)
    private String id;
    
    @Column(name = "invoice_id", length = 20, nullable = false)
    private String invoiceId;
    
    @Column(name = "line_no", nullable = false)
    private Integer lineNo;
    
    @Column(name = "item_code", length = 50, nullable = false)
    private String itemCode;
    
    @Column(name = "item_name", length = 200, nullable = false)
    private String itemName;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "hsn_code", length = 20)
    private String hsnCode;
    
    @Column(name = "quantity", precision = 10, scale = 2, nullable = false)
    private BigDecimal quantity;
    
    @Column(name = "unit", length = 20)
    private String unit = "PCS";
    
    @Column(name = "rate", precision = 12, scale = 2, nullable = false)
    private BigDecimal rate;
    
    @Column(name = "discount_percent", precision = 5, scale = 2)
    private BigDecimal discountPercent = BigDecimal.ZERO;
    
    @Column(name = "discount_amount", precision = 12, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;
    
    @Column(name = "taxable_amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal taxableAmount;
    
    @Column(name = "cgst_rate", precision = 5, scale = 2)
    private BigDecimal cgstRate = BigDecimal.ZERO;
    
    @Column(name = "cgst_amount", precision = 12, scale = 2)
    private BigDecimal cgstAmount = BigDecimal.ZERO;
    
    @Column(name = "sgst_rate", precision = 5, scale = 2)
    private BigDecimal sgstRate = BigDecimal.ZERO;
    
    @Column(name = "sgst_amount", precision = 12, scale = 2)
    private BigDecimal sgstAmount = BigDecimal.ZERO;
    
    @Column(name = "igst_rate", precision = 5, scale = 2)
    private BigDecimal igstRate = BigDecimal.ZERO;
    
    @Column(name = "igst_amount", precision = 12, scale = 2)
    private BigDecimal igstAmount = BigDecimal.ZERO;
    
    @Column(name = "total_amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal totalAmount;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    

	public InvoiceItemsEntity() {
		super();
		
	}
	
	

	public InvoiceItemsEntity(String id, String invoiceId, Integer lineNo, String itemCode, String itemName,
			String description, String hsnCode, BigDecimal quantity, String unit, BigDecimal rate,
			BigDecimal discountPercent, BigDecimal discountAmount, BigDecimal taxableAmount, BigDecimal cgstRate,
			BigDecimal cgstAmount, BigDecimal sgstRate, BigDecimal sgstAmount, BigDecimal igstRate,
			BigDecimal igstAmount, BigDecimal totalAmount, LocalDateTime createdAt) {
		super();
		this.id = id;
		this.invoiceId = invoiceId;
		this.lineNo = lineNo;
		this.itemCode = itemCode;
		this.itemName = itemName;
		this.description = description;
		this.hsnCode = hsnCode;
		this.quantity = quantity;
		this.unit = unit;
		this.rate = rate;
		this.discountPercent = discountPercent;
		this.discountAmount = discountAmount;
		this.taxableAmount = taxableAmount;
		this.cgstRate = cgstRate;
		this.cgstAmount = cgstAmount;
		this.sgstRate = sgstRate;
		this.sgstAmount = sgstAmount;
		this.igstRate = igstRate;
		this.igstAmount = igstAmount;
		this.totalAmount = totalAmount;
		this.createdAt = createdAt;
	}



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