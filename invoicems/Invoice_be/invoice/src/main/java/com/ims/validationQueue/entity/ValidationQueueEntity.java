package com.ims.validationQueue.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "validation_queue")
public class ValidationQueueEntity {

    @Id
    @Column(length = 20)
    private String id;

    @NotNull
    @Column(name = "collection_id", length = 20, nullable = false)
    private String collectionId;

    @NotNull
    @Column(name = "submitted_by", length = 255, nullable = false)
    private String submittedBy;

    @NotNull
    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @Column(name = "validated_by", length = 255)
    private String validatedBy;

    @Column(name = "validated_at")
    private LocalDateTime validatedAt;

    @Column(name = "validation_status", length = 20)
    private String validationStatus = "PENDING"; // PENDING, APPROVED, REJECTED

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(columnDefinition = "TEXT")
    private String remarks;

	public ValidationQueueEntity() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ValidationQueueEntity(String id, @NotNull String collectionId, @NotNull String submittedBy,
			@NotNull LocalDateTime submittedAt, String validatedBy, LocalDateTime validatedAt, String validationStatus,
			String rejectionReason, String remarks) {
		super();
		this.id = id;
		this.collectionId = collectionId;
		this.submittedBy = submittedBy;
		this.submittedAt = submittedAt;
		this.validatedBy = validatedBy;
		this.validatedAt = validatedAt;
		this.validationStatus = validationStatus;
		this.rejectionReason = rejectionReason;
		this.remarks = remarks;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCollectionId() {
		return collectionId;
	}

	public void setCollectionId(String collectionId) {
		this.collectionId = collectionId;
	}

	public String getSubmittedBy() {
		return submittedBy;
	}

	public void setSubmittedBy(String submittedBy) {
		this.submittedBy = submittedBy;
	}

	public LocalDateTime getSubmittedAt() {
		return submittedAt;
	}

	public void setSubmittedAt(LocalDateTime submittedAt) {
		this.submittedAt = submittedAt;
	}

	public String getValidatedBy() {
		return validatedBy;
	}

	public void setValidatedBy(String validatedBy) {
		this.validatedBy = validatedBy;
	}

	public LocalDateTime getValidatedAt() {
		return validatedAt;
	}

	public void setValidatedAt(LocalDateTime validatedAt) {
		this.validatedAt = validatedAt;
	}

	public String getValidationStatus() {
		return validationStatus;
	}

	public void setValidationStatus(String validationStatus) {
		this.validationStatus = validationStatus;
	}

	public String getRejectionReason() {
		return rejectionReason;
	}

	public void setRejectionReason(String rejectionReason) {
		this.rejectionReason = rejectionReason;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
    
    
    
}