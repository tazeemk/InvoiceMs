package com.ims.customer.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.customer.bean.CustomerBean;
import com.ims.customer.service.CustomerService;
import com.ims.filter.criteria.bean.FilterRequest;


@RestController
@RequestMapping("/customers")
public class CustomerController {

	@Autowired
	private CustomerService service;

	@PostMapping("/createCustomer")
	public ResponseEntity<CustomerBean> createCustomer(@RequestBody CustomerBean bean) {
		CustomerBean customer = service.createCustomer(bean);
		return ResponseEntity.ok(customer);
	}

	@PutMapping("/updateCustomer/{id}")
	public ResponseEntity<CustomerBean> updateCustomer(@PathVariable String id, @RequestBody CustomerBean bean) {
		return ResponseEntity.ok(service.updateCustomer(id, bean));
	}

	@GetMapping("/getCustomerById/{id}")
	public ResponseEntity<CustomerBean> getCustomerById(@PathVariable String id) {
		return ResponseEntity.ok(service.getCustomerById(id));
	}

	@GetMapping("/getAllCustomers")
	public ResponseEntity<List<CustomerBean>> getAllCustomers() {
		return ResponseEntity.ok(service.getAllCustomers());
	}

	@DeleteMapping("/deleteCustomer/{id}")
	public ResponseEntity<String> deleteCustomer(@PathVariable String id) {
		service.deleteCustomer(id);
		return ResponseEntity.ok("Customer deleted successfully with ID: " + id);
	}
	
    @PostMapping("/filterCustomers")
    public ResponseEntity<List<CustomerBean>> filterCustomers(@RequestBody FilterRequest request) {
        try {
            int limit = request.getLimit() != null ? request.getLimit() : 100; 
            List<CustomerBean> ledgerList =
            		service.filterLedger(request.getFilters(), limit);

            return ResponseEntity.ok(ledgerList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}
