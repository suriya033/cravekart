package com.cravekart.backend.controller;

import com.cravekart.backend.model.Dish;
import com.cravekart.backend.repository.DishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dishes")
@CrossOrigin(origins = "*")
public class DishController {

    @Autowired
    private DishRepository dishRepository;

    @GetMapping
    public List<Dish> getAllDishes() {
        return dishRepository.findAll();
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<Dish> getDishesByRestaurant(@PathVariable String restaurantId) {
        return dishRepository.findByRestaurantId(restaurantId);
    }
}
