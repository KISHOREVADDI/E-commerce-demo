package com.fashnix.fashionstore.controller;

import com.fashnix.fashionstore.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:4200")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> data) {
        try {
            int amount = (int) data.get("amount");
            String currency = (String) data.get("currency");

            Map<String, Object> orderData = paymentService.createRazorpayOrder(amount, currency);
            return ResponseEntity.ok(orderData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, String>> verifyPayment(@RequestBody Map<String, Object> data) {
        try {
            String razorpayOrderId = (String) data.get("razorpayOrderId");
            String razorpayPaymentId = (String) data.get("razorpayPaymentId");
            String razorpaySignature = (String) data.get("razorpaySignature");
            Long userId = Long.valueOf(data.get("userId").toString());
            String shippingAddress = (String) data.get("shippingAddress");

            boolean isValid = paymentService.verifyPaymentSignature(razorpayOrderId, razorpayPaymentId,
                    razorpaySignature);

            if (isValid) {
                paymentService.createOrderAfterPayment(userId, shippingAddress, razorpayPaymentId);
                return ResponseEntity.ok(Map.of("status", "success", "message", "Payment verified successfully"));
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("status", "failure", "message", "Invalid payment signature"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }
}
