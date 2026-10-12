package com.example.traceability.model;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class Batch {
    private String id;
    private String productName;
    private int quantity;
    private String status;
    private String manufacturingUnit = "Cleanroom Facility Line A";
    private String mfgDate = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
    private String expDate = LocalDate.now().plusYears(2).format(DateTimeFormatter.ISO_LOCAL_DATE);
    private String qualityScore = "99.4% (Compliant)";
    private String inspector = "Dr. A. Sharma (Lead QA)";
    private boolean recalled = false;
    private String recallReason = "";
    private List<String> auditLogs = new ArrayList<>();

    public Batch() {}

    public Batch(String id, String productName, int quantity) {
        this.id = id;
        this.productName = productName;
        this.quantity = quantity;
        this.status = "CREATED";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getManufacturingUnit() { return manufacturingUnit; }
    public void setManufacturingUnit(String manufacturingUnit) { this.manufacturingUnit = manufacturingUnit; }

    public String getMfgDate() { return mfgDate; }
    public void setMfgDate(String mfgDate) { this.mfgDate = mfgDate; }

    public String getExpDate() { return expDate; }
    public void setExpDate(String expDate) { this.expDate = expDate; }

    public String getQualityScore() { return qualityScore; }
    public void setQualityScore(String qualityScore) { this.qualityScore = qualityScore; }

    public String getInspector() { return inspector; }
    public void setInspector(String inspector) { this.inspector = inspector; }

    public boolean isRecalled() { return recalled; }
    public void setRecalled(boolean recalled) { this.recalled = recalled; }

    public String getRecallReason() { return recallReason; }
    public void setRecallReason(String recallReason) { this.recallReason = recallReason; }

    public List<String> getAuditLogs() { return auditLogs; }
    public void addAuditLog(String log) { this.auditLogs.add(log); }
}
