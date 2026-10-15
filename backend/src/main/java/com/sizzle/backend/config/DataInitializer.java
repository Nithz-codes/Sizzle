package com.sizzle.backend.config;

import com.sizzle.backend.model.*;
import com.sizzle.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           MenuItemRepository menuItemRepository,
                           OrderRepository orderRepository,
                           InventoryRepository inventoryRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.menuItemRepository = menuItemRepository;
        this.orderRepository = orderRepository;
        this.inventoryRepository = inventoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        log.info("Starting Sizzle DataInitializer...");
        seedUsers();
        seedCategoriesAndMenuItems();
        seedSampleInventory();
        seedSampleOrders();
        log.info("Sizzle DataInitializer completed successfully.");
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@sizzle.com")) {
            User admin = User.builder()
                    .name("Sizzle Admin")
                    .email("admin@sizzle.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .phone("+1 555-0199")
                    .role(Role.ADMIN)
                    .accountStatus(AccountStatus.ACTIVE)
                    .build();
            userRepository.save(admin);
            log.info("Initialized default ADMIN account: admin@sizzle.com");
        }

        if (!userRepository.existsByEmail("chef@sizzle.com")) {
            User chef = User.builder()
                    .name("Head Chef Mario")
                    .email("chef@sizzle.com")
                    .password(passwordEncoder.encode("Chef@123"))
                    .phone("+1 555-0155")
                    .role(Role.CHEF)
                    .accountStatus(AccountStatus.ACTIVE)
                    .build();
            userRepository.save(chef);
            log.info("Initialized default CHEF account: chef@sizzle.com");
        }

        if (!userRepository.existsByEmail("customer@sizzle.com")) {
            User customer = User.builder()
                    .name("John Customer")
                    .email("customer@sizzle.com")
                    .password(passwordEncoder.encode("Customer@123"))
                    .phone("+1 555-0100")
                    .role(Role.CUSTOMER)
                    .accountStatus(AccountStatus.ACTIVE)
                    .build();
            userRepository.save(customer);
            log.info("Initialized default CUSTOMER account: customer@sizzle.com");
        }
    }

    private void seedCategoriesAndMenuItems() {
        log.info("Synchronizing full suite of 52 categories and menu items with legitimate image URLs...");

        Category burger = getOrCreateCategory("Burger", "Burgers & Sandwiches", "Hamburger", "Juicy handcrafted patties & toasted artisanal sandwiches");
        Category pizza = getOrCreateCategory("Pizza", "Pizza", "Pizza", "Stone-baked thin crust pizzas topped with rich mozzarella");
        Category pasta = getOrCreateCategory("Pasta", "Pasta", "UtensilsCrossed", "Silky pasta tossed in rich simmered artisanal sauces");
        Category chinese = getOrCreateCategory("Chinese", "Chinese", "Flame", "Wok-tossed noodles, fragrant rice, and spicy Manchurians");
        Category biryani = getOrCreateCategory("Biryani", "Biryani", "Soup", "Long-grain basmati rice layered with aromatic spices");
        Category curry = getOrCreateCategory("Indian Curry", "Indian Curry", "Bowl", "Rich slow-simmered gravies infused with authentic spices");
        Category breads = getOrCreateCategory("Breads", "Breads", "Wheat", "Freshly baked tandoori naans, rotis, and layered parottas");
        Category grill = getOrCreateCategory("Grill", "Grills & Tandoor", "Drumstick", "Smoky tandoori delicacies, charred grills, and sizzlers");
        Category starters = getOrCreateCategory("Starters", "Starters", "Cookie", "Crispy golden appetizers, fries, and steamed momos");
        Category dessert = getOrCreateCategory("Dessert", "Desserts", "Cake", "Decadent warm cakes, sundaes, and traditional sweets");
        Category beverage = getOrCreateCategory("Beverage", "Beverages", "Coffee", "Chilled mocktails, thick shakes, and freshly brewed coffees");

        List<MenuItemSeed> seeds = List.of(
            // Burgers & Sandwiches (1..7)
            new MenuItemSeed("Classic Burger", "Fresh crisp veg patty, tomatoes, lettuce, and signature garlic aioli sauce.", "120", "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80", true, 0, "12-15 mins", 4.6, burger),
            new MenuItemSeed("Cheese Burger", "Melted cheddar cheese over a spiced patty with caramelized onions and house relish.", "150", "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80", true, 0, "12-15 mins", 4.8, burger),
            new MenuItemSeed("Chicken Burger", "Crispy fried chicken fillet topped with coleslaw and tangy smoked mayo.", "180", "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80", false, 1, "15 mins", 4.7, burger),
            new MenuItemSeed("Double Chicken Burger", "Double grilled chicken patties layered with cheese slice, jalapeños, and smoky barbecue sauce.", "240", "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80", false, 2, "18 mins", 4.9, burger),
            new MenuItemSeed("Veg Sandwich", "Fresh farm cucumbers, tomatoes, bell peppers, and mint chutney in multigrain bread.", "110", "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80", true, 0, "10 mins", 4.4, burger),
            new MenuItemSeed("Grilled Sandwich", "Butter-toasted white bread stuffed with spiced potatoes, sweet corn, and melted mozzarella.", "150", "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&w=800&q=80", true, 0, "12 mins", 4.6, burger),
            new MenuItemSeed("Club Sandwich", "Triple-decker toasted sandwich filled with shredded chicken, boiled egg, lettuce, and mayo.", "180", "https://img.freepik.com/free-photo/side-view-club-sandwich-with-salted-cucumbers-lemon-olives-round-white-plate_176474-3049.jpg?semt=ais_hybrid&w=740&q=80", false, 1, "15 mins", 4.7, burger),

            // Pizza (8..11)
            new MenuItemSeed("Margherita Pizza", "Classic stone-baked dough topped with San Marzano tomato sauce, fresh mozzarella, and basil.", "250", "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80", true, 0, "15-20 mins", 4.8, pizza),
            new MenuItemSeed("Farmhouse Pizza", "Loaded with crunchy bell peppers, sweet corn, black olives, red onions, and mushroom.", "320", "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80", true, 0, "18 mins", 4.7, pizza),
            new MenuItemSeed("Veg Supreme Pizza", "Deluxe toppings featuring paneer cubes, jalapeños, baby corn, olives, and extra cheese.", "340", "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80", true, 0, "20 mins", 4.8, pizza),
            new MenuItemSeed("Chicken BBQ Pizza", "Smoky barbecue chicken chunks, caramelized red onions, coriander, and double cheese.", "390", "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80", false, 2, "20 mins", 4.9, pizza),

            // Pasta (12..15)
            new MenuItemSeed("White Sauce Pasta", "Penne pasta cooked in rich creamy parmesan bechamel sauce with garlic and herbs.", "220", "https://lilluna.com/wp-content/uploads/2022/11/white-sauce-pasta-resize-10.jpg", true, 0, "15 mins", 4.7, pasta),
            new MenuItemSeed("Red Sauce Pasta", "Tangy Italian arrabbiata plum tomato sauce infused with chilli flakes, garlic, and fresh basil.", "210", "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80", true, 1, "15 mins", 4.5, pasta),
            new MenuItemSeed("Pink Sauce Pasta", "Harmonious blend of rich cream and tangy arrabbiata sauce topped with broccoli & zucchini.", "240", "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80", true, 0, "16 mins", 4.8, pasta),
            new MenuItemSeed("Chicken Alfredo Pasta", "Succulent grilled chicken breast sliced over fettuccine tossed in buttery parmesan cream.", "310", "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80", false, 0, "18 mins", 4.9, pasta),

            // Chinese (16..21)
            new MenuItemSeed("Veg Fried Rice", "Wok-tossed basmati rice with finely chopped carrots, beans, spring onions, and white pepper.", "180", "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80", true, 0, "12 mins", 4.5, chinese),
            new MenuItemSeed("Chicken Fried Rice", "Classic wok rice with tender chicken pieces, scrambled egg, and Asian aromatic spices.", "230", "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80", false, 1, "14 mins", 4.8, chinese),
            new MenuItemSeed("Veg Noodles", "Stir-fried hakka noodles tossed with cabbage, bell peppers, soy sauce, and sesame oil.", "170", "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80", true, 1, "12 mins", 4.6, chinese),
            new MenuItemSeed("Chicken Noodles", "Savory stir-fried noodles cooked with shredded chicken, crunchy vegetables, and chilli sauce.", "240", "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80", false, 1, "15 mins", 4.7, chinese),
            new MenuItemSeed("Gobi Manchurian", "Crispy fried cauliflower florets coated in a spicy, tangy Indo-Chinese garlic soy glaze.", "190", "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80", true, 2, "15 mins", 4.8, chinese),
            new MenuItemSeed("Chicken Manchurian", "Juicy chicken meatballs tossed in dark soy sauce, fresh garlic, ginger, and green chillies.", "260", "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80", false, 2, "16 mins", 4.8, chinese),

            // Biryani (22..25)
            new MenuItemSeed("Veg Biryani", "Fragrant basmati rice layered with garden vegetables, saffron, mint, and slow dum spice.", "180", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80", true, 1, "18 mins", 4.6, biryani),
            new MenuItemSeed("Chicken Biryani", "Tender marinated chicken pieces cooked on dum with long-grain rice, ghee, and roasted onions.", "260", "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80", false, 2, "20 mins", 4.9, biryani),
            new MenuItemSeed("Mutton Biryani", "Succulent slow-cooked mutton chunks infused with whole spices and rich saffron basmati rice.", "340", "https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=800&q=80", false, 2, "22 mins", 4.9, biryani),
            new MenuItemSeed("Hyderabadi Chicken Biryani", "Authentic spicy Nizami style dum biryani garnished with fried onions, coriander, and boiled egg.", "320", "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80", false, 3, "20 mins", 4.9, biryani),

            // Indian Curry (26..29)
            new MenuItemSeed("Paneer Butter Masala", "Soft cottage cheese cubes cooked in a silky, butter-rich tomato cashew cream gravy.", "220", "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80", true, 1, "15 mins", 4.8, curry),
            new MenuItemSeed("Chicken Butter Masala", "Marinated chicken simmered in a mildly spiced, aromatic tomato cream sauce.", "280", "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80", false, 1, "18 mins", 4.9, curry),
            new MenuItemSeed("Butter Chicken", "Tandoori chicken tikka pieces cooked in rich, velvety tomato and fenugreek butter gravy.", "300", "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80", false, 1, "18 mins", 5.0, curry),
            new MenuItemSeed("Kadai Paneer", "Paneer cubes cooked with coarsely ground kadai spices, onions, and crisp bell peppers.", "240", "https://img.freepik.com/free-photo/pre-prepared-food-showcasing-ready-eat-delicious-meals-go_23-2151246089.jpg?semt=ais_hybrid&w=740&q=80", true, 2, "15 mins", 4.7, curry),

            // Breads (30..34)
            new MenuItemSeed("Butter Naan", "Soft tandoori flatbread brushed generously with salted white butter.", "35", "https://img.freepik.com/free-photo/top-view-pakistani-meal-arrangement_23-2148825100.jpg?semt=ais_hybrid&w=740&q=80", true, 0, "8 mins", 4.8, breads),
            new MenuItemSeed("Garlic Naan", "Tandoori naan topped with chopped minced garlic, coriander, and melted butter.", "50", "https://static.vecteezy.com/system/resources/thumbnails/034/596/901/small/indian-naan-bread-with-parsley-generated-with-ai-photo.jpg", true, 0, "8 mins", 4.9, breads),
            new MenuItemSeed("Butter Roti", "Whole wheat tandoori roti baked over clay oven and smeared with butter.", "25", "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80", true, 0, "6 mins", 4.5, breads),
            new MenuItemSeed("Parotta", "Flaky, layered South Indian refined flour flatbread crushed soft.", "25", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8tcxYCWDdX5kWT3z4qgra6SDe460BWlMamSqjThCPgg&s=10", true, 0, "8 mins", 4.7, breads),
            new MenuItemSeed("Kerala Parotta", "Authentic Malabar spiral layered parotta with crisp golden edges.", "35", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5nVSosFHMsdzG-44q6cfZAoxo16Q1O4esF93b3GyXDA&s=10", true, 0, "8 mins", 4.8, breads),

            // Grills & Tandoor (35..40)
            new MenuItemSeed("Chicken 65", "Spicy deep-fried chicken cubes tempered with curry leaves, mustard seeds, and red chillies.", "240", "https://www.shutterstock.com/image-photo/indian-cuisine-hot-red-chicken-260nw-2587733465.jpg", false, 3, "15 mins", 4.8, grill),
            new MenuItemSeed("Dragon Chicken", "Crispy chicken strips tossed in red chilli sauce, cashew nuts, and bell pepper juliennes.", "280", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXrcl2rz6SyPgwb5Of2bGqu3-4-xyyuqBlPC01acWZow&s=10", false, 2, "16 mins", 4.7, grill),
            new MenuItemSeed("Grill Chicken Half", "Half bone-in chicken marinated in Arabian spices and charcoal grilled to perfection.", "420", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQtpZNxB3oabugj1X04smI8y8UZrn7OM7OSoUngupWOQ&s=10", false, 1, "20 mins", 4.8, grill),
            new MenuItemSeed("Grill Chicken Full", "Whole chicken marinated in garlic herbs & Arabic spices, served with mint dip and pita.", "760", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBoPU_dVsCEs95Mbh9hBKMTvRvsbOg4jBCoon7UmQD4w&s", false, 1, "25 mins", 4.9, grill),
            new MenuItemSeed("Tandoori Chicken Half", "Traditional clay oven roasted chicken seasoned with yoghurt, red chilli, and chat masala.", "400", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRqZAaTkppD0vIX3ePZveU7w0nsnA6yxs58a0wipep3g&s=10", false, 2, "22 mins", 4.9, grill),
            new MenuItemSeed("Tandoori Chicken Full", "Full tandoori roasted chicken served with sliced onions, mint chutney, and lemon wedges.", "720", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7PthlJQeeInsTNjEKPKF0wd1klQDBn8nk2XiNjyIisA&s=10", false, 2, "28 mins", 4.9, grill),

            // Starters (41..44)
            new MenuItemSeed("French Fries", "Golden, extra crispy potato batons lightly salted and served with tomato ketchup.", "90", "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80", true, 0, "10 mins", 4.5, starters),
            new MenuItemSeed("Peri Peri Fries", "Hot crisp fries dusted with fiery spicy African peri-peri seasoning blend.", "120", "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80", true, 2, "10 mins", 4.7, starters),
            new MenuItemSeed("Veg Momos", "Steamed Himalayan dumplings stuffed with finely minced cabbage, carrots, and spring onion.", "130", "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=800&q=80", true, 0, "15 mins", 4.6, starters),
            new MenuItemSeed("Chicken Momos", "Soft steamed dumplings stuffed with spiced chicken mince served with fiery red sesame dip.", "170", "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80", false, 1, "15 mins", 4.8, starters),

            // Desserts (45..48)
            new MenuItemSeed("Chocolate Brownie", "Fudgy warm dark chocolate brownie topped with chocolate drizzle and walnuts.", "160", "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80", true, 0, "5 mins", 4.8, dessert),
            new MenuItemSeed("Ice Cream Sundae", "Triple scoops of vanilla & chocolate ice cream with tutti frutti, nuts, and cherry.", "180", "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80", true, 0, "5 mins", 4.7, dessert),
            new MenuItemSeed("Gulab Jamun", "Two soft golden milk solid dumplings soaked in warm rose and cardamom sugar syrup.", "90", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6xyvtQ-fFN3iXz3_7CJqBH3z7f1pLYd-GcC79fJ-IcA&s=10", true, 0, "5 mins", 4.8, dessert),
            new MenuItemSeed("Chocolate Lava Cake", "Warm chocolate sponge cake with a molten chocolate center oozing on cut.", "190", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRne1qVx2zp0olsDTDt3iKDS26ZARaOO_w6rY1Xl_xfmg&s=10", true, 0, "8 mins", 4.9, dessert),

            // Beverages (49..52)
            new MenuItemSeed("Cold Coffee", "Blended espresso coffee with chilled milk, cream, and vanilla scoop.", "110", "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80", true, 0, "5 mins", 4.7, beverage),
            new MenuItemSeed("Coke", "Chilled 330ml Coca-Cola glass bottle served with ice and lemon slice.", "40", "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80", true, 0, "2 mins", 4.6, beverage),
            new MenuItemSeed("Fresh Lime Soda", "Freshly squeezed lime juice with sparkling soda water (Sweet, Salted or Mixed).", "70", "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80", true, 0, "4 mins", 4.8, beverage),
            new MenuItemSeed("Chocolate Milkshake", "Thick creamy chocolate milkshake topped with cocoa powder and chocolate chips.", "150", "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80", true, 0, "6 mins", 4.8, beverage)
        );

        for (MenuItemSeed seed : seeds) {
            int cal = 450, prot = 20, carbs = 45, fat = 18;
            String nameLower = seed.name.toLowerCase();
            if (nameLower.contains("tandoori chicken")) { cal = 440; prot = 54; carbs = 6; fat = 22; }
            else if (nameLower.contains("grill chicken")) { cal = 380; prot = 48; carbs = 8; fat = 16; }
            else if (nameLower.contains("reshmi") || nameLower.contains("malai chicken")) { cal = 420; prot = 45; carbs = 8; fat = 22; }
            else if (nameLower.contains("kebab")) { cal = 390; prot = 42; carbs = 7; fat = 21; }
            else if (nameLower.contains("paneer tikka")) { cal = 360; prot = 22; carbs = 10; fat = 24; }
            else if (nameLower.contains("biryani") && !seed.isVeg) { cal = 680; prot = 38; carbs = 72; fat = 26; }
            else if (nameLower.contains("biryani") && seed.isVeg) { cal = 580; prot = 24; carbs = 74; fat = 22; }
            else if (nameLower.contains("double chicken")) { cal = 720; prot = 46; carbs = 46; fat = 36; }
            else if (nameLower.contains("burger") && !seed.isVeg) { cal = 540; prot = 32; carbs = 42; fat = 26; }
            else if (nameLower.contains("burger") && seed.isVeg) { cal = 410; prot = 12; carbs = 48; fat = 16; }
            else if (nameLower.contains("naan")) { cal = 260; prot = 7; carbs = 38; fat = 9; }
            else if (nameLower.contains("roti")) { cal = 140; prot = 4; carbs = 28; fat = 1; }

            Optional<MenuItem> existing = menuItemRepository.findByName(seed.name);
            if (existing.isPresent()) {
                MenuItem item = existing.get();
                item.setDescription(seed.description);
                item.setPrice(new BigDecimal(seed.price));
                item.setImage(seed.image);
                item.setIsVeg(seed.isVeg);
                item.setSpicyLevel(seed.spicyLevel);
                item.setPrepTime(seed.prepTime);
                item.setRating(seed.rating);
                item.setCategory(seed.category);
                item.setCalories(cal);
                item.setProtein(prot);
                item.setCarbs(carbs);
                item.setFat(fat);
                menuItemRepository.save(item);
            } else {
                MenuItem item = MenuItem.builder()
                        .name(seed.name)
                        .description(seed.description)
                        .price(new BigDecimal(seed.price))
                        .image(seed.image)
                        .isVeg(seed.isVeg)
                        .spicyLevel(seed.spicyLevel)
                        .prepTime(seed.prepTime)
                        .rating(seed.rating)
                        .category(seed.category)
                        .isAvailable(true)
                        .build();
                item.setCalories(cal);
                item.setProtein(prot);
                item.setCarbs(carbs);
                item.setFat(fat);
                menuItemRepository.save(item);
            }
        }

        List<String> validNames = seeds.stream().map(s -> s.name).toList();
        List<MenuItem> legacyItems = menuItemRepository.findAll().stream()
                .filter(m -> !validNames.contains(m.getName()))
                .toList();

        for (MenuItem legacy : legacyItems) {
            try {
                menuItemRepository.delete(legacy);
            } catch (Exception e) {
                legacy.setIsAvailable(false);
                menuItemRepository.save(legacy);
            }
        }

        log.info("Successfully synchronized {} categories and {} active menu items into database.", categoryRepository.count(), menuItemRepository.findByIsAvailableTrue().size());
    }

    private Category getOrCreateCategory(String name, String displayName, String icon, String description) {
        return categoryRepository.findByName(name)
                .orElseGet(() -> categoryRepository.save(Category.builder()
                        .name(name)
                        .displayName(displayName)
                        .icon(icon)
                        .description(description)
                        .build()));
    }

    private void seedSampleInventory() {
        if (inventoryRepository.count() > 0) {
            return;
        }

        log.info("Seeding initial inventory items into database...");

        List<InventoryItem> items = List.of(
            InventoryItem.builder().name("Angus Beef Patties").category("Meat & Poultry").quantity(45.0).unit("kg").minThreshold(15.0).costPerUnit(new BigDecimal("650.00")).supplier("Prime Meats Co.").build(),
            InventoryItem.builder().name("Fresh Buffalo Mozzarella").category("Dairy").quantity(12.0).unit("kg").minThreshold(10.0).costPerUnit(new BigDecimal("480.00")).supplier("Artisan Dairy Farm").build(),
            InventoryItem.builder().name("Aromatic Basmati Rice").category("Grains & Rice").quantity(120.0).unit("kg").minThreshold(30.0).costPerUnit(new BigDecimal("120.00")).supplier("Royal Grains India").build(),
            InventoryItem.builder().name("Fresh Farm Chicken Breast").category("Meat & Poultry").quantity(8.0).unit("kg").minThreshold(12.0).costPerUnit(new BigDecimal("280.00")).supplier("FreshPoultry Ltd.").build(),
            InventoryItem.builder().name("Truffle Oil Extra Virgin").category("Condiments").quantity(2.5).unit("liters").minThreshold(1.0).costPerUnit(new BigDecimal("1850.00")).supplier("Tuscany Imports").build(),
            InventoryItem.builder().name("Artisanal Brioche Buns").category("Bakery").quantity(0.0).unit("pcs").minThreshold(50.0).costPerUnit(new BigDecimal("15.00")).supplier("Golden Bakehouse").build(),
            InventoryItem.builder().name("San Marzano Tomatoes").category("Produce").quantity(35.0).unit("kg").minThreshold(15.0).costPerUnit(new BigDecimal("95.00")).supplier("Organic Farm Fresh").build(),
            InventoryItem.builder().name("Fresh Mint & Coriander").category("Produce").quantity(4.5).unit("kg").minThreshold(2.0).costPerUnit(new BigDecimal("60.00")).supplier("Local Green Mandi").build(),
            InventoryItem.builder().name("Dark Belgian Chocolate").category("Baking").quantity(18.0).unit("kg").minThreshold(5.0).costPerUnit(new BigDecimal("750.00")).supplier("Cocoa Craft").build(),
            InventoryItem.builder().name("Passion Fruit Pulp").category("Beverages").quantity(6.0).unit("liters").minThreshold(3.0).costPerUnit(new BigDecimal("320.00")).supplier("Exotic Juices Co.").build()
        );

        inventoryRepository.saveAll(items);
        log.info("Successfully seeded {} initial inventory items into database.", inventoryRepository.count());
    }

    private void seedSampleOrders() {
        if (orderRepository.count() > 0) {
            return;
        }

        List<MenuItem> allItems = menuItemRepository.findAll();
        if (allItems.isEmpty()) return;

        log.info("Seeding initial sample orders...");

        MenuItem item1 = allItems.get(0);
        MenuItem item2 = allItems.size() > 1 ? allItems.get(1) : item1;

        Order order1 = Order.builder()
                .orderNumber("SZ-1001")
                .customerName("Rahul Sharma")
                .customerPhone("+91 9876543210")
                .tableNumber("T-04")
                .orderType(OrderType.DINE_IN)
                .paymentMethod(PaymentMethod.UPI)
                .orderStatus(OrderStatus.PREPARING)
                .orderNotes("Extra spicy, please")
                .build();

        OrderItem orderItem1 = OrderItem.builder()
                .menuItem(item1)
                .itemName(item1.getName())
                .price(item1.getPrice())
                .quantity(2)
                .build();

        OrderItem orderItem2 = OrderItem.builder()
                .menuItem(item2)
                .itemName(item2.getName())
                .price(item2.getPrice())
                .quantity(1)
                .build();

        order1.addItem(orderItem1);
        order1.addItem(orderItem2);

        BigDecimal subtotal = orderItem1.getSubtotal().add(orderItem2.getSubtotal());
        BigDecimal tax = subtotal.multiply(new BigDecimal("0.05"));
        BigDecimal discount = subtotal.compareTo(new BigDecimal("1000")) >= 0 ? subtotal.multiply(new BigDecimal("0.10")) : BigDecimal.ZERO;
        BigDecimal grandTotal = subtotal.add(tax).subtract(discount);

        order1.setSubtotal(subtotal);
        order1.setTaxAmount(tax);
        order1.setDiscountAmount(discount);
        order1.setGrandTotal(grandTotal);

        orderRepository.save(order1);
        log.info("Successfully seeded initial sample orders into database.");
    }

    private record MenuItemSeed(
        String name,
        String description,
        String price,
        String image,
        boolean isVeg,
        int spicyLevel,
        String prepTime,
        double rating,
        Category category
    ) {}
}
