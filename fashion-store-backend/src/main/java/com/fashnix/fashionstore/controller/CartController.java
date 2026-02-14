package com.fashnix.fashionstore.controller;

import com.fashnix.fashionstore.model.Cart;
import com.fashnix.fashionstore.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:4200")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartByUser(userId));
    }

    @PostMapping("/{userId}/add")
    public ResponseEntity<Cart> addToCart(@PathVariable Long userId, @RequestBody Map<String, Long> payload) {
        Long productId = payload.get("productId");
        return ResponseEntity.ok(cartService.addToCart(userId, productId));
    }

    @PostMapping("/{userId}/remove")
    public ResponseEntity<Cart> removeFromCart(@PathVariable Long userId, @RequestBody Map<String, Long> payload) {
        Long productId = payload.get("productId");
        return ResponseEntity.ok(cartService.removeFromCart(userId, productId));
    }
}
