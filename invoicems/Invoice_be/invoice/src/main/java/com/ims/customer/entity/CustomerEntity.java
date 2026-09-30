package com.ims.customer.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "customers")
public class CustomerEntity {

	@Id
	@Column(length = 20, nullable = false)
	private String id;

    @Column(name = "customer_code", length = 50, nullable = false)
    private String customerCode;


    @Column(name = "business_name", length = 150, nullable = false)
    private String businessName;

    @Column(name = "gstin", length = 20)
    private String gstin;

    @Column(name="pan", length = 20)
    private String pan;

    @Column(name = "contact_person", length = 100)
    private String contactPerson;

    @Column(length = 15)
    private String mobile;

    @Column(name ="email", length = 100)
    private String email;

    @Column(name="address", columnDefinition = "TEXT")
    private String address;

    @Column(name="city", length = 50)
    private String city;

    @Column(name="state", length = 50)
    private String state;

    @Column(name = "credit_days")
    private Integer creditDays;

    @Column(name = "current_outstanding", precision = 12, scale = 2)
    private BigDecimal currentOutstanding = BigDecimal.ZERO;

    @Column(name = "status", length = 10)
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public CustomerEntity() {
        super();
    }

    public CustomerEntity(String id,  @NotNull String customerCode,
            @NotNull String businessName, String gstin, String pan, String contactPerson, String mobile, String email,
            String address, String city, String state, Integer creditDays, BigDecimal currentOutstanding, String status,
            LocalDateTime createdAt, LocalDateTime updatedAt) {
        super();
        this.id = id;

        this.customerCode = customerCode;
        this.businessName = businessName;
        this.gstin = gstin;
        this.pan = pan;
        this.contactPerson = contactPerson;
        this.mobile = mobile;
        this.email = email;
        this.address = address;
        this.city = city;
        this.state = state;
        this.creditDays = creditDays;
        this.currentOutstanding = currentOutstanding;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

 


    public String getCustomerCode() {
        return customerCode;
    }

    public void setCustomerCode(String customerCode) {
        this.customerCode = customerCode;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Integer getCreditDays() {
        return creditDays;
    }

    public void setCreditDays(Integer creditDays) {
        this.creditDays = creditDays;
    }

    public BigDecimal getCurrentOutstanding() {
        return currentOutstanding;
    }

    public void setCurrentOutstanding(BigDecimal currentOutstanding) {
        this.currentOutstanding = currentOutstanding;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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