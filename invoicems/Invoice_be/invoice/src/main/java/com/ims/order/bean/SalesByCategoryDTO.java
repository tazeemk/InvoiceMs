package com.ims.order.bean;

public class SalesByCategoryDTO {
  
	private String category;
    private Double totalSales;

    
    public SalesByCategoryDTO() {
    	
    }
    
    public SalesByCategoryDTO(String category, Double totalSales) {
        this.category = category;
        this.totalSales = totalSales;
    }

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public Double getTotalSales() {
		return totalSales;
	}

	public void setTotalSales(Double totalSales) {
		this.totalSales = totalSales;
	}

    
}
