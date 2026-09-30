package com.ims.invoices.service.impl;

import com.ims.invoices.bean.InvoicesBean;
import com.ims.invoices.entity.InvoicesEntity;
import com.ims.invoices.repository.InvoicesRepository;
import com.ims.invoices.service.InvoicesService;
import com.ims.receipt.entity.ReceiptEntity;
import com.ims.receipt.repository.ReceiptRepository;
import com.ims.user.bean.UserBean;
import com.ims.user.entity.UserEntity;
import com.ims.user.repository.UserRepository;
import com.ims.filter.criteria.bean.FilterCriteriaBean;
import com.ims.filter.criteria.service.FilterCriteriaService;
import com.ims.invoiceItems.bean.InvoiceItemsBean;
import com.ims.invoiceItems.service.InvoiceItemsService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class InvoicesServiceImpl implements InvoicesService {

    @Autowired
    private InvoicesRepository invoicesRepository;
    
    @Autowired
    private InvoiceItemsService invoiceItemsService;
    
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	ReceiptRepository receiptRepository;

    @Override
    public InvoicesBean createInvoice(InvoicesBean invoiceBean) {
        InvoicesEntity entity = new InvoicesEntity();
        BeanUtils.copyProperties(invoiceBean, entity, "items");
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        
        InvoicesEntity saved = invoicesRepository.save(entity);
        
        // Save invoice items
        if (invoiceBean.getItems() != null && !invoiceBean.getItems().isEmpty()) {
            int lineNo = 1;
            for (InvoiceItemsBean itemBean : invoiceBean.getItems()) {
                itemBean.setInvoiceId(saved.getId());
                itemBean.setLineNo(lineNo++);
                invoiceItemsService.createInvoiceItem(itemBean);
            }
        }
        
        return getInvoiceById(saved.getId());
    }

    @Override
    public InvoicesBean updateInvoice(String id, InvoicesBean invoiceBean) {
        InvoicesEntity entity = invoicesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with ID: " + id));
        
        BeanUtils.copyProperties(invoiceBean, entity, "id", "createdAt", "createdBy", "items");
        entity.setUpdatedAt(LocalDateTime.now());
        
        InvoicesEntity updated = invoicesRepository.save(entity);
        
        // Update invoice items
        if (invoiceBean.getItems() != null) {
            invoiceItemsService.deleteInvoiceItemsByInvoiceId(id);
            int lineNo = 1;
            for (InvoiceItemsBean itemBean : invoiceBean.getItems()) {
                itemBean.setInvoiceId(id);
                itemBean.setLineNo(lineNo++);
                invoiceItemsService.createInvoiceItem(itemBean);
            }
        }
        
        return getInvoiceById(updated.getId());
    }

    @Override
    public void deleteInvoice(String id) {
        if (!invoicesRepository.existsById(id)) {
            throw new RuntimeException("Invoice not found with ID: " + id);
        }
        invoiceItemsService.deleteInvoiceItemsByInvoiceId(id);
        invoicesRepository.deleteById(id);
    }

    @Override
    public InvoicesBean getInvoiceById(String id) {
        InvoicesEntity entity = invoicesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with ID: " + id));
        
        InvoicesBean bean = new InvoicesBean();
        BeanUtils.copyProperties(entity, bean);
        
        // Get invoice items
        List<InvoiceItemsBean> items = invoiceItemsService.getInvoiceItemsByInvoiceId(id);
        bean.setItems(items);
        
        return bean;
    }

    @Override
    public InvoicesBean getInvoiceByInvoiceNo(String invoiceNo) {
        InvoicesEntity entity = invoicesRepository.findByInvoiceNo(invoiceNo)
                .orElseThrow(() -> new RuntimeException("Invoice not found with invoice no: " + invoiceNo));
        
        InvoicesBean bean = new InvoicesBean();
        BeanUtils.copyProperties(entity, bean);
        
        List<InvoiceItemsBean> items = invoiceItemsService.getInvoiceItemsByInvoiceId(entity.getId());
        bean.setItems(items);
        
        return bean;
    }

    @Override
    public List<InvoicesBean> getAllInvoices() {
        return invoicesRepository.findAll().stream()
                .map(entity -> {
                    InvoicesBean bean = new InvoicesBean();
                    BeanUtils.copyProperties(entity, bean);
                    List<InvoiceItemsBean> items = invoiceItemsService.getInvoiceItemsByInvoiceId(entity.getId());
                    bean.setItems(items);
                    return bean;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<InvoicesBean> getInvoicesByCustomerId(String customerId) {
        return invoicesRepository.findByCustomerId(customerId).stream()
                .map(entity -> {
                    InvoicesBean bean = new InvoicesBean();
                    BeanUtils.copyProperties(entity, bean);
                    List<InvoiceItemsBean> items = invoiceItemsService.getInvoiceItemsByInvoiceId(entity.getId());
                    bean.setItems(items);
                    return bean;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<InvoicesBean> getInvoicesByStatus(String status) {
        return invoicesRepository.findByStatus(status).stream()
                .map(entity -> {
                    InvoicesBean bean = new InvoicesBean();
                    BeanUtils.copyProperties(entity, bean);
                    return bean;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<InvoicesBean> getInvoicesByDateRange(LocalDate startDate, LocalDate endDate) {
        return invoicesRepository.findByInvoiceDateBetween(startDate, endDate).stream()
                .map(entity -> {
                    InvoicesBean bean = new InvoicesBean();
                    BeanUtils.copyProperties(entity, bean);
                    return bean;
                })
                .collect(Collectors.toList());
    }



    @Override
    public InvoicesBean assignInvoiceToUser(String invoiceId, String assignUserId) {

        InvoicesEntity invoice = invoicesRepository.findById(invoiceId)
                .orElseThrow(() ->
                        new RuntimeException("Invoice not found with ID: " + invoiceId));

        // ❌ Prevent assigning cancelled or paid invoices
        if ("CANCELLED".equals(invoice.getStatus()) ||
            "PAID".equals(invoice.getStatus())) {
            throw new RuntimeException("Cannot assign invoice with status: " + invoice.getStatus());
        }

        // Fetch user (assuming you have userRepository)
        UserEntity user = userRepository.findById(assignUserId)
                .orElseThrow(() ->
                        new RuntimeException("User not found with ID: " + assignUserId));

        // Set assignment
        invoice.setAssignUserId(user.getId());
        invoice.setAssignUser(user.getUsername());

        // Only set IN_PROGRESS if not overdue
        if (!"OVERDUE".equals(invoice.getStatus())) {
            invoice.setStatus("IN_PROGRESS");
        }

        invoice.setUpdatedAt(LocalDateTime.now());

        InvoicesEntity updated = invoicesRepository.save(invoice);

        InvoicesBean bean = new InvoicesBean();
        BeanUtils.copyProperties(updated, bean);

        return bean;
    }


    @Override
    public InvoicesBean syncToTally(String id, String tallyVoucherNo) {
        InvoicesEntity entity = invoicesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with ID: " + id));
        
        entity.setTallySynced(true);
        entity.setTallyVoucherNo(tallyVoucherNo);
        entity.setUpdatedAt(LocalDateTime.now());
        
        InvoicesEntity updated = invoicesRepository.save(entity);
        
        InvoicesBean bean = new InvoicesBean();
        BeanUtils.copyProperties(updated, bean);
        return bean;
    }


	
	@Autowired
	private FilterCriteriaService<InvoicesEntity> filterCriteriaService;

	@Override
	public List<InvoicesBean> getAllInvoicesFilter(List<FilterCriteriaBean> filters, int limit) {
	    try {
	        @SuppressWarnings("unchecked")
	        List<InvoicesEntity> filteredEntities = 
	                (List<InvoicesEntity>) filterCriteriaService
	                .getListOfFilteredData(InvoicesEntity.class, filters, limit);

	        return filteredEntities.stream()
	                .map(this::convertToBean)
	                .collect(Collectors.toList());

	    } catch (Exception e) {
	        throw new RuntimeException("Error filtering invoices: " + e.getMessage(), e);
	    }
	}

	private InvoicesBean convertToBean(InvoicesEntity entity) {
	    InvoicesBean bean = new InvoicesBean();
	    
	    if(entity.getAssignUserId() != null) {
	    bean.setAssignUserId(entity.getAssignUserId());
	    bean.setAssignUser(entity.getAssignUser());
	    bean.setOrderNumber(entity.getOrderNumber());
	    bean.setCollectionAmount(entity.getLastCollectionAmount());
	    }
	    BeanUtils.copyProperties(entity, bean);

	    List<InvoiceItemsBean> items = invoiceItemsService.getInvoiceItemsByInvoiceId(entity.getId());
	    bean.setItems(items);

	    return bean;
	}

	@Override
	public InvoicesBean updateInvoiceByCollection(String id, InvoicesBean invoiceBean) {

	    InvoicesEntity invoice = invoicesRepository.findById(id)
	            .orElseThrow(() ->
	                    new RuntimeException("Invoice not found with ID: " + id));

	    if ("PAID".equalsIgnoreCase(invoice.getStatus())) {
	        throw new RuntimeException("Invoice is already fully paid.");
	    }

	    if (invoiceBean.getCollectionAmount() == null ||
	        invoiceBean.getCollectionAmount().trim().isEmpty()) {
	        throw new RuntimeException("Collected amount is required.");
	    }

	    /* ========= STRING → BIGDECIMAL ========= */

	    BigDecimal collectedAmount =
	            new BigDecimal(invoiceBean.getCollectionAmount());

	    BigDecimal previousOutstanding =
	            invoice.getBalanceAmount();   // make sure this field exists

	    if (collectedAmount.compareTo(BigDecimal.ZERO) <= 0) {
	        throw new RuntimeException("Collected amount must be greater than 0");
	    }

	    if (collectedAmount.compareTo(previousOutstanding) > 0) {
	        throw new RuntimeException("Collected amount cannot exceed outstanding amount");
	    }

	    BigDecimal balance = previousOutstanding.subtract(collectedAmount);

	    /* ========= CREATE RECEIPT ========= */

	    ReceiptEntity receipt = new ReceiptEntity();

	    receipt.setId(UUID.randomUUID().toString());
	    receipt.setReceiptNo(generateReceiptNo());

	    receipt.setOrderNumber(invoice.getOrderNumber());
	    receipt.setInvoiceNumber(invoice.getInvoiceNo());
	    receipt.setReceiptDate(LocalDate.now());

	    receipt.setAmount(collectedAmount); // BigDecimal
	    receipt.setPaymentMethod(invoiceBean.getPaymentMethod());
	    receipt.setPaymentRef(invoiceBean.getPaymentMethod());

	    receipt.setPreviousOutstanding(previousOutstanding);
	    receipt.setBalanceOutstanding(balance);
	    receipt.setCollectedBy(invoice.getAssignUser());
	    receipt.setCustomerName(invoice.getCustomerName());
	    receipt.setContactPerson(invoice.getContactPerson());
	    receipt.setCustomerAddress(invoice.getBillingAddress());
	    receipt.setCollectionAddress(invoiceBean.getCollectionAddress());
	    receipt.setRemarks(invoiceBean.getRemarks());

	    receipt.setCreatedAt(LocalDateTime.now());

	    receiptRepository.save(receipt);

	    /* ========= UPDATE INVOICE ========= */

	    BigDecimal newPaidAmount =
	            invoice.getPaidAmount() == null
	                    ? collectedAmount
	                    : invoice.getPaidAmount().add(collectedAmount);
	    invoice.setLastCollectionAmount(invoiceBean.getCollectionAmount());
	    invoice.setPaidAmount(newPaidAmount);
	    invoice.setBalanceAmount(balance);
        invoice.setStatus("COLLECTED");
	    invoice.setUpdatedAt(LocalDateTime.now());

	    invoicesRepository.save(invoice);

	    return getInvoiceById(invoice.getId());
	}
	
	private String generateReceiptNo() {
	    return "RCT-" +
	            LocalDateTime.now()
	                    .format(DateTimeFormatter.ofPattern("yyMMddHHmmss"));
	}
	
	

	@Override
	public InvoicesBean updateInvoiceStatus(String id, String status) {

	    // 1️ Fetch Entity (NOT Bean)
	    InvoicesEntity invoice = invoicesRepository.findById(id)
	            .orElseThrow(() ->
	                    new RuntimeException("Invoice not found: " + id));

	    // 2️Validate status
	    List<String> allowedStatuses = List.of(
	            "SUBMITTED", "VERIFIED", "COMPLETED",
	            "PENDING", "COLLECTED", "DISPUTED",
	            "REFUNDED", "PARTIAL", "PAID"
	    );

	    if (!allowedStatuses.contains(status)) {
	        throw new RuntimeException("Invalid status: " + status);
	    }
	    
	    if(status.equalsIgnoreCase("COMPLETED")) {
	    	   invoice.setAssignUserId(null);
	    	   invoice.setAssignUser(null);
	
	    }else {
	    	invoice.setStatus(status);
	    }

	    // 3️Update entity
	    
	    invoice.setUpdatedAt(LocalDateTime.now());

	    // 4️ Save
	   // InvoicesEntity updated = invoicesRepository.save(invoice);
	    InvoicesEntity updated = invoicesRepository.save(invoice);

	    // 5️ Convert to Bean
	    InvoicesBean bean = new InvoicesBean();
	    BeanUtils.copyProperties(updated, bean);

	    return bean;
	}
}
