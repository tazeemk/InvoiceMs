package com.ims.invoices.repository;

import com.ims.invoices.entity.InvoicesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoicesRepository extends JpaRepository<InvoicesEntity, String>, 
        JpaSpecificationExecutor<InvoicesEntity> {
    Optional<InvoicesEntity> findByInvoiceNo(String invoiceNo);
    List<InvoicesEntity> findByCustomerId(String customerId);
    List<InvoicesEntity> findByStatus(String status);
    List<InvoicesEntity> findByInvoiceDateBetween(LocalDate startDate, LocalDate endDate);
    List<InvoicesEntity> findByCustomerIdAndStatus(String customerId, String status);
}