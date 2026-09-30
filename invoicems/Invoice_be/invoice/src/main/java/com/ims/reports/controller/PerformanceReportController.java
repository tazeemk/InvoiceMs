package com.ims.reports.controller;

import com.ims.reports.bean.PerformanceReportBean;
import com.ims.reports.entity.PerformanceReportEntity;
import com.ims.reports.service.PerformanceReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports/performance")
@CrossOrigin(origins = "*")
public class PerformanceReportController {

    @Autowired
    private PerformanceReportService performanceReportService;

    @GetMapping
    public ResponseEntity<PerformanceReportBean> getPerformanceReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            PerformanceReportBean report = performanceReportService.generatePerformanceReport(startDate, endDate);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<PerformanceReportBean> getPerformanceReportByUser(
            @PathVariable String userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            PerformanceReportBean report = performanceReportService.generatePerformanceReportByUser(userId, startDate, endDate);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<PerformanceReportBean> getPerformanceReportByCustomer(
            @PathVariable String customerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            PerformanceReportBean report = performanceReportService.generatePerformanceReportByCustomer(customerId, startDate, endDate);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/save")
    public ResponseEntity<PerformanceReportEntity> saveReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam String reportName,
            @RequestParam String reportType,
            @RequestParam String generatedBy) {
        try {
            PerformanceReportBean report = performanceReportService.generatePerformanceReport(startDate, endDate);
            PerformanceReportEntity savedReport = performanceReportService.saveReport(report, reportName, reportType, generatedBy);
            return ResponseEntity.ok(savedReport);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/saved")
    public ResponseEntity<List<PerformanceReportEntity>> getSavedReports() {
        try {
            List<PerformanceReportEntity> reports = performanceReportService.getSavedReports();
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/saved/{id}")
    public ResponseEntity<PerformanceReportEntity> getSavedReportById(@PathVariable String id) {
        try {
            PerformanceReportEntity report = performanceReportService.getSavedReportById(id);
            if (report != null) {
                return ResponseEntity.ok(report);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
