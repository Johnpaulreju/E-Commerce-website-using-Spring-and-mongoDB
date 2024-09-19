package com.example.ecommerce.model;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "purchasedItems")
public class PurchasedItem {

    @Id
    private String id;
    private String userId;
    private String productId;
    private String name;
    private double price;
    private int quantity;
    private LocalDate purchaseDate;

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public LocalDate getpurchaseDate() {
        return purchaseDate;
    }

    public void setpurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }
}
