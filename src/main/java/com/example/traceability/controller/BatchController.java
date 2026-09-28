package com.example.traceability.controller;

import com.example.traceability.model.Batch;
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
    
    private List<Batch> batches = new ArrayList<>();

    private String getCurrentTime() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    @PostMapping
    public Batch createBatch(@RequestBody Batch batch) {
        batch.setId(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        batch.setStatus("CREATED");
        batch.addAuditLog(getCurrentTime() + " - System: Batch Registered successfully.");
        batches.add(batch);
        return batch;
    }

    @PostMapping("/bulk")
    public List<Batch> createBatchesBulk(@RequestBody List<Batch> newBatches) {
        for (Batch batch : newBatches) {
            batch.setId(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
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
        return batches.stream().filter(b -> b.getId().equals(id)).findFirst().orElse(null);
    }

    @PutMapping("/{id}/status")
    public Batch updateBatchStatus(@PathVariable String id, @RequestParam String status) {
        Batch batch = getBatchById(id);
        if (batch != null) {
            batch.setStatus(status);
            batch.addAuditLog(getCurrentTime() + " - Operator: Status transitioned to " + status + ".");
        }
        return batch;
    }

    @GetMapping("/search")
    public List<Batch> searchBatches(@RequestParam String keyword) {
        return batches.stream()
                .filter(b -> b.getProductName().contains(keyword) || b.getId().contains(keyword))
                .collect(Collectors.toList());
    }

    // Dashboard summary MVP functionality added here.
    // Hotfix added directly to development branch
}
