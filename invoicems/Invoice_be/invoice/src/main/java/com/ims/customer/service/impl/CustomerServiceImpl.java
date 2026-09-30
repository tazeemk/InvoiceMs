package com.ims.customer.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ims.customer.bean.CustomerBean;
import com.ims.customer.entity.CustomerEntity;
import com.ims.customer.repository.CustomerRepository;
import com.ims.customer.service.CustomerService;
import com.ims.filter.criteria.bean.FilterCriteriaBean;
import com.ims.filter.criteria.service.FilterCriteriaService;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository repository;
    
    @Autowired
    private FilterCriteriaService<CustomerEntity> filterCriteriaService;
    
    private String generateShortId() {
        String timePart = Long.toString(System.currentTimeMillis(), 36); 
        String randomPart = Integer.toString(
                java.util.concurrent.ThreadLocalRandom.current().nextInt(36 * 36 * 36), 36
        ).toLowerCase();

        return "c" + timePart + randomPart;
    }


    @Override
    public CustomerBean createCustomer(CustomerBean bean) {
        // Validate required fields
        validateRequiredFields(bean);
        
        CustomerEntity entity = new CustomerEntity();
        
        entity.setId(generateShortId());
        entity.setCustomerCode(bean.getCustomerCode());
        entity.setBusinessName(bean.getBusinessName());
        
      
        entity.setGstin(bean.getGstin());
        entity.setPan(bean.getPan());
        entity.setContactPerson(bean.getContactPerson());
        entity.setCreditDays(bean.getCreditDays());
        entity.setMobile(bean.getMobile());
        entity.setEmail(bean.getEmail());
        entity.setAddress(bean.getAddress());
        entity.setCity(bean.getCity());
        entity.setState(bean.getState());
        
        // Set default values for financial fields if null
        entity.setCurrentOutstanding(
            bean.getCurrentOutstanding() != null ? bean.getCurrentOutstanding() : BigDecimal.ZERO
        );
        
        // Set default status if null
        entity.setStatus(
            bean.getStatus() != null && !bean.getStatus().isEmpty() ? bean.getStatus() : "ACTIVE"
        );
        
        CustomerEntity saved = repository.save(entity);
        return convertToBean(saved);
    }

    @Override
    public CustomerBean updateCustomer(String id, CustomerBean bean) {
        CustomerEntity entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));

        // Update required fields only if provided
        if (bean.getBusinessName() != null && !bean.getBusinessName().isEmpty()) {
            entity.setBusinessName(bean.getBusinessName());
        }
        
        // Update optional fields
        if (bean.getCustomerCode() != null) {
            entity.setCustomerCode(bean.getCustomerCode());
        }
        if (bean.getContactPerson() != null) {
            entity.setContactPerson(bean.getContactPerson());
        }
        if (bean.getCreditDays() != null) {
            entity.setCreditDays(bean.getCreditDays());
        }
        if (bean.getGstin() != null) {
            entity.setGstin(bean.getGstin());
        }
        if (bean.getPan() != null) {
            entity.setPan(bean.getPan());
        }
        if (bean.getMobile() != null) {
            entity.setMobile(bean.getMobile());
        }
        if (bean.getEmail() != null) {
            entity.setEmail(bean.getEmail());
        }
        if (bean.getAddress() != null) {
            entity.setAddress(bean.getAddress());
        }
        if (bean.getCity() != null) {
            entity.setCity(bean.getCity());
        }
        if (bean.getState() != null) {
            entity.setState(bean.getState());
        }
        if (bean.getCurrentOutstanding() != null) {
            entity.setCurrentOutstanding(bean.getCurrentOutstanding());
        }
        if (bean.getStatus() != null) {
            entity.setStatus(bean.getStatus());
        }
        
        CustomerEntity updated = repository.save(entity);
        return convertToBean(updated);
    }

    @Override
    public CustomerBean getCustomerById(String id) {
        CustomerEntity entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));
        return convertToBean(entity);
    }

    @Override
    public List<CustomerBean> getAllCustomers() {
        return repository.findAll().stream()
                .map(this::convertToBean)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteCustomer(String id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Customer not found with ID: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    public List<CustomerBean> filterLedger(List<FilterCriteriaBean> filters, int limit) {
        try {
            @SuppressWarnings("unchecked")
            List<CustomerEntity> entities = (List<CustomerEntity>) filterCriteriaService
                    .getListOfFilteredData(CustomerEntity.class, filters, limit);

            return entities.stream()
                    .map(this::convertToBean)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            throw new RuntimeException("Error filtering customers: " + e.getMessage(), e);
        }
    }

    // Validation helper
    private void validateRequiredFields(CustomerBean bean) {
        if (bean.getCustomerCode() == null || bean.getCustomerCode().isEmpty()) {
            throw new IllegalArgumentException("Customer code is required");
        }
        if (bean.getBusinessName() == null || bean.getBusinessName().isEmpty()) {
            throw new IllegalArgumentException("Business name is required");
        }
    }

    private CustomerBean convertToBean(CustomerEntity entity) {
        if (entity == null) {
            return null;
        }

        CustomerBean bean = new CustomerBean();
        bean.setId(entity.getId());
        bean.setCustomerCode(entity.getCustomerCode());
        bean.setBusinessName(entity.getBusinessName());
        bean.setGstin(entity.getGstin());
        bean.setPan(entity.getPan());
        bean.setContactPerson(entity.getContactPerson());
        bean.setCreditDays(entity.getCreditDays());
        bean.setMobile(entity.getMobile());
        bean.setEmail(entity.getEmail());
        bean.setAddress(entity.getAddress());
        bean.setCity(entity.getCity());
        bean.setState(entity.getState());
        bean.setCurrentOutstanding(entity.getCurrentOutstanding());
        bean.setStatus(entity.getStatus());
        bean.setCreatedAt(entity.getCreatedAt());
        bean.setUpdatedAt(entity.getUpdatedAt());

        return bean;
    }
}