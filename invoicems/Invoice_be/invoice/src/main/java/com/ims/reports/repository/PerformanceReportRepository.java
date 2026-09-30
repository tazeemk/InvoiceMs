package com.ims.reports.repository;

import com.ims.reports.entity.PerformanceReportEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PerformanceReportRepository extends JpaRepository<PerformanceReportEntity, String> {
    List<PerformanceReportEntity> findByReportType(String reportType);
    List<PerformanceReportEntity> findByGeneratedBy(String generatedBy);
    List<PerformanceReportEntity> findByStartDateAndEndDate(LocalDate startDate, LocalDate endDate);
    List<PerformanceReportEntity> findByFilterUserId(String filterUserId);
    List<PerformanceReportEntity> findByFilterCustomerId(String filterCustomerId);
}
