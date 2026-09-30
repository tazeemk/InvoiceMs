package com.ims.invoices.controller;

import com.ims.filter.criteria.bean.FilterRequest;
import com.ims.invoices.bean.InvoicesBean;
import com.ims.invoices.service.InvoicesService;
import com.ims.user.bean.UserBean;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/invoices")
public class InvoicesController {

    @Autowired
    private InvoicesService invoicesService;

    @PostMapping(value = "/createInvoice")
    public ResponseEntity<InvoicesBean> createInvoice(@RequestBody InvoicesBean invoiceBean) {
        try {
            InvoicesBean created = invoicesService.createInvoice(invoiceBean);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping(value = "/updateInvoice/{id}")
    public ResponseEntity<InvoicesBean> updateInvoice(
            @PathVariable String id,
            @RequestBody InvoicesBean invoiceBean) {
        try {
            InvoicesBean updated = invoicesService.updateInvoice(id, invoiceBean);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping(value = "/deleteInvoice/{id}")
    public ResponseEntity<String> deleteInvoice(@PathVariable String id) {
        try {
            invoicesService.deleteInvoice(id);
            return ResponseEntity.ok("Invoice deleted successfully with ID: " + id);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Invoice not found with ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting invoice");
        }
    }

    @GetMapping(value = "/getInvoiceById/{id}")
    public ResponseEntity<InvoicesBean> getInvoiceById(@PathVariable String id) {
        try {
            InvoicesBean invoice = invoicesService.getInvoiceById(id);
            return ResponseEntity.ok(invoice);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(value = "/getInvoiceByInvoiceNo/{invoiceNo}")
    public ResponseEntity<InvoicesBean> getInvoiceByInvoiceNo(@PathVariable String invoiceNo) {
        try {
            InvoicesBean invoice = invoicesService.getInvoiceByInvoiceNo(invoiceNo);
            return ResponseEntity.ok(invoice);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(value = "/getAllInvoices")
    public ResponseEntity<List<InvoicesBean>> getAllInvoices() {
        try {
            List<InvoicesBean> invoices = invoicesService.getAllInvoices();
            return ResponseEntity.ok(invoices);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/getAllInvoicesFilter")
    public ResponseEntity<List<InvoicesBean>> getAllInvoicesFilter(@RequestBody FilterRequest request) {
        try {
            int limit = request.getLimit() != null ? request.getLimit() : 100; // default to 100
            List<InvoicesBean> filter = invoicesService.getAllInvoicesFilter(request.getFilters(), limit);
            return ResponseEntity.ok(filter);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping(value = "/getInvoicesByCustomerId/{customerId}")
    public ResponseEntity<List<InvoicesBean>> getInvoicesByCustomerId(@PathVariable String customerId) {
        try {
            List<InvoicesBean> invoices = invoicesService.getInvoicesByCustomerId(customerId);
            return ResponseEntity.ok(invoices);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(value = "/getInvoicesByStatus/{status}")
    public ResponseEntity<List<InvoicesBean>> getInvoicesByStatus(@PathVariable String status) {
        try {
            List<InvoicesBean> invoices = invoicesService.getInvoicesByStatus(status);
            return ResponseEntity.ok(invoices);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(value = "/getInvoicesByDateRange")
    public ResponseEntity<List<InvoicesBean>> getInvoicesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<InvoicesBean> invoices = invoicesService.getInvoicesByDateRange(startDate, endDate);
            return ResponseEntity.ok(invoices);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



    @PutMapping("/assignInvoiceToUser/{id}/{assignUserId}")
    public ResponseEntity<InvoicesBean> assignInvoiceToUser(
            @PathVariable String id,
            @PathVariable String assignUserId) {

        try {
            InvoicesBean updated = invoicesService.assignInvoiceToUser(id, assignUserId);
            return ResponseEntity.ok(updated);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PutMapping(value = "/updateInvoiceByCollection/{id}")
    public ResponseEntity<InvoicesBean> updateInvoiceByCollection(
            @PathVariable String id,
            @RequestBody InvoicesBean invoiceBean) {
        try {
            InvoicesBean updated = invoicesService.updateInvoiceByCollection(id, invoiceBean);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PutMapping(value = "/updateInvoiceStatus/{id}")
    public ResponseEntity<InvoicesBean> updateInvoiceStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {   // ← accepts { "status": "SUBMITTED" }
        try {
            String status = body.get("status");

            if (status == null || status.isBlank()) {
                return ResponseEntity.badRequest().build();   // 400 if status missing
            }

            InvoicesBean updated = invoicesService.updateInvoiceStatus(id, status);
            return ResponseEntity.ok(updated);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();        // 404
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500
        }
    }
    
}