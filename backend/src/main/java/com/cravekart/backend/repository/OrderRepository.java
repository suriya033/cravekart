package com.cravekart.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.cravekart.backend.model.Order;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByCustomer_Id(String customerId);

    List<Order> findByRestaurant_Id(String restaurantId);
}
