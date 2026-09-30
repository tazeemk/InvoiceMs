package com.ims.productcategory.bean;

import com.ims.generic.bean.GenericBean;

public class ProductCategoryBean extends GenericBean{
    private String categoryId;
    private String categoryName;
    private String description;
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