package com.cravekart.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    private String id;

    @DBRef
    private User customer;

    @DBRef
    private Restaurant restaurant;

    private OrderStatus status;
    private Double totalAmount;
    private LocalDateTime createdAt = LocalDateTime.now();

    private List<OrderItem> items;

    public enum OrderStatus {
        PENDING, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
    }
}
