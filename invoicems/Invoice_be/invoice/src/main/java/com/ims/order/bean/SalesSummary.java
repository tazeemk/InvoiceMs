package com.ims.order.bean;

public class SalesSummary {
	
    private Double totalSales;
    private Long totalOrders;
    private Long totalQuantity;
    private Double averageOrderValue;

    public SalesSummary() {
    	
    }
    
    public SalesSummary(Double totalSales,
                           Long totalOrders,
                           Long totalQuantity,
                           Double averageOrderValue) {
        this.totalSales = totalSales;
        this.totalOrders = totalOrders;
        this.totalQuantity = totalQuantity;
        this.averageOrderValue = averageOrderValue;
    }

	public Double getTotalSales() {
		return totalSales;
	}

	public void setTotalSales(Double totalSales) {
		this.totalSales = totalSales;
	}

	public Long getTotalOrders() {
		return totalOrders;
	}

	public void setTotalOrders(Long totalOrders) {
		this.totalOrders = totalOrders;
	}

	public Long getTotalQuantity() {
		return totalQuantity;
	}

	public void setTotalQuantity(Long totalQuantity) {
		this.totalQuantity = totalQuantity;
	}

	public Double getAverageOrderValue() {
		return averageOrderValue;
	}

	public void setAverageOrderValue(Double averageOrderValue) {
		this.averageOrderValue = averageOrderValue;
	}
	

}
