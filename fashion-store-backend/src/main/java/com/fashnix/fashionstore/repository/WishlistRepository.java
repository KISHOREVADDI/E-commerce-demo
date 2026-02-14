package com.fashnix.fashionstore.repository;

import com.fashnix.fashionstore.model.User;
import com.fashnix.fashionstore.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUser(User user);

    Optional<Wishlist> findByUserAndProduct_Id(User user, Long productId);

    void deleteByUserAndProduct_Id(User user, Long productId);
}
