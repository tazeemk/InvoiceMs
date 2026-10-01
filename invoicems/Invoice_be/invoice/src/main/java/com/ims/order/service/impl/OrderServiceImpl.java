package com.ims.order.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ims.customer.entity.CustomerEntity;
import com.ims.customer.repository.CustomerRepository;
import com.ims.filter.criteria.bean.FilterCriteriaBean;
import com.ims.filter.criteria.service.FilterCriteriaService;
import com.ims.invoiceItems.entity.InvoiceItemsEntity;
import com.ims.invoiceItems.repository.InvoiceItemsRepository;
import com.ims.invoices.entity.InvoicesEntity;
import com.ims.invoices.repository.InvoicesRepository;
import com.ims.order.bean.MonthlySalesDTO;
import com.ims.order.bean.OrderBean;
import com.ims.order.bean.SalesByCategoryDTO;
import com.ims.order.bean.SalesSummary;
import com.ims.order.entity.OrderEntity;
import com.ims.order.repository.OrderRepository;
import com.ims.order.servic.OrderService;
import com.ims.orderItem.entity.OrderItemEntity;
import com.ims.orderItem.repository.OrderItemRepository;
import com.ims.product.entity.ProductEntity;
import com.ims.repository.ProductRepository;



@Service
public class OrderServiceImpl implements OrderService 
{

	@Autowired
	private OrderRepository orderRepo;
	
	@Autowired
	private OrderItemRepository orderItemrepository;
	
	@Autowired
	private InvoicesRepository invoicesRepository;
	
	@Autowired
	private CustomerRepository customerRepository;
	
	 @Autowired
	private FilterCriteriaService<OrderEntity>orderfilterService;
	 
	 @Autowired
	 private InvoiceItemsRepository invoiceItemsRepository;
	 
	 @Autowired
	 private ProductRepository productRepository;

	
	@SuppressWarnings("unused")
	@Override
	public void createOrder(OrderBean orderBean) 
	{
		String orderNumber =orderBean.getOrderNumber();
		Optional<OrderEntity> checkorderNumber=orderRepo.findByOrderNumber(orderNumber);
		 if(orderBean ==null) {
		    	throw new IllegalArgumentException("Order Is Empty :");
		    }
		if(checkorderNumber.isPresent()) {
			throw new IllegalArgumentException("Order Number Already Exist ");
		}
	   
	    if(orderBean.getOrderlist()==null) {
	    	throw new  IllegalArgumentException("Please Select OrderItems :");
	    }
	    
	    // Find customer by business name
	    CustomerEntity customerEntity = null;
	    if(orderBean.getCustomer() != null && !orderBean.getCustomer().isBlank()) {
	    	Optional<CustomerEntity> customer = customerRepository.findByBusinessName(orderBean.getCustomer());
	    	if(customer.isEmpty()) {
	    		throw new IllegalArgumentException("Customer not found: " + orderBean.getCustomer());
	    	}
	    	customerEntity = customer.get();
	    }
	    
		OrderEntity orderEntity = new OrderEntity();
		orderEntity.setOrderNumber(orderBean.getOrderNumber());
	    orderEntity.setRetailer(orderBean.getRetailer());
	    orderEntity.setSalesperson(orderBean.getSalesperson());
	    orderEntity.setCustomerEntity(customerEntity);
	    orderEntity.setOrderDate(orderBean.getOrderDate());
	    orderEntity.setExpectedDeliveryDate(orderBean.getExpectedDeliveryDate());
	    orderEntity.setTotalAmount(orderBean.getTotalAmount());
	    orderEntity.setDescription(orderBean.getDescription());
	    orderEntity.setStatus("CREATED");
	   
	    List<OrderItemEntity>listofOrderItems =new ArrayList<>();
	    		for(OrderItemEntity order:orderBean.getOrderlist()) {
	    			OrderItemEntity entity = new OrderItemEntity();
	    			entity.setProduct(order.getProduct());
	    			entity.setQuantity(order.getQuantity());
	    			entity.setUnitPrice(order.getUnitPrice());
	    			entity.setTotalPrice(order.getTotalPrice());
	    			entity.setTaxRate(order.getTaxRate());
	    			entity.setTaxAmount(order.getTaxAmount());
	    			entity.setOrder(orderEntity);
	    			listofOrderItems.add(entity);
	    			
	    		}
	    		orderEntity.setOrderlist(listofOrderItems);
               orderRepo.save(orderEntity);
	    		
	}
	
	@Override
	public List<OrderEntity> listOfFilteredOrder(List<FilterCriteriaBean> filters, int limit) {
	try {
		List<OrderEntity>listOfOrderEntity=(List<OrderEntity>) orderfilterService.getListOfFilteredData(OrderEntity.class, filters, limit);
		
		return listOfOrderEntity;
	}catch(Exception e) {
		throw new IllegalArgumentException(e.getMessage());
	}
	}
	
	
	@Override
	@Transactional
	public OrderBean changeOrderStatus(String orderNumber) {
	
		if(orderNumber == null || orderNumber.isBlank()) {
			throw new IllegalArgumentException("Invalid OrderNumber :");
		}
		    Optional<OrderEntity>order=orderRepo.findByOrderNumber(orderNumber);
		    if(order.isEmpty()) {
		    	throw new IllegalArgumentException("Order Not Found :");
		    }
		    
		    OrderEntity changeOrder = order.get();
		    String currentStatus = changeOrder.getStatus();
		    if (currentStatus == null || currentStatus.isBlank()) {
		        throw new IllegalArgumentException("Order has no status");
		    }
		    
		    // Define valid status transitions
		    switch(currentStatus.trim().replace(' ', '_').toUpperCase(Locale.ROOT)) {
		        case "CREATED":
		            changeOrder.setStatus("IN_PROGRESS");
		            break;
		        case "IN_PROGRESS":
		            changeOrder.setStatus("COMPLETED");
		            createInvoiceFromOrder(changeOrder);
		            break;
		        case "CANCELLED":
		        case "REJECTED":
		            throw new IllegalArgumentException("Cannot change status of a closed order");
		        case "COMPLETED":
		            throw new IllegalArgumentException("Order is already completed");
		        default:
		            throw new IllegalArgumentException("Invalid order status: " + currentStatus);
		    }
		    
		    OrderEntity orderResult = orderRepo.save(changeOrder);
		    OrderBean bean = new OrderBean();
		    BeanUtils.copyProperties(orderResult, bean);
		    return bean;
	}
	
	@Override
	public void cancelOrder(String orderNumber,String reason) 
	{
	
		if(orderNumber.isBlank()) {
			throw new IllegalArgumentException("Invalid OrderNumber ");
		}
		Optional<OrderEntity>cancelOrder= orderRepo.findByOrderNumber(orderNumber);
		if(cancelOrder.isEmpty()) {
			throw new IllegalArgumentException("Order Not Found :");	
			}
		OrderEntity orderEntity = cancelOrder.get();
		if (!"CREATED".equals(orderEntity.getStatus()) && !"IN_PROGRESS".equals(orderEntity.getStatus())) {
			throw new IllegalArgumentException("Only active orders can be cancelled");
		}
		orderEntity.setStatus("CANCELLED");
		orderEntity.setCancelReason(reason);
		orderRepo.save(orderEntity);
		
	}

	@Override
	public void rejectOrder(String orderNumber) {
		if (orderNumber == null || orderNumber.isBlank()) {
			throw new IllegalArgumentException("Invalid OrderNumber");
		}
		OrderEntity order = orderRepo.findByOrderNumber(orderNumber)
				.orElseThrow(() -> new IllegalArgumentException("Order Not Found"));
		if (!"CREATED".equals(order.getStatus()) && !"IN_PROGRESS".equals(order.getStatus())) {
			throw new IllegalArgumentException("Only active orders can be rejected");
		}
		order.setStatus("REJECTED");
		orderRepo.save(order);
	}
	
	
	@Override
	public String removeOrder(String orderNumber) {
	      if(orderNumber ==null) {
	    	  throw new IllegalArgumentException("Invalid OrderNumber :");
	      }
	          Optional<OrderEntity>orderEntity =orderRepo.findByOrderNumber(orderNumber);
		        if(orderEntity.isEmpty()) {
		        	throw new IllegalArgumentException("OrderNumber Not Found :");
		        }
	          Integer orderId=orderEntity.get().getOrderId();
	           
	          List<OrderItemEntity>listofOrderEntity=orderItemrepository.getListOfOrders(orderId);
	          
	          List<Integer>ids= new ArrayList<>();
	          for(OrderItemEntity entity:listofOrderEntity) {
	        	  ids.add(entity.getOrderItemId());
	          }
	          orderRepo.deleteById(orderId);
	          return "Order Deleted Successfully :";
	}
	
	private void createInvoiceFromOrder(OrderEntity order) {
		if (order.getCustomerEntity() == null) {
			throw new IllegalArgumentException("Customer information is required to create invoice");
		}
		
		CustomerEntity customer = order.getCustomerEntity();
		
		// Generate unique invoice ID and number
		String invoiceId = UUID.randomUUID().toString().substring(0, 20);
		String invoiceNo = "INV-" + order.getOrderNumber();
		
		// Calculate totals from order items
		BigDecimal subtotal = BigDecimal.ZERO;
		BigDecimal totalTax = BigDecimal.ZERO;
		
		if (order.getOrderlist() != null) {
			for (OrderItemEntity item : order.getOrderlist()) {
				if (item.getTotalPrice() != null) {
					subtotal = subtotal.add(BigDecimal.valueOf(item.getTotalPrice()));
				}
				if (item.getTaxAmount() != null) {
					totalTax = totalTax.add(BigDecimal.valueOf(item.getTaxAmount()));
				}
			}
		}
		
		BigDecimal grandTotal = subtotal.add(totalTax);
		
		// Create invoice entity
		InvoicesEntity invoice = new InvoicesEntity();
		invoice.setId(invoiceId);
		invoice.setInvoiceNo(invoiceNo);
		invoice.setInvoiceDate(LocalDate.now());
		
		// Set customer information
		invoice.setCustomerId(customer.getId());
		invoice.setCustomerName(customer.getBusinessName());
		invoice.setCustomerCode(customer.getCustomerCode());
		invoice.setContactPerson(customer.getContactPerson());
		invoice.setMobile(customer.getMobile());
		invoice.setEmail(customer.getEmail());
		invoice.setBillingAddress(customer.getAddress());
		invoice.setShippingAddress(customer.getAddress());
		invoice.setGstin(customer.getGstin());
		invoice.setPan(customer.getPan());
		invoice.setState(customer.getState());
		invoice.setCity(customer.getCity());
		invoice.setCreditDays(customer.getCreditDays());
		
		// Calculate due date
		LocalDate dueDate = LocalDate.now().plusDays(customer.getCreditDays() != null ? customer.getCreditDays() : 30);
		invoice.setDueDate(dueDate);
		invoice.setOrderNumber(order.getOrderNumber());
		
		// Set financial information
		invoice.setSubtotal(subtotal);
		invoice.setTaxableAmount(subtotal);
		invoice.setTotalTax(totalTax);
		invoice.setGrandTotal(grandTotal);
		invoice.setBalanceAmount(grandTotal);
		invoice.setPaidAmount(BigDecimal.ZERO);
		invoice.setDiscountAmount(BigDecimal.ZERO);
		invoice.setRoundOff(BigDecimal.ZERO);
		
		// Set order information
//		invoice.setAssignUserId(order.getSalesperson());
//		invoice.setAssignUser(order.getSalesperson());
		
		// Set defaults
		invoice.setInvoiceType("TAX_INVOICE");
		invoice.setStatus("GENERATED");
//		invoice.setTallySynced(false);
		invoice.setSentToCustomer(false);
		// Set defaults
		invoice.setInvoiceType("TAX_INVOICE");
		invoice.setStatus("GENERATED");
		invoice.setSentToCustomer(false);
		invoice.setCreatedBy("SYSTEM");
		invoice.setCreatedAt(LocalDateTime.now());
		invoice.setUpdatedAt(LocalDateTime.now());
		invoice.setRemarks("Auto-generated from Order: " + order.getOrderNumber());
		
		// Save invoice
		InvoicesEntity savedInvoice = invoicesRepository.save(invoice);
		
		// Create invoice items from order items
		if (order.getOrderlist() != null && !order.getOrderlist().isEmpty()) {
			int lineNo = 1;
			for (OrderItemEntity orderItem : order.getOrderlist()) {
				InvoiceItemsEntity invoiceItem = new InvoiceItemsEntity();
				
				// Generate unique ID for invoice item
				invoiceItem.setId(UUID.randomUUID().toString().substring(0, 20));
				invoiceItem.setInvoiceId(savedInvoice.getId());
				invoiceItem.setLineNo(lineNo++);
				ProductEntity product = productRepository
						.findFirstByProductNameIgnoreCase(orderItem.getProduct())
						.orElse(null);
				
				// Set item details from order item
				invoiceItem.setItemCode(orderItem.getProduct());
				invoiceItem.setItemName(orderItem.getProduct());
				invoiceItem.setDescription("From Order: " + order.getOrderNumber());
				invoiceItem.setHsnCode(product != null ? product.getProductCode() : "");
				
				// Set quantities and amounts
				invoiceItem.setQuantity(BigDecimal.valueOf(orderItem.getQuantity()));
				invoiceItem.setUnit("PCS");
				invoiceItem.setRate(BigDecimal.valueOf(orderItem.getUnitPrice()));
				invoiceItem.setDiscountPercent(BigDecimal.ZERO);
				invoiceItem.setDiscountAmount(BigDecimal.ZERO);
				invoiceItem.setTaxableAmount(BigDecimal.valueOf(orderItem.getTotalPrice()));
				
				// Parse tax rate and calculate tax amounts
				BigDecimal taxRate = BigDecimal.ZERO;
				try {
					if (orderItem.getTaxRate() != null && !orderItem.getTaxRate().isEmpty()) {
						taxRate = new BigDecimal(orderItem.getTaxRate());
					}
				} catch (NumberFormatException e) {
					taxRate = BigDecimal.ZERO;
				}
				
				// Split tax into CGST and SGST (assuming intra-state transaction)
				BigDecimal halfTaxRate = taxRate.divide(BigDecimal.valueOf(2), 2, BigDecimal.ROUND_HALF_UP);
				BigDecimal taxAmount = BigDecimal.valueOf(orderItem.getTaxAmount() != null ? orderItem.getTaxAmount() : 0);
				BigDecimal halfTaxAmount = taxAmount.divide(BigDecimal.valueOf(2), 2, BigDecimal.ROUND_HALF_UP);
				
				invoiceItem.setCgstRate(halfTaxRate);
				invoiceItem.setCgstAmount(halfTaxAmount);
				invoiceItem.setSgstRate(halfTaxRate);
				invoiceItem.setSgstAmount(halfTaxAmount);
				invoiceItem.setIgstRate(BigDecimal.ZERO);
				invoiceItem.setIgstAmount(BigDecimal.ZERO);
				
				// Set total amount
				invoiceItem.setTotalAmount(BigDecimal.valueOf(orderItem.getTotalPrice()).add(taxAmount));
				invoiceItem.setCreatedAt(LocalDateTime.now());
				
				// Save invoice item
				invoiceItemsRepository.save(invoiceItem);
			}
		}
	}	
	

	@Override
	public SalesSummary getListOfSalesSummary() {
	  Double totalSales =orderRepo.totalSales();
	  Long totalOrders =orderRepo.totalNumberofOrders();
	  Long totalOrderItem=orderItemrepository.totalNumbersOfOrderItem();
	  SalesSummary bean = new SalesSummary();
	  bean.setTotalSales(totalSales);
      bean.setTotalOrders(totalOrders);
      bean.setAverageOrderValue(totalSales/totalOrders);
      bean.setTotalQuantity(totalOrderItem);
      return bean;
	}
	
	@Override
	public List<MonthlySalesDTO> getMonthlyWithOrders() {
	
		List<Object[]> results = orderRepo.getMonthWithOrder();
         List<MonthlySalesDTO> listOfMonthly =new ArrayList<>();
		for(Object[] row : results){
			MonthlySalesDTO bean = new MonthlySalesDTO();
		    Integer month = (Integer) row[0];
		    Double totalOrders = (double) ((Number) row[1]).longValue();
            bean.setMonth(month);
            bean.setTotalSales(totalOrders);
		    System.out.println("Month: " + month + " Orders: " + totalOrders);
		    listOfMonthly.add(bean);
		}
		return listOfMonthly;
	}
	
	@Override
	public List<SalesByCategoryDTO> getListOfSalesByCategory() {
	
		List<Object[]> result = orderItemrepository.getProductCount();
         List<SalesByCategoryDTO>listofsales =new ArrayList<>();
		for (Object[] row : result) {
			SalesByCategoryDTO dto = new SalesByCategoryDTO();
		    String product = (String) row[0];
		    Double count = (double) ((Number) row[1]).longValue();
		   dto.setCategory(product);
		   dto.setTotalSales(count);
		   listofsales.add(dto);
		}
		return listofsales;
	}
	
}
