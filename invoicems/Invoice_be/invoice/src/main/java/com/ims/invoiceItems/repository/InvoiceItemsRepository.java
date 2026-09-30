package com.ims.invoiceItems.repository;

import com.ims.invoiceItems.entity.InvoiceItemsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InvoiceItemsRepository extends JpaRepository<InvoiceItemsEntity, String> {
    List<InvoiceItemsEntity> findByInvoiceId(String invoiceId);
    void deleteByInvoiceId(String invoiceId);
}