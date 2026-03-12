package com.cravekart.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.cravekart.backend.model.Dish;
import com.cravekart.backend.model.Restaurant;
import com.cravekart.backend.model.User;
import com.cravekart.backend.repository.DishRepository;
import com.cravekart.backend.repository.RestaurantRepository;
import com.cravekart.backend.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private DishRepository dishRepository;

    @Override
    public void run(String... args) throws Exception {
        // Clear existing data for fresh seed if needed
        // userRepository.deleteAll();
        // restaurantRepository.deleteAll();
        // dishRepository.deleteAll();

        if (userRepository.count() > 0)
            return;

        // Create a test user
        User admin = new User();
        admin.setEmail("admin@cravekart.com");
        admin.setPassword("admin123");
        admin.setName("Admin User");
        admin.setRole(User.UserRole.RESTAURANT_OWNER);
        admin = userRepository.save(admin);

        // Create initial restaurants
        Restaurant r1 = new Restaurant();
        r1.setName("Flavor Fusion");
        r1.setAddress("123 Food Street, Delhi");
        r1.setRating(4.8);
        r1.setImage("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600");
        r1.setOwner(admin);
        r1 = restaurantRepository.save(r1);

        Restaurant r2 = new Restaurant();
        r2.setName("Burger House");
        r2.setAddress("456 Fast Lane, Mumbai");
        r2.setRating(4.5);
        r2.setImage("https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=600");
        r2.setOwner(admin);
        r2 = restaurantRepository.save(r2);

        Restaurant r3 = new Restaurant();
        r3.setName("Italiano Pizza");
        r3.setAddress("789 Pasta Road, Bangalore");
        r3.setRating(4.7);
        r3.setImage("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600");
        r3.setOwner(admin);
        r3 = restaurantRepository.save(r3);

        Restaurant r4 = new Restaurant();
        r4.setName("Sushi Master");
        r4.setAddress("101 Zen Garden, Pune");
        r4.setRating(4.9);
        r4.setImage("https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&q=80&w=600");
        r4.setOwner(admin);
        r4 = restaurantRepository.save(r4);

        // Create initial dishes
        Dish d1 = new Dish();
        d1.setName("Premium Butter Chicken");
        d1.setPrice(450.0);
        d1.setDescription("Rich and creamy butter chicken with secret spices");
        d1.setImage("https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=400");
        d1.setRestaurantId(r1.getId());
        dishRepository.save(d1);

        Dish d2 = new Dish();
        d2.setName("Monster Cheese Burger");
        d2.setPrice(299.0);
        d2.setDescription("Triple patty burger with extra melted cheese");
        d2.setImage("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400");
        d2.setRestaurantId(r2.getId());
        dishRepository.save(d2);

        Dish d3 = new Dish();
        d3.setName("Margherita Special");
        d3.setPrice(399.0);
        d3.setDescription("Fresh mozzarella, basil and tomatoes on thin crust");
        d3.setImage("https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400");
        d3.setRestaurantId(r3.getId());
        dishRepository.save(d3);

        Dish d5 = new Dish();
        d5.setName("Dragon Sushi Roll");
        d5.setPrice(599.0);
        d5.setDescription("Eel and cucumber inside with avocado outside");
        d5.setImage("https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=400");
        d5.setRestaurantId(r4.getId());
        dishRepository.save(d5);

        Dish d6 = new Dish();
        d6.setName("Truffle Fries");
        d6.setPrice(150.0);
        d6.setDescription("Golden fries tossed in truffle oil and parmesan");
        d6.setImage("https://images.unsplash.com/photo-1630384066252-19201b58a4f4?auto=format&fit=crop&q=80&w=400");
        d6.setRestaurantId(r2.getId());
        dishRepository.save(d6);

        System.out.println("CraveKart Backend Seeded with rich data to MongoDB!");
    }
}
