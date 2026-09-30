package com.ims.orderItem.bean;

public class OrderItemBean 
{
	private Integer orderItemId;
	
	private String product;
	
	private Integer quantity;
	
	private Long unitPrice;
	
	private Long totalPrice;
	
	private String taxRate;
	
	private Long taxAmount;
	
	public OrderItemBean() {
		
	}

	public Integer getOrderItemId() {
		return orderItemId;
	}

	public void setOrderItemId(Integer orderItemId) {
		this.orderItemId = orderItemId;
	}

	public String getProduct() {
		return product;
	}

	public void setProduct(String product) {
		this.product = product;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public Long getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(Long unitPrice) {
		this.unitPrice = unitPrice;
	}

	public Long getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(Long totalPrice) {
		this.totalPrice = totalPrice;
	}

	public String getTaxRate() {
		return taxRate;
	}

	public void setTaxRate(String taxRate) {
		this.taxRate = taxRate;
	}

	public Long getTaxAmount() {
		return taxAmount;
	}

	public void setTaxAmount(Long taxAmount) {
		this.taxAmount = taxAmount;
	}
	
	
	
}
