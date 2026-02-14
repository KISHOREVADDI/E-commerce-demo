package com.fashnix.fashionstore.repository;

import com.fashnix.fashionstore.model.Cart;
import com.fashnix.fashionstore.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}
