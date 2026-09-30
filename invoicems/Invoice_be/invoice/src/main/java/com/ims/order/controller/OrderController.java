package com.ims.order.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.filter.criteria.bean.FilterRequest;
import com.ims.order.bean.MonthlySalesDTO;
import com.ims.order.bean.OrderBean;
import com.ims.order.bean.SalesByCategoryDTO;
import com.ims.order.bean.SalesSummary;
import com.ims.order.entity.OrderEntity;
import com.ims.order.servic.OrderService;

@RestController
@RequestMapping("/order")
public class OrderController 
{

	@Autowired
	private OrderService orderService;
	
	@PostMapping("/createOrder")
	public ResponseEntity<String> addOrder(@RequestBody OrderBean orderBean){
		try {
			orderService.createOrder(orderBean);
			return ResponseEntity.ok("Order Added Successfully ");
		}catch(Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@PostMapping("/filterOrder")
	public ResponseEntity<List<OrderEntity>> getListOfOrderFilterData(@RequestBody FilterRequest request){
		int limit = request.getLimit() != null ? request.getLimit() : 100;       
		return ResponseEntity.ok(orderService.listOfFilteredOrder(request.getFilters(), limit));
	}
	
	@PutMapping("/changeStatus/{orderNumber}")
	public ResponseEntity<?> changeOrderStatus(@PathVariable String orderNumber){
		try {
             OrderBean bean=  orderService.changeOrderStatus(orderNumber);
			return ResponseEntity.ok(bean);
		}catch(IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
		}
	}
	
	@PutMapping("/cancelOrder/{orderNumber}/{reason}")
	public void cancelOrderStatus(@PathVariable String orderNumber, @PathVariable String reason){
		try {
               orderService.cancelOrder(orderNumber,reason);
              
		}catch(Exception e) {
			throw new IllegalArgumentException(e.getMessage());
		}
	}

	@PutMapping("/rejectOrder/{orderNumber}")
	public ResponseEntity<String> rejectOrder(@PathVariable String orderNumber) {
		try {
			orderService.rejectOrder(orderNumber);
			return ResponseEntity.ok("Order rejected successfully");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@DeleteMapping("/deleteOrder/{orderNumber}")
	public ResponseEntity<String> deleteOrderById(@PathVariable String orderNumber) 
	{
	try {
		String result=orderService.removeOrder(orderNumber);
		return ResponseEntity.ok(result);
	}catch(Exception e) {
		return	ResponseEntity.badRequest().body(e.getMessage());
	}
	}
	
	@GetMapping("/summary")
	public ResponseEntity<SalesSummary> getSalesSummery(){
		  SalesSummary sales=orderService.getListOfSalesSummary();
		return ResponseEntity.ok(sales);
	}
	
	@GetMapping("/monthly")
	public ResponseEntity<List<MonthlySalesDTO>>getMonthlyOrders(){
		List<MonthlySalesDTO> monthlyBean =orderService.getMonthlyWithOrders();
	    return ResponseEntity.ok(monthlyBean);
	}
	
	@GetMapping("/by-category")
	public ResponseEntity<List<SalesByCategoryDTO>>getSalesByCategory(){
		List<SalesByCategoryDTO> listsales= orderService.getListOfSalesByCategory();
		return ResponseEntity.ok(listsales);
	}
}
