package com.example.ecommerce.controller;

import com.example.ecommerce.model.CartItem;
import com.example.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CartController {

    @Autowired
    private CartService cartService;

    // Add a product to the cart
    @PostMapping("/cart")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> payload) {
        String userId = (String) payload.get("userId");
        String productId = (String) payload.get("productId");
        int quantity = (int) payload.get("quantity");

        String message = cartService.addToCart(userId, productId, quantity);
        return ResponseEntity.ok(Map.of("success", true, "message", message));
    }

    // Get all cart items for a user
    @GetMapping("/cart")
    public ResponseEntity<?> getCartItems(@RequestParam String userId) {
        List<CartItem> cartItems = cartService.getUnboughtCartItems(userId);
        if (!cartItems.isEmpty()) {
            double totalPrice = cartService.calculateTotalPrice(userId);
            return ResponseEntity.ok(Map.of("cartItems", cartItems, "totalPrice", totalPrice));
        } else {
            return ResponseEntity.status(404).body("Cart is empty");
        }
    }

    // Update the quantity of a product in the cart
    // @PostMapping("/cart/update-quantity")
    // public ResponseEntity<?> updateCartQuantity(@RequestBody Map<String, Object>
    // payload) {
    // String userId = (String) payload.get("userId");
    // String productId = (String) payload.get("productId");
    // int change = (int) payload.get("change");

    // String message = cartService.updateCartQuantity(userId, productId, change);
    // return ResponseEntity.ok(Map.of("success", true, "message", message));
    // }
    @PostMapping("/cart/remove-item")
    public ResponseEntity<?> removeCartItem(@RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        String productId = payload.get("productId");

        String message = cartService.removeCartItem(userId, productId);
        return ResponseEntity.ok(Map.of("success", true, "message", message));
    }

    @PostMapping("/cart/checkout")
    public ResponseEntity<?> checkout(@RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "Required parameter 'userId' is not present"));
        }

        cartService.checkout(userId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Checkout completed"));
    }

    @PostMapping("/cart/update-quantity")
    public ResponseEntity<?> updateCartQuantity(@RequestBody Map<String, Object> payload) {
        try {
            String userId = (String) payload.get("userId");
            String productId = (String) payload.get("productId");
            int quantity = (int) payload.get("quantity"); // Quantity sent from frontend

            if (userId == null || productId == null || quantity < 1) {
                throw new IllegalArgumentException("Invalid request payload");
            }

            String message = cartService.updateCartQuantity(userId, productId, quantity);
            return ResponseEntity.ok(Map.of("success", true, "message", message));
        } catch (Exception e) {
            // Log the error to see what's wrong
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("success", false, "message", "Server Error: " + e.getMessage()));
        }
    }

}
