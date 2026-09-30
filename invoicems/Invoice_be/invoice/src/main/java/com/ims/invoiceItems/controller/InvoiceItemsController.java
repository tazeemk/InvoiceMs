package com.ims.invoiceItems.controller;

import com.ims.filter.criteria.bean.FilterRequest;
import com.ims.invoiceItems.bean.InvoiceItemsBean;
import com.ims.invoiceItems.service.InvoiceItemsService;
import com.ims.user.bean.UserBean;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/invoiceItems")
public class InvoiceItemsController {

    @Autowired
    private InvoiceItemsService invoiceItemsService;

    @PostMapping(value = "/createItem")
    public ResponseEntity<InvoiceItemsBean> createInvoiceItem(@RequestBody InvoiceItemsBean itemBean) {
        try {
            InvoiceItemsBean created = invoiceItemsService.createInvoiceItem(itemBean);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping(value = "/updateItem/{id}")
    public ResponseEntity<InvoiceItemsBean> updateInvoiceItem(
            @PathVariable String id,
            @RequestBody InvoiceItemsBean itemBean) {
        try {
            InvoiceItemsBean updated = invoiceItemsService.updateInvoiceItem(id, itemBean);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping(value = "/deleteItem/{id}")
    public ResponseEntity<String> deleteInvoiceItem(@PathVariable String id) {
        try {
            invoiceItemsService.deleteInvoiceItem(id);
            return ResponseEntity.ok("Invoice item deleted successfully with ID: " + id);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Invoice item not found with ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting invoice item");
        }
    }

    @GetMapping(value = "/getItemById/{id}")
    public ResponseEntity<InvoiceItemsBean> getInvoiceItemById(@PathVariable String id) {
        try {
            InvoiceItemsBean item = invoiceItemsService.getInvoiceItemById(id);
            return ResponseEntity.ok(item);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(value = "/getAllItems")
    public ResponseEntity<List<InvoiceItemsBean>> getAllInvoiceItems() {
        try {
            List<InvoiceItemsBean> items = invoiceItemsService.getAllInvoiceItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/filtergetAllItems")
    public ResponseEntity<List<InvoiceItemsBean>> filtergetAllItems(@RequestBody FilterRequest request) {
        try {
            int limit = request.getLimit() != null ? request.getLimit() : 100; // default to 100
            List<InvoiceItemsBean> filter = invoiceItemsService.filtergetAllItems(request.getFilters(), limit);
            return ResponseEntity.ok(filter);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping(value = "/getItemsByInvoiceId/{invoiceId}")
    public ResponseEntity<List<InvoiceItemsBean>> getInvoiceItemsByInvoiceId(@PathVariable String invoiceId) {
        try {
            List<InvoiceItemsBean> items = invoiceItemsService.getInvoiceItemsByInvoiceId(invoiceId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping(value = "/deleteItemsByInvoiceId/{invoiceId}")
    public ResponseEntity<String> deleteInvoiceItemsByInvoiceId(@PathVariable String invoiceId) {
        try {
            invoiceItemsService.deleteInvoiceItemsByInvoiceId(invoiceId);
            return ResponseEntity.ok("All items deleted for invoice ID: " + invoiceId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting invoice items");
        }
    }
    
}