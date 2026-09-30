package com.ims.orderItem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ims.orderItem.entity.OrderItemEntity;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItemEntity, Integer> 
{

	@Query(value="select * from ORDER_ITEM where order_id = :orderId",nativeQuery = true)
	List<OrderItemEntity>getListOfOrders(Integer orderId);
	
	@Query(value = "select count(*) from order_item",nativeQuery = true)
	public Long totalNumbersOfOrderItem();
	
	
	@Query(value = "SELECT product, COUNT(*) " +
            "FROM order_item " +
            "GROUP BY product",
    nativeQuery = true)
    List<Object[]> getProductCount();
	
}
