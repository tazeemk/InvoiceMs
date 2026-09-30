package com.ims.invoiceItems.service;

import com.ims.filter.criteria.bean.FilterCriteriaBean;
import com.ims.invoiceItems.bean.InvoiceItemsBean;
import java.util.List;

public interface InvoiceItemsService {
    InvoiceItemsBean createInvoiceItem(InvoiceItemsBean itemBean);
    InvoiceItemsBean updateInvoiceItem(String id, InvoiceItemsBean itemBean);
    void deleteInvoiceItem(String id);
    InvoiceItemsBean getInvoiceItemById(String id);
    List<InvoiceItemsBean> getAllInvoiceItems();
    List<InvoiceItemsBean> getInvoiceItemsByInvoiceId(String invoiceId);
    void deleteInvoiceItemsByInvoiceId(String invoiceId);
	List<InvoiceItemsBean> filtergetAllItems(List<FilterCriteriaBean> filters, int limit);
}