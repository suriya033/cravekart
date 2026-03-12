package com.cravekart.backend.repository;

import com.cravekart.backend.model.Dish;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DishRepository extends MongoRepository<Dish, String> {
    List<Dish> findByRestaurantId(String restaurantId);
}
