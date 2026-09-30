package com.ims.customer.service;

import java.util.List;

import com.ims.customer.bean.CustomerBean;
import com.ims.filter.criteria.bean.FilterCriteriaBean;

public interface CustomerService {

	CustomerBean createCustomer(CustomerBean bean);

	CustomerBean updateCustomer(String id, CustomerBean bean);

	CustomerBean getCustomerById(String id);

	List<CustomerBean> getAllCustomers();

	void deleteCustomer(String id);

	List<CustomerBean> filterLedger(List<FilterCriteriaBean> filters, int limit);

}
