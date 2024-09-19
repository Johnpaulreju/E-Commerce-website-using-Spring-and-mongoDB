package com.example.ecommerce.service;

import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Fetch all products from the MongoDB database
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Save a product to the MongoDB database
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
}
