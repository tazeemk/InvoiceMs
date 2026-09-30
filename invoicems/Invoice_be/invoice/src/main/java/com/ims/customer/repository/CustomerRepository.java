package com.ims.customer.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ims.customer.entity.CustomerEntity;

@Repository
public interface CustomerRepository extends JpaRepository<CustomerEntity, String> {
    // Find customer by customer code
    CustomerEntity findByCustomerCode(String customerCode);
    
    // Find customer by GSTIN
    CustomerEntity findByGstin(String gstin);
    
    // Find customer by mobile number
    CustomerEntity findByMobile(String mobile);
    
    // Find customer by email
    CustomerEntity findByEmail(String email);
    
    // Find customer by business name
    Optional<CustomerEntity> findByBusinessName(String businessName);
}
