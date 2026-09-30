package com.ims.order.entity;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ims.customer.entity.CustomerEntity;
import com.ims.orderItem.entity.OrderItemEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Table(name="ORDERS")
@Entity
public class OrderEntity 
{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "order_id")
	private Integer orderId;

	private String orderNumber;
	
	private String retailer;
	
	private String salesperson;
	
	@ManyToOne
	@JoinColumn(name = "customer_id", referencedColumnName = "id")
	@JsonIgnore
	private CustomerEntity customerEntity;
	
	@Transient
	private String customer;
	
	private String status;
	
	private LocalDate orderDate;
	
	private LocalDate expectedDeliveryDate;
	
	private Integer totalAmount;
	
	private String description;
	
	private String cancelReason;
 
	@OneToMany(mappedBy = "order" ,cascade = CascadeType.ALL)
	private List<OrderItemEntity>orderlist;
	
	public OrderEntity() {
		
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

	public CustomerEntity getCustomerEntity() {
		return customerEntity;
	}

	public void setCustomerEntity(CustomerEntity customerEntity) {
		this.customerEntity = customerEntity;
		// Automatically set customer name when entity is set
		if (customerEntity != null) {
			this.customer = customerEntity.getBusinessName();
		}
	}
	
	public String getCustomer() {
		// If customer name is not set but entity exists, get it from entity
		if (customer == null && customerEntity != null) {
			return customerEntity.getBusinessName();
		}
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

	public Integer getOrderId() {
		return orderId;
	}

	public void setOrderId(Integer orderId) {
		this.orderId = orderId;
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
