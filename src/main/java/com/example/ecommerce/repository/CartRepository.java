package com.example.ecommerce.repository;

import com.example.ecommerce.model.CartItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CartRepository extends MongoRepository<CartItem, String> {
    List<CartItem> findByUserIdAndBoughtFalse(String userId); // Find unbought items

    List<CartItem> findByUserId(String userId); // Find all cart items
}
