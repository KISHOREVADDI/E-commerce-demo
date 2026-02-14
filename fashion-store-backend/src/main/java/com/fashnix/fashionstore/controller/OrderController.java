package com.fashnix.fashionstore.controller;

import com.fashnix.fashionstore.model.Order;
import com.fashnix.fashionstore.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/{userId}/place")
    public ResponseEntity<?> placeOrder(@PathVariable Long userId,
            @RequestBody com.fashnix.fashionstore.dto.OrderRequest request) {
        try {
            return ResponseEntity.ok(orderService.placeOrder(userId, request));
        } catch (Exception e) {
            e.printStackTrace(); // Print stack trace to backend console
            return ResponseEntity.badRequest().body("Order Failed: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }

    @GetMapping("/detail/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }
}
