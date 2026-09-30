package com.ims.orderItem.entity;

import com.ims.order.entity.OrderEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Table(name = "ORDER_ITEM")
@Entity
public class OrderItemEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "order_item_id")
	private Integer orderItemId;
	
	private String product;
	
	private Integer quantity;
	
	private Long unitPrice;
	
	private Long totalPrice;
	
	private String taxRate;
	
	private Long taxAmount;
	
	@ManyToOne
	@JoinColumn(name = "orderId")
	@JsonIgnore
	private OrderEntity order;
	
	public OrderItemEntity() {
		
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

	public OrderEntity getOrder() {
		return order;
	}

	public void setOrder(OrderEntity order) {
		this.order = order;
	}

	public Integer getOrderItemId() {
		return orderItemId;
	}

	public void setOrderItemId(Integer orderItemId) {
		this.orderItemId = orderItemId;
	}
	
	
	

}
