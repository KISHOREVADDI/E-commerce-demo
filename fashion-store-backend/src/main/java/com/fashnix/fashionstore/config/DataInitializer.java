package com.fashnix.fashionstore.config;

import com.fashnix.fashionstore.model.Product;
import com.fashnix.fashionstore.model.User;
import com.fashnix.fashionstore.repository.ProductRepository;
import com.fashnix.fashionstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

        @Autowired
        private ProductRepository productRepository;

        @Autowired
        private UserRepository userRepository;

        @Override
        public void run(String... args) throws Exception {
                // if (productRepository.count() == 0) {
                // // Products are now added manually by the seller/admin.
                // // Seeding disabled to prevent mock data appearance.
                // }

                if (userRepository.count() == 0) {
                        User admin = new User();
                        admin.setName("Admin User");
                        admin.setEmail("admin@fashnix.com");
                        admin.setPassword("admin123"); // In real app, hash this!
                        admin.setRole("ADMIN");
                        admin.setAddress("Fashnix HQ");
                        admin.setPhone("1234567890");

                        User user = new User();
                        user.setName("John Doe");
                        user.setEmail("user@fashnix.com");
                        user.setPassword("user123");
                        user.setRole("USER");
                        user.setAddress("123 Fashion St");
                        user.setPhone("0987654321");

                        userRepository.saveAll(List.of(admin, user));
                        System.out.println("Data Initialized: Admin and User accounts created.");
                }
        }
}
