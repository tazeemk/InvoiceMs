package com.ims.receipt.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ims.receipt.entity.ReceiptEntity;

@Repository
public interface ReceiptRepository extends JpaRepository<ReceiptEntity, String> {

    Optional<ReceiptEntity> findByReceiptNo(String receiptNo);

    List<ReceiptEntity> findByReceiptDateBetween(LocalDate startDate, LocalDate endDate);
}