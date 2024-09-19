package com.example.ecommerce.repository;

import com.example.ecommerce.model.PurchasedItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PurchasedItemRepository extends MongoRepository<PurchasedItem, String> {
    List<PurchasedItem> findByUserId(String userId); // Find purchased items by user
}
