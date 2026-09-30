package com.ims.invoices.service;

import com.ims.filter.criteria.bean.FilterCriteriaBean;
import com.ims.invoices.bean.InvoicesBean;
import java.time.LocalDate;
import java.util.List;

public interface InvoicesService {
    InvoicesBean createInvoice(InvoicesBean invoiceBean);
    InvoicesBean updateInvoice(String id, InvoicesBean invoiceBean);
    void deleteInvoice(String id);
    InvoicesBean getInvoiceById(String id);
    InvoicesBean getInvoiceByInvoiceNo(String invoiceNo);
    List<InvoicesBean> getAllInvoices();
    List<InvoicesBean> getInvoicesByCustomerId(String customerId);
    List<InvoicesBean> getInvoicesByStatus(String status);
    List<InvoicesBean> getInvoicesByDateRange(LocalDate startDate, LocalDate endDate);
    InvoicesBean syncToTally(String id, String tallyVoucherNo);
	List<InvoicesBean> getAllInvoicesFilter(List<FilterCriteriaBean> filters, int limit);
	InvoicesBean assignInvoiceToUser(String id, String assignUserId);
	InvoicesBean updateInvoiceByCollection(String id, InvoicesBean invoiceBean);
	InvoicesBean updateInvoiceStatus(String id, String status);
}