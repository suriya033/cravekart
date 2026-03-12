package com.cravekart.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "dishes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Dish {
    @Id
    private String id;

    private String name;
    private Double price;
    private String description;
    private String image;

    private String restaurantId;
}
