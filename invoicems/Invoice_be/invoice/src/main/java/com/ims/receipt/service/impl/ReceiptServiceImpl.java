package com.ims.receipt.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ims.filter.criteria.bean.FilterCriteriaBean;
import com.ims.filter.criteria.service.FilterCriteriaService;
import com.ims.invoices.bean.InvoicesBean;
import com.ims.invoices.entity.InvoicesEntity;
import com.ims.receipt.bean.ReceiptBean;
import com.ims.receipt.entity.ReceiptEntity;
import com.ims.receipt.repository.ReceiptRepository;
import com.ims.receipt.service.ReceiptService;

@Service
public class ReceiptServiceImpl implements ReceiptService {

    private final ReceiptRepository receiptRepository;

    public ReceiptServiceImpl(ReceiptRepository receiptRepository) {
        this.receiptRepository = receiptRepository;
    }

    /* ───────── CREATE ───────── */

    @Override
    public ReceiptBean createReceipt(ReceiptBean bean) {

        ReceiptEntity entity = new ReceiptEntity();

        entity.setId(UUID.randomUUID().toString());
        entity.setReceiptNo(generateReceiptNo());

        mapBeanToEntity(bean, entity);

        ReceiptEntity saved = receiptRepository.save(entity);

        return mapEntityToBean(saved);
    }

    /* ───────── UPDATE ───────── */

    @Override
    public ReceiptBean updateReceipt(String id, ReceiptBean bean) {

        ReceiptEntity entity = receiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found"));

        mapBeanToEntity(bean, entity);

        ReceiptEntity updated = receiptRepository.save(entity);

        return mapEntityToBean(updated);
    }

    /* ───────── DELETE ───────── */

    @Override
    public void deleteReceipt(String id) {
        if (!receiptRepository.existsById(id)) {
            throw new RuntimeException("Receipt not found");
        }
        receiptRepository.deleteById(id);
    }

    /* ───────── GET BY ID ───────── */

    @Override
    public ReceiptBean getReceiptById(String id) {

        ReceiptEntity entity = receiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found"));

        return mapEntityToBean(entity);
    }

    /* ───────── GET BY RECEIPT NO ───────── */

    @Override
    public ReceiptBean getReceiptByReceiptNo(String receiptNo) {

        ReceiptEntity entity = receiptRepository.findByReceiptNo(receiptNo)
                .orElseThrow(() -> new RuntimeException("Receipt not found"));

        return mapEntityToBean(entity);
    }

    /* ───────── GET ALL ───────── */

    @Override
    public List<ReceiptBean> getAllReceipts() {

        return receiptRepository.findAll()
                .stream()
                .map(this::mapEntityToBean)
                .collect(Collectors.toList());
    }

    /* ───────── DATE RANGE ───────── */

    @Override
    public List<ReceiptBean> getReceiptsByDateRange(LocalDate startDate, LocalDate endDate) {

        return receiptRepository.findByReceiptDateBetween(startDate, endDate)
                .stream()
                .map(this::mapEntityToBean)
                .collect(Collectors.toList());
    }

    /* ───────── PRIVATE MAPPING ───────── */

    private ReceiptBean mapEntityToBean(ReceiptEntity entity) {

        ReceiptBean bean = new ReceiptBean();

        bean.setId(entity.getId());
        bean.setReceiptNo(entity.getReceiptNo());
        bean.setOrderNumber(entity.getOrderNumber());
        bean.setInvoiceNumber(entity.getInvoiceNumber());
        bean.setReceiptDate(entity.getReceiptDate());
        bean.setAmount(entity.getAmount());
        bean.setPaymentMethod(entity.getPaymentMethod());
        bean.setPaymentRef(entity.getPaymentRef());
        bean.setPreviousOutstanding(entity.getPreviousOutstanding());
        bean.setBalanceOutstanding(entity.getBalanceOutstanding());
        bean.setCollectedBy(entity.getCollectedBy());
        bean.setCustomerName(entity.getCustomerName());
        bean.setContactPerson(entity.getContactPerson());
        bean.setCustomerAddress(entity.getCustomerAddress());
        bean.setRemarks(entity.getRemarks());
        bean.setCollectionAddress(entity.getCollectionAddress());
        bean.setCreatedAt(entity.getCreatedAt());

        return bean;
    }

    private void mapBeanToEntity(ReceiptBean bean, ReceiptEntity entity) {

        entity.setOrderNumber(bean.getOrderNumber());
        entity.setInvoiceNumber(bean.getInvoiceNumber());
        entity.setReceiptDate(bean.getReceiptDate());
        entity.setAmount(bean.getAmount());
        entity.setPaymentMethod(bean.getPaymentMethod());
        entity.setPaymentRef(bean.getPaymentRef());
        entity.setPreviousOutstanding(bean.getPreviousOutstanding());
        entity.setBalanceOutstanding(bean.getBalanceOutstanding());
        entity.setCollectedBy(bean.getCollectedBy());
        entity.setCustomerName(bean.getCustomerName());
        entity.setContactPerson(bean.getContactPerson());
        entity.setCustomerAddress(bean.getCustomerAddress());
        entity.setRemarks(bean.getRemarks());
        entity.setCollectionAddress(bean.getCollectionAddress());
    }

    /* ───────── AUTO RECEIPT NO ───────── */

    private String generateReceiptNo() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyMMddHHmmss");
        return "RCT-" + LocalDateTime.now().format(formatter);
    }


	
	@Autowired
	private FilterCriteriaService<ReceiptEntity> filterCriteriaService;

	@Override
	public List<ReceiptBean> getAllReceiptsFilter(List<FilterCriteriaBean> filters, int limit) {

	    try {

	        @SuppressWarnings("unchecked")
	        List<ReceiptEntity> filteredEntities =
	                (List<ReceiptEntity>) filterCriteriaService
	                        .getListOfFilteredData(ReceiptEntity.class, filters, limit);

	        return filteredEntities.stream()
	                .map(this::mapEntityToBean)   
	                .collect(Collectors.toList());

	    } catch (Exception e) {
	        throw new RuntimeException("Error filtering receipts: " + e.getMessage(), e);
	    }
	}	
}