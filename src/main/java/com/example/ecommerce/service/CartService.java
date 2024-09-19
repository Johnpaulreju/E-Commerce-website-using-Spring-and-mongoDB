package com.example.ecommerce.service;

import com.example.ecommerce.model.CartItem;
import com.example.ecommerce.model.PurchasedItem;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.CartRepository;
import com.example.ecommerce.repository.PurchasedItemRepository;
import com.example.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PurchasedItemRepository purchasedItemRepository;

    // Add a product to the cart
    public String addToCart(String userId, String productId, int quantity) {
        if (quantity <= 0) {
            return "Invalid quantity";
        }

        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            return "Product not found";
        }

        Product product = productOpt.get();
        List<CartItem> cartItems = cartRepository.findByUserId(userId);
        CartItem existingCartItem = cartItems.stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existingCartItem != null) {
            existingCartItem.setQuantity(existingCartItem.getQuantity() + quantity);
            cartRepository.save(existingCartItem);
        } else {
            CartItem newCartItem = new CartItem();
            newCartItem.setUserId(userId);
            newCartItem.setProductId(product.getId());
            newCartItem.setName(product.getName());
            newCartItem.setPrice(product.getPrice());
            newCartItem.setQuantity(quantity); // Store the quantity passed
            cartRepository.save(newCartItem);
        }

        return "Product added to cart";
    }

    // Remove a product from the cart
    public String removeCartItem(String userId, String productId) {
        List<CartItem> cartItems = cartRepository.findByUserId(userId);
        CartItem cartItem = cartItems.stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst()
                .orElse(null);

        if (cartItem != null) {
            cartRepository.delete(cartItem); // Remove the item from the cart
            return "Item removed from cart";
        }

        return "Item not found in cart";
    }

    // Get all cart items for a user where bought is false
    public List<CartItem> getUnboughtCartItems(String userId) {
        return cartRepository.findByUserIdAndBoughtFalse(userId);
    }

    // Calculate the total price of items in the cart
    public double calculateTotalPrice(String userId) {
        List<CartItem> cartItems = cartRepository.findByUserIdAndBoughtFalse(userId); // Only fetch unbought items
        return cartItems.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }

    // Update the quantity of a product in the cart
    public String updateCartQuantity(String userId, String productId, int newQuantity) {
        List<CartItem> cartItems = cartRepository.findByUserId(userId);
        CartItem cartItem = cartItems.stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst()
                .orElse(null);

        if (cartItem != null) {
            if (newQuantity <= 0) {
                cartRepository.delete(cartItem); // Remove the item if quantity is 0
            } else {
                cartItem.setQuantity(newQuantity); // Set the new quantity, don't add to it
                cartRepository.save(cartItem); // Update the quantity in the database
            }
            return "Quantity updated";
        }

        return "Product not found in cart";
    }

    // Checkout method
    public void checkout(String userId) {
        List<CartItem> cartItems = cartRepository.findByUserIdAndBoughtFalse(userId);
        for (CartItem cartItem : cartItems) {
            // Mark the cart item as bought
            cartItem.setBought(true);
            cartRepository.save(cartItem);

            // Add to the purchased items collection
            PurchasedItem purchasedItem = new PurchasedItem();
            purchasedItem.setUserId(userId);
            purchasedItem.setProductId(cartItem.getProductId());
            purchasedItem.setName(cartItem.getName());
            purchasedItem.setPrice(cartItem.getPrice());
            purchasedItem.setQuantity(cartItem.getQuantity());
            purchasedItem.setpurchaseDate(LocalDate.now());
            purchasedItemRepository.save(purchasedItem); // Save to the PurchasedItemRepository
        }
    }
}
