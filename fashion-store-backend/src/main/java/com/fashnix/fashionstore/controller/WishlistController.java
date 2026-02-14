package com.fashnix.fashionstore.controller;

import com.fashnix.fashionstore.model.Wishlist;
import com.fashnix.fashionstore.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "http://localhost:4200")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Wishlist>> getWishlist(@PathVariable Long userId) {
        return ResponseEntity.ok(wishlistService.getWishlist(userId));
    }

    @PostMapping("/{userId}/add")
    public ResponseEntity<?> addToWishlist(@PathVariable Long userId, @RequestBody Long productId) {
        wishlistService.addToWishlist(userId, productId);
        return ResponseEntity.ok("Added to wishlist");
    }

    @DeleteMapping("/{userId}/remove/{productId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long userId, @PathVariable Long productId) {
        wishlistService.removeFromWishlist(userId, productId);
        return ResponseEntity.ok("Removed from wishlist");
    }
}
