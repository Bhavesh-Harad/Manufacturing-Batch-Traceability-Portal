package com.example.traceability.controller;

import com.example.traceability.model.Batch;
import jakarta.annotation.PostConstruct;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/batches")
public class BatchController {
    
    private final List<Batch> batches = new ArrayList<>();

    private String getCurrentTime() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    @PostConstruct
    public void seedInitialBatches() {
        if (batches.isEmpty()) {
            Batch b1 = new Batch("B-9842", "Paracetamol 500mg USP Tablets", 12500);
            b1.setStatus("APPROVED");
            b1.setManufacturingUnit("Cleanroom Facility Line A (ISO-7)");
            b1.setQualityScore("99.8% (Pharmacopeia Grade)");
            b1.setInspector("Dr. A. Sharma (QA Lead)");
            b1.addAuditLog(getCurrentTime() + " - System: Batch Registered.");
            b1.addAuditLog(getCurrentTime() + " - Production: Synthesis & Tableting Completed.");
            b1.addAuditLog(getCurrentTime() + " - QA: Final Release Approved (CoA Verified).");
            batches.add(b1);

            Batch b2 = new Batch("B-7319", "Amoxicillin 250mg Oral Suspension", 8000);
            b2.setStatus("QA_REVIEW");
            b2.setManufacturingUnit("Cleanroom Facility Line B (Sterile Bay)");
            b2.setQualityScore("98.9% (Bio-Assay Pending)");
            b2.setInspector("M. Rodriguez (Lead Analyst)");
            b2.addAuditLog(getCurrentTime() + " - System: Batch Registered.");
            b2.addAuditLog(getCurrentTime() + " - Production: Suspension Blending Complete.");
            b2.addAuditLog(getCurrentTime() + " - QA: Under Analytical Review.");
            batches.add(b2);

            Batch b3 = new Batch("B-5501", "Precision Titanium Fasteners Grade-5", 3500);
            b3.setStatus("IN_PRODUCTION");
            b3.setManufacturingUnit("Precision CNC Machine Cell 4");
            b3.setQualityScore("99.4% (Tensile Yield Verified)");
            b3.setInspector("K. Patel (Materials Inspector)");
            b3.addAuditLog(getCurrentTime() + " - System: Batch Registered.");
            b3.addAuditLog(getCurrentTime() + " - Production: CNC Lathing & Passivation in progress.");
            batches.add(b3);
        }
    }

    @PostMapping
    public Batch createBatch(@RequestBody Batch batch) {
        if (batch.getId() == null || batch.getId().trim().isEmpty()) {
            batch.setId("B-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase());
        }
        batch.setStatus("CREATED");
        batch.addAuditLog(getCurrentTime() + " - System: Batch Registered successfully.");
        batches.add(batch);
        return batch;
    }

    @PostMapping("/bulk")
    public List<Batch> createBatchesBulk(@RequestBody List<Batch> newBatches) {
        for (Batch batch : newBatches) {
            if (batch.getId() == null || batch.getId().trim().isEmpty()) {
                batch.setId("B-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase());
            }
            batch.setStatus("CREATED");
            batch.addAuditLog(getCurrentTime() + " - System: Batch bulk imported from CSV.");
            batches.add(batch);
        }
        return batches;
    }

    @GetMapping
    public List<Batch> getAllBatches() {
        return batches;
    }

    @GetMapping("/{id}")
    public Batch getBatchById(@PathVariable String id) {
        return batches.stream().filter(b -> b.getId().equalsIgnoreCase(id)).findFirst().orElse(null);
    }

    @PutMapping("/{id}/status")
    public Batch updateBatchStatus(@PathVariable String id, @RequestParam String status) {
        Batch batch = getBatchById(id);
        if (batch != null) {
            batch.setStatus(status);
            if ("RECALLED".equalsIgnoreCase(status)) {
                batch.setRecalled(true);
            }
            batch.addAuditLog(getCurrentTime() + " - Operator: Status transitioned to " + status + ".");
        }
        return batch;
    }

    @PutMapping("/{id}/recall")
    public Batch triggerRecall(@PathVariable String id, @RequestParam(defaultValue = "Suspected deviation in cold-chain logistics") String reason) {
        Batch batch = getBatchById(id);
        if (batch != null) {
            batch.setRecalled(true);
            batch.setStatus("RECALLED");
            batch.setRecallReason(reason);
            batch.addAuditLog(getCurrentTime() + " - 🚨 QUALITY ASSURANCE EMERGENCY: Batch quarantined. Reason: " + reason);
        }
        return batch;
    }

    @GetMapping("/search")
    public List<Batch> searchBatches(@RequestParam String keyword) {
        String lower = keyword.toLowerCase();
        return batches.stream()
                .filter(b -> b.getProductName().toLowerCase().contains(lower) 
                          || b.getId().toLowerCase().contains(lower)
                          || (b.getManufacturingUnit() != null && b.getManufacturingUnit().toLowerCase().contains(lower)))
                .collect(Collectors.toList());
    }

    @DeleteMapping("/{id}")
    public boolean deleteBatch(@PathVariable String id) {
        return batches.removeIf(b -> b.getId().equalsIgnoreCase(id));
    }
}
