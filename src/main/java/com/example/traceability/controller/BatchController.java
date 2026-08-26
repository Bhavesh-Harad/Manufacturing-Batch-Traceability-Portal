package com.example.traceability.controller;

import com.example.traceability.model.Batch;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/batches")
public class BatchController {
    
    private List<Batch> batches = new ArrayList<>();

    @PostMapping
    public Batch createBatch(@RequestBody Batch batch) {
        batch.setId(UUID.randomUUID().toString());
        batch.setStatus("CREATED");
        batches.add(batch);
        return batch;
    }
}
