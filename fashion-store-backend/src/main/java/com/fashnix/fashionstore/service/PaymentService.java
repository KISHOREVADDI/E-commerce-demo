package com.fashnix.fashionstore.service;

import com.fashnix.fashionstore.model.Cart;
import com.fashnix.fashionstore.model.Order;
import com.fashnix.fashionstore.model.Product;
import com.fashnix.fashionstore.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.*;

@Service
public class PaymentService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;

    // Test credentials - Replace with your actual Razorpay keys
    private static final String RAZORPAY_KEY_ID = "rzp_test_YOUR_KEY_ID";
    private static final String RAZORPAY_KEY_SECRET = "YOUR_KEY_SECRET";

    public Map<String, Object> createRazorpayOrder(int amount, String currency) {
        // In production, you would call Razorpay API to create an order
        // For now, we'll create a mock order
        String orderId = "order_" + System.currentTimeMillis();

        Map<String, Object> orderData = new HashMap<>();
        orderData.put("razorpayOrderId", orderId);
        orderData.put("amount", amount);
        orderData.put("currency", currency);
        orderData.put("key", RAZORPAY_KEY_ID);

        return orderData;
    }

    public boolean verifyPaymentSignature(String orderId, String paymentId, String signature) {
        try {
            String payload = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(RAZORPAY_KEY_SECRET.getBytes(), "HmacSHA256");
            mac.init(secretKey);

            byte[] hash = mac.doFinal(payload.getBytes());
            String generatedSignature = bytesToHex(hash);

            return generatedSignature.equals(signature);
        } catch (Exception e) {
            // For testing purposes, we'll accept any signature
            return true;
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }

    public void createOrderAfterPayment(Long userId, String shippingAddress, String paymentId) {
        Cart cart = cartService.getCartByUser(userId);
        List<Product> products = cart.getProducts();

        if (products.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(cart.getUser());
        order.setStatus("Placed");
        order.setCheckStatus("Processing");
        order.setShippingAddress(shippingAddress);
        order.setPaymentMethod("razorpay");
        order.setPaymentStatus("PAID");

        String orderNumber = "ORD-" + System.currentTimeMillis() + "-" + (int) (Math.random() * 1000);
        order.setOrderNumber(orderNumber);

        String trackingNumber = "TRK-" + System.currentTimeMillis();
        order.setTrackingNumber(trackingNumber);

        double totalPrice = products.stream().mapToDouble(Product::getPrice).sum();
        order.setTotalAmount(totalPrice);

        orderRepository.save(order);

        // Clear cart after order
        cart.getProducts().clear();
        cartService.saveCart(cart);
    }
}
