package com.ims.invoiceItems.service.impl;

import com.ims.filter.criteria.bean.FilterCriteriaBean;
import com.ims.filter.criteria.service.FilterCriteriaService;
import com.ims.invoiceItems.bean.InvoiceItemsBean;
import com.ims.invoiceItems.entity.InvoiceItemsEntity;
import com.ims.invoiceItems.repository.InvoiceItemsRepository;
import com.ims.invoiceItems.service.InvoiceItemsService;
import com.ims.user.bean.UserBean;
import com.ims.user.entity.UserEntity;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class InvoiceItemsServiceImpl implements InvoiceItemsService {

    @Autowired
    private InvoiceItemsRepository invoiceItemsRepository;

    @Override
    public InvoiceItemsBean createInvoiceItem(InvoiceItemsBean itemBean) {
        InvoiceItemsEntity entity = new InvoiceItemsEntity();
        BeanUtils.copyProperties(itemBean, entity);
        entity.setCreatedAt(LocalDateTime.now());
        
        InvoiceItemsEntity saved = invoiceItemsRepository.save(entity);
        
        InvoiceItemsBean result = new InvoiceItemsBean();
        BeanUtils.copyProperties(saved, result);
        return result;
    }

    @Override
    public InvoiceItemsBean updateInvoiceItem(String id, InvoiceItemsBean itemBean) {
        InvoiceItemsEntity entity = invoiceItemsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice item not found with ID: " + id));
        
        BeanUtils.copyProperties(itemBean, entity, "id", "createdAt");
        InvoiceItemsEntity updated = invoiceItemsRepository.save(entity);
        
        InvoiceItemsBean result = new InvoiceItemsBean();
        BeanUtils.copyProperties(updated, result);
        return result;
    }

    @Override
    public void deleteInvoiceItem(String id) {
        if (!invoiceItemsRepository.existsById(id)) {
            throw new RuntimeException("Invoice item not found with ID: " + id);
        }
        invoiceItemsRepository.deleteById(id);
    }

    @Override
    public InvoiceItemsBean getInvoiceItemById(String id) {
        InvoiceItemsEntity entity = invoiceItemsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice item not found with ID: " + id));
        
        InvoiceItemsBean bean = new InvoiceItemsBean();
        BeanUtils.copyProperties(entity, bean);
        return bean;
    }

    @Override
    public List<InvoiceItemsBean> getAllInvoiceItems() {
        return invoiceItemsRepository.findAll().stream()
                .map(entity -> {
                    InvoiceItemsBean bean = new InvoiceItemsBean();
                    BeanUtils.copyProperties(entity, bean);
                    return bean;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<InvoiceItemsBean> getInvoiceItemsByInvoiceId(String invoiceId) {
        return invoiceItemsRepository.findByInvoiceId(invoiceId).stream()
                .map(entity -> {
                    InvoiceItemsBean bean = new InvoiceItemsBean();
                    BeanUtils.copyProperties(entity, bean);
                    return bean;
                })
                .collect(Collectors.toList());
    }

    @Override
    public void deleteInvoiceItemsByInvoiceId(String invoiceId) {
        invoiceItemsRepository.deleteByInvoiceId(invoiceId);
    }


	
	@Autowired
	private FilterCriteriaService<UserEntity> filterCriteriaService;

	@Override
	public List<InvoiceItemsBean> filtergetAllItems(List<FilterCriteriaBean> filters, int limit) {
		try {
			@SuppressWarnings("unchecked")
			List<InvoiceItemsEntity> filteredEntities = (List<InvoiceItemsEntity>) filterCriteriaService
					.getListOfFilteredData(UserEntity.class, filters, limit);

			return filteredEntities.stream().map(this::convertToBean).collect(Collectors.toList());

		} catch (Exception e) {
			throw new RuntimeException("Error filtering products: " + e.getMessage(), e);
		}
	}
	
	private InvoiceItemsBean convertToBean(InvoiceItemsEntity entity) {
	    InvoiceItemsBean bean = new InvoiceItemsBean();
	    BeanUtils.copyProperties(entity, bean);
	    return bean;
	}


}