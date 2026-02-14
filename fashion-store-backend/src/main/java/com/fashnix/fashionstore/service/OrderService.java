package com.fashnix.fashionstore.service;

import com.fashnix.fashionstore.model.Cart;
import com.fashnix.fashionstore.model.*;
import com.fashnix.fashionstore.repository.CartRepository;
import com.fashnix.fashionstore.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartService cartService;

    @Transactional
    public Order placeOrder(Long userId, com.fashnix.fashionstore.dto.OrderRequest request) {
        Cart cart = cartService.getCartByUser(userId);
        List<Product> products = cart.getProducts();

        if (products.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(cart.getUser());
        order.setStatus("Placed");
        order.setCheckStatus("Processing");
        order.setShippingAddress(request.getShippingAddress());
        order.setPaymentMethod(request.getPaymentMethod());

        if ("cod".equalsIgnoreCase(request.getPaymentMethod())) {
            order.setPaymentStatus("PENDING");
        } else {
            order.setPaymentStatus("PAID"); // Assume paid for others for now
        }

        // Generate unique order details
        String orderNumber = "ORD-" + System.currentTimeMillis() + "-" + (int) (Math.random() * 1000);
        order.setOrderNumber(orderNumber);

        String trackingNumber = "TRK-" + System.currentTimeMillis();
        order.setTrackingNumber(trackingNumber);

        // Calculate total and create items
        // Important: grouping by product to get quantity if the cart has duplicate
        // products
        // But our current cart model (ManyToMany List<Product>) might just list
        // duplicates or just unique.
        // Assuming List<Product> implies 1 quantity per entry for now.
        // A better Cart model would have CartItem.
        // Let's assume for now we list every product instance as 1 item.

        double total = 0.0;
        for (Product product : products) {
            OrderItem item = new OrderItem(order, product, 1, product.getPrice());
            order.addItem(item);
            total += product.getPrice();
        }

        order.setTotalAmount(total);

        Order savedOrder = orderRepository.save(order);

        // Clear cart
        cart.getProducts().clear();
        cartRepository.save(cart);

        return savedOrder;
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
    }
}
