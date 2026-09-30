package com.ims.product.entity;

import com.ims.generic.entity.GenericEntity;
import com.ims.productcategory.entity.ProductCategoryEntity;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class ProductEntity extends GenericEntity{
    @Id
    @Column(name = "productId")
    private String productId;
    
    @Column(name = "productName")
    private String productName;
    
    @Column(name = "productCode")
    private String productCode;
    
    @ManyToOne
    @JoinColumn(name = "categoryId")
    private ProductCategoryEntity category;
    
    @Column(name = "description")
    private String description;

    @Column(name = "unitPrice")
    private String unitPrice;

    @Column(name = "stockUnit")
    private String stockUnit;
    
    @Column(name = "quantity")
    private Long quantity;
    
    @Column(name = "taxRate")
    private String taxRate;
    
    @Column(name = "status")
    private String status;

	public ProductEntity() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ProductEntity(String productId, String productName, String productCode, ProductCategoryEntity category,
			String description, String unitPrice, String stockUnit, String taxRate, String status) {
		super();
		this.productId = productId;
		this.productName = productName;
		this.productCode = productCode;
		this.category = category;
		this.description = description;
		this.unitPrice = unitPrice;
		this.stockUnit = stockUnit;
		this.taxRate = taxRate;
		this.status = status;
	}

	public Long getQuantity() {
		return quantity;
	}

	public void setQuantity(Long quantity) {
		this.quantity = quantity;
	}

	public String getProductId() {
		return productId;
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

	public ProductCategoryEntity getCategory() {
		return category;
	}

	public void setCategory(ProductCategoryEntity category) {
		this.category = category;
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