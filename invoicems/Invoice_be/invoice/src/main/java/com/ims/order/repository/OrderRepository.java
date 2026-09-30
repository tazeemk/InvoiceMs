package com.ims.order.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ims.order.entity.OrderEntity;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Integer> 
{

	Optional<OrderEntity> findByOrderNumber(String orderNumber);
	
	@Query(value="select sum(total_amount) from orders",nativeQuery=true)
	public Double totalSales();
	
	@Query(value="select count(*) from orders",nativeQuery=true)
	public Long totalNumberofOrders();
	
	
	@Query(value = "SELECT MONTH(order_date) AS month, COUNT(*) AS total_orders " +
            "FROM orders " +
            "GROUP BY MONTH(order_date) " +
            "ORDER BY MONTH(order_date)", 
    nativeQuery = true)
  List<Object[]> getMonthWithOrder();
	
}
