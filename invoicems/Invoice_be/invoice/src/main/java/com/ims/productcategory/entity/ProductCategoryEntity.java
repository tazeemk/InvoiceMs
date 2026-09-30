package com.ims.productcategory.entity;

import com.ims.generic.entity.GenericEntity;

import jakarta.persistence.*;

@Entity
@Table(name = "product_categories")
public class ProductCategoryEntity extends GenericEntity{

    @Id
    @Column(name = "categoryId")
    private String categoryId;

    @Column(name = "categoryName")
    private String categoryName;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "status")
    private String status;

	public String getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(String categoryId) {
		this.categoryId = categoryId;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	
	

    

}