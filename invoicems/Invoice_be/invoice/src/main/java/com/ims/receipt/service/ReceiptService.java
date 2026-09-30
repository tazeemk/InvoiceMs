package com.ims.receipt.service;

import java.time.LocalDate;
import java.util.List;

import com.ims.filter.criteria.bean.FilterCriteriaBean;
import com.ims.receipt.bean.ReceiptBean;

public interface ReceiptService {

    ReceiptBean createReceipt(ReceiptBean bean);

    ReceiptBean updateReceipt(String id, ReceiptBean bean);

    void deleteReceipt(String id);

    ReceiptBean getReceiptById(String id);

    ReceiptBean getReceiptByReceiptNo(String receiptNo);

    List<ReceiptBean> getAllReceipts();

    List<ReceiptBean> getReceiptsByDateRange(LocalDate startDate, LocalDate endDate);

	List<ReceiptBean> getAllReceiptsFilter(List<FilterCriteriaBean> filters, int limit);
}