package com.ims.order.bean;

public class MonthlySalesDTO 
{

	   private Integer month;
	    private Double totalSales;

	    public MonthlySalesDTO() {
	    	
	    }
	    
	    public MonthlySalesDTO(Integer month, Double totalSales) {
	        this.month = month;
	        this.totalSales = totalSales;
	    }

		public Integer getMonth() {
			return month;
		}

		public void setMonth(Integer month) {
			this.month = month;
		}

		public Double getTotalSales() {
			return totalSales;
		}

		public void setTotalSales(Double totalSales) {
			this.totalSales = totalSales;
		}
	
	    
	    
}
