package com.ims.order.servic;

import java.util.List;

import com.ims.filter.criteria.bean.FilterCriteriaBean;
import com.ims.filter.criteria.bean.FilterRequest;
import com.ims.order.bean.MonthlySalesDTO;
import com.ims.order.bean.OrderBean;
import com.ims.order.bean.SalesByCategoryDTO;
import com.ims.order.bean.SalesSummary;
import com.ims.order.entity.OrderEntity;

public interface OrderService 
{

	public void createOrder(OrderBean orderBean);
	
	public List<OrderEntity>listOfFilteredOrder(List<FilterCriteriaBean> filters, int limit);

	public OrderBean changeOrderStatus(String orderNumber);
	
	public void cancelOrder(String orderNumber,String reason);

	public void rejectOrder(String orderNumber);
	
	public String removeOrder(String orderNumber);
	
	public SalesSummary getListOfSalesSummary();
	
	public List<MonthlySalesDTO> getMonthlyWithOrders();
	
	public List<SalesByCategoryDTO> getListOfSalesByCategory();
}


