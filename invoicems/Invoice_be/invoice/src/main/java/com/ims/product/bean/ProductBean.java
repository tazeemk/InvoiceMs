package com.ims.product.bean;

import com.ims.generic.bean.GenericBean;

public class ProductBean extends GenericBean{
    private String productId;
    
    private String productName;
    
    private String productCode;
    
    private String categoryId;
    
    private String description;

    private String unitPrice;

    private String stockUnit;
    
    private String taxRate;
    
    private String status;
    
    private Long quantity;

	public String getProductId() {
		return productId;
	}

	public Long getQuantity() {
		return quantity;
	}

	public void setQuantity(Long quantity) {
		this.quantity = quantity;
	}

	public void setProductId(String productId) {
		this.productId = productId;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getProductCode() {
		return productCode;
	}

	public void setProductCode(String productCode) {
		this.productCode = productCode;
	}

	public String getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(String categoryId) {
		this.categoryId = categoryId;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(String unitPrice) {
		this.unitPrice = unitPrice;
	}

	public String getStockUnit() {
		return stockUnit;
	}

	public void setStockUnit(String stockUnit) {
		this.stockUnit = stockUnit;
	}

	public String getTaxRate() {
		return taxRate;
	}

	public void setTaxRate(String taxRate) {
		this.taxRate = taxRate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
    
    
    
}