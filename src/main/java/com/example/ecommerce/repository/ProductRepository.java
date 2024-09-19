package com.example.ecommerce.repository;

import com.example.ecommerce.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

// Repository for handling CRUD operations on Product collection
@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
}
