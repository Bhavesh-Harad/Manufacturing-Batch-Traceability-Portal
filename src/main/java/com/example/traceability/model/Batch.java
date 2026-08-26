package com.example.traceability.model;

public class Batch {
    private String id;
    private String productName;
    private int quantity;
    private String status;

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
}
