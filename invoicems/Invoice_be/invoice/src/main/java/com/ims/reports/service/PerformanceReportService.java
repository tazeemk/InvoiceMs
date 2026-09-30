package com.ims.reports.service;

import com.ims.reports.bean.PerformanceReportBean;
import com.ims.reports.entity.PerformanceReportEntity;
import java.time.LocalDate;
import java.util.List;

public interface PerformanceReportService {
    PerformanceReportBean generatePerformanceReport(LocalDate startDate, LocalDate endDate);
    PerformanceReportBean generatePerformanceReportByUser(String userId, LocalDate startDate, LocalDate endDate);
    PerformanceReportBean generatePerformanceReportByCustomer(String customerId, LocalDate startDate, LocalDate endDate);
    PerformanceReportEntity saveReport(PerformanceReportBean reportBean, String reportName, String reportType, String generatedBy);
    List<PerformanceReportEntity> getSavedReports();
    PerformanceReportEntity getSavedReportById(String id);
}
