package com.ims.user.entity;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class UserEntity {

	@Id
    @Column(name = "id", unique = true, nullable = false)
    private String id;
	
    @Column(name = "first_name", length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;
    
	@Column(name="user_name")
    private String username;
    
	
    @Column(name="email",unique = true)
    private String email;
    
    @Column(name = "password_hash")
    private String password;  
    
    @Column(name = "showPassword")
    private String showPassword;  
    
    @Column(name= "role")
	private String role;  
	
    @Column(name= "status")
    private String status;
    
	@Column(name="created_at")
    @CreationTimestamp
    private Date createdAt;
    
    @Column(name = "updated_at")
    @UpdateTimestamp
    private Date updatedAt;
    
    @Column(name = "created_by")
    private String createdBy;
    
	public String getRole() {
		return role;
	}

	public UserEntity() {
		super();
		// TODO Auto-generated constructor stub
	}

	public UserEntity(String id, String firstName, String lastName, String username, String email, String password,
			String showPassword, String role, String status, Date createdAt, Date updatedAt, String createdBy) {
		super();
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.username = username;
		this.email = email;
		this.password = password;
		this.showPassword = showPassword;
		this.role = role;
		this.status = status;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.createdBy = createdBy;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getShowPassword() {
		return showPassword;
	}

	public void setShowPassword(String showPassword) {
		this.showPassword = showPassword;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public Date getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Date updatedAt) {
		this.updatedAt = updatedAt;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public void setRole(String role) {
		this.role = role;
	}
    
	

	
}
