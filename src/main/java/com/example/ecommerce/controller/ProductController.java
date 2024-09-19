package com.example.ecommerce.controller;

import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api") // All API routes will be prefixed with /api
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // Endpoint to fetch all products
    @GetMapping("/products")
    public ResponseEntity<?> getProducts() {
        List<Product> products = productRepository.findAll();

        // Create response by manually populating a HashMap for each product
        List<Map<String, Object>> response = products.stream().map(product -> {
            Map<String, Object> productMap = new HashMap<>();
            productMap.put("productId", product.getId());
            productMap.put("name", product.getName());
            productMap.put("description", product.getDescription());
            productMap.put("price", product.getPrice());
            return productMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
