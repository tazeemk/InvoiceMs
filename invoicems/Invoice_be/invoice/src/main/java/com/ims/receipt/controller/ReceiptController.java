package com.ims.receipt.controller;

import com.ims.filter.criteria.bean.FilterRequest;
import com.ims.invoices.bean.InvoicesBean;
import com.ims.receipt.bean.ReceiptBean;
import com.ims.receipt.service.ReceiptService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/receipts")
public class ReceiptController {

    @Autowired
    private ReceiptService receiptService;

    @PostMapping(value = "/createReceipt")
    public ResponseEntity<ReceiptBean> createReceipt(@RequestBody ReceiptBean receiptBean) {
        try {
            ReceiptBean created = receiptService.createReceipt(receiptBean);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping(value = "/updateReceipt/{id}")
    public ResponseEntity<ReceiptBean> updateReceipt(
            @PathVariable String id,
            @RequestBody ReceiptBean receiptBean) {
        try {
            ReceiptBean updated = receiptService.updateReceipt(id, receiptBean);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping(value = "/deleteReceipt/{id}")
    public ResponseEntity<String> deleteReceipt(@PathVariable String id) {
        try {
            receiptService.deleteReceipt(id);
            return ResponseEntity.ok("Receipt deleted successfully with ID: " + id);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Receipt not found with ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting receipt");
        }
    }

    @GetMapping(value = "/getReceiptById/{id}")
    public ResponseEntity<ReceiptBean> getReceiptById(@PathVariable String id) {
        try {
            ReceiptBean receipt = receiptService.getReceiptById(id);
            return ResponseEntity.ok(receipt);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(value = "/getReceiptByReceiptNo/{receiptNo}")
    public ResponseEntity<ReceiptBean> getReceiptByReceiptNo(@PathVariable String receiptNo) {
        try {
            ReceiptBean receipt = receiptService.getReceiptByReceiptNo(receiptNo);
            return ResponseEntity.ok(receipt);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(value = "/getAllReceipts")
    public ResponseEntity<List<ReceiptBean>> getAllReceipts() {
        try {
            List<ReceiptBean> receipts = receiptService.getAllReceipts();
            return ResponseEntity.ok(receipts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(value = "/getReceiptsByDateRange")
    public ResponseEntity<List<ReceiptBean>> getReceiptsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<ReceiptBean> receipts = receiptService.getReceiptsByDateRange(startDate, endDate);
            return ResponseEntity.ok(receipts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/getAllReceiptsFilter")
    public ResponseEntity<List<ReceiptBean>> getAllReceiptsFilter(@RequestBody FilterRequest request) {
        try {
            int limit = request.getLimit() != null ? request.getLimit() : 100; // default to 100
            List<ReceiptBean> filter = receiptService.getAllReceiptsFilter(request.getFilters(), limit);
            return ResponseEntity.ok(filter);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

}