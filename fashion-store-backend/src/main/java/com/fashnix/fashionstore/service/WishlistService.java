package com.fashnix.fashionstore.service;

import com.fashnix.fashionstore.model.Product;
import com.fashnix.fashionstore.model.User;
import com.fashnix.fashionstore.model.Wishlist;
import com.fashnix.fashionstore.repository.ProductRepository;
import com.fashnix.fashionstore.repository.UserRepository;
import com.fashnix.fashionstore.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WishlistService {
    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Wishlist> getWishlist(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return wishlistRepository.findByUser(user);
    }

    @Transactional
    public void addToWishlist(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if already in wishlist
        if (wishlistRepository.findByUserAndProduct_Id(user, productId).isPresent()) {
            return; // Already added
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProduct(product);
        wishlistRepository.save(wishlist);
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        wishlistRepository.deleteByUserAndProduct_Id(user, productId);
    }
}
