package com.ims.order.bean;

import java.time.LocalDate;
import java.util.List;

import com.ims.customer.entity.CustomerEntity;
import com.ims.orderItem.entity.OrderItemEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;

public class OrderBean 
{

	private Integer orderId;
	private String orderNumber;
	private String retailer;
	private String salesperson;
	private String customer;
	private LocalDate orderDate;
	private LocalDate expectedDeliveryDate;
	private Integer totalAmount;
	private String description;
	private String status;
	private String cancelReason;
 
	@OneToMany(mappedBy = "order" ,cascade = CascadeType.ALL)
	private List<OrderItemEntity>orderlist; 
	
	public OrderBean() {
		
	}

	public Integer getOrderId() {
		return orderId;
	}

	public void setOrderId(Integer orderId) {
		this.orderId = orderId;
	}

	public String getOrderNumber() {
		return orderNumber;
	}

	public void setOrderNumber(String orderNumber) {
		this.orderNumber = orderNumber;
	}

	public String getRetailer() {
		return retailer;
	}

	public void setRetailer(String retailer) {
		this.retailer = retailer;
	}

	public String getSalesperson() {
		return salesperson;
	}

	public void setSalesperson(String salesperson) {
		this.salesperson = salesperson;
	}

	public String getCustomer() {
		return customer;
	}

	public void setCustomer(String customer) {
		this.customer = customer;
	}

	public LocalDate getOrderDate() {
		return orderDate;
	}

	public void setOrderDate(LocalDate orderDate) {
		this.orderDate = orderDate;
	}

	public LocalDate getExpectedDeliveryDate() {
		return expectedDeliveryDate;
	}

	public void setExpectedDeliveryDate(LocalDate expectedDeliveryDate) {
		this.expectedDeliveryDate = expectedDeliveryDate;
	}

	public Integer getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(Integer totalAmount) {
		this.totalAmount = totalAmount;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<OrderItemEntity> getOrderlist() {
		return orderlist;
	}

	public void setOrderlist(List<OrderItemEntity> orderlist) {
		this.orderlist = orderlist;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getCancelReason() {
		return cancelReason;
	}

	public void setCancelReason(String cancelReason) {
		this.cancelReason = cancelReason;
	}
	
	
	
}
