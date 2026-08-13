package com.sizzle.backend.config;

import com.sizzle.backend.model.AccountStatus;
import com.sizzle.backend.model.Category;
import com.sizzle.backend.model.MenuItem;
import com.sizzle.backend.model.Role;
import com.sizzle.backend.model.User;
import com.sizzle.backend.repository.CategoryRepository;
import com.sizzle.backend.repository.MenuItemRepository;
import com.sizzle.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final com.sizzle.backend.repository.OrderRepository orderRepository;
    private final com.sizzle.backend.repository.InventoryRepository inventoryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           MenuItemRepository menuItemRepository,
                           com.sizzle.backend.repository.OrderRepository orderRepository,
                           com.sizzle.backend.repository.InventoryRepository inventoryRepository,
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
        seedUsers();
        seedCategoriesAndMenuItems();
        seedSampleOrders();
        seedSampleInventory();
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

        if (!userRepository.existsByEmail("098@gmail.com")) {
            User secondAdmin = User.builder()
                    .name("Secondary Admin")
                    .email("098@gmail.com")
                    .password(passwordEncoder.encode("098765"))
                    .phone("+1 555-0987")
                    .role(Role.ADMIN)
                    .accountStatus(AccountStatus.ACTIVE)
                    .build();
            userRepository.save(secondAdmin);
            log.info("Initialized secondary ADMIN account: 098@gmail.com");
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
        if (categoryRepository.count() > 0) {
            return;
        }

        log.info("Seeding initial categories and menu items...");

        Category burger = categoryRepository.save(Category.builder().name("Burger").displayName("Burgers & Sandwiches").icon("Beef").description("Juicy handcrafted patties & toasted artisanal sandwiches").build());
        Category pizza = categoryRepository.save(Category.builder().name("Pizza").displayName("Pizza").icon("Pizza").description("Stone-baked thin crust pizzas topped with rich mozzarella").build());
        Category pasta = categoryRepository.save(Category.builder().name("Pasta").displayName("Pasta").icon("UtensilsCrossed").description("Silky pasta tossed in rich simmered artisanal sauces").build());
        Category chinese = categoryRepository.save(Category.builder().name("Chinese").displayName("Chinese").icon("Flame").description("Wok-tossed noodles, fragrant rice, and spicy Manchurians").build());
        Category biryani = categoryRepository.save(Category.builder().name("Biryani").displayName("Biryani").icon("Soup").description("Long-grain basmati rice layered with aromatic spices").build());
        Category curry = categoryRepository.save(Category.builder().name("Indian Curry").displayName("Indian Curry").icon("Bowl").description("Rich slow-simmered gravies infused with authentic spices").build());
        Category breads = categoryRepository.save(Category.builder().name("Breads").displayName("Breads").icon("Wheat").description("Freshly baked tandoori naans, rotis, and layered parottas").build());
        Category dessert = categoryRepository.save(Category.builder().name("Dessert").displayName("Dessert").icon("IceCream").description("Decadent warm cakes, sundaes, and traditional sweets").build());
        Category beverage = categoryRepository.save(Category.builder().name("Beverage").displayName("Beverage").icon("Coffee").description("Chilled mocktails, thick shakes, and freshly brewed coffees").build());

        List<MenuItem> items = List.of(
            MenuItem.builder().name("Classic Smash Cheeseburger").description("Double smashed Angus beef patty, melted cheddar, caramelized onions & signature sauce.").price(new BigDecimal("349")).image("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800").isVeg(false).spicyLevel(1).prepTime("15 mins").rating(4.8).category(burger).build(),
            MenuItem.builder().name("Smokey BBQ Bacon Deluxe").description("Crispy bacon, onion rings, smoked gouda & rich hickory BBQ sauce on a brioche bun.").price(new BigDecimal("429")).image("https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800").isVeg(false).spicyLevel(2).prepTime("18 mins").rating(4.7).category(burger).build(),
            MenuItem.builder().name("Crispy Truffle Veggie Burger").description("Panko-crusted spiced mushroom patty, truffle mayo, arugula & aged Swiss cheese.").price(new BigDecimal("329")).image("https://images.unsplash.com/photo-1550547660-d9450f859349?w=800").isVeg(true).spicyLevel(0).prepTime("15 mins").rating(4.6).category(burger).build(),
            
            MenuItem.builder().name("Artisanal Margherita Supreme").description("San Marzano tomato base, fresh buffalo mozzarella, fresh basil & extra virgin olive oil.").price(new BigDecimal("499")).image("https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800").isVeg(true).spicyLevel(0).prepTime("20 mins").rating(4.9).category(pizza).build(),
            MenuItem.builder().name("Fiery Pepperoni Feast").description("Double layered spicy pepperoni, crushed chili flakes & stringy mozzarella cheese.").price(new BigDecimal("599")).image("https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800").isVeg(false).spicyLevel(3).prepTime("22 mins").rating(4.8).category(pizza).build(),

            MenuItem.builder().name("Truffle Mushroom Fettuccine").description("Hand-rolled fettuccine in a creamy wild mushroom & white truffle oil reduction.").price(new BigDecimal("449")).image("https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800").isVeg(true).spicyLevel(0).prepTime("18 mins").rating(4.7).category(pasta).build(),
            MenuItem.builder().name("Classic Chicken Hakka Noodles").description("Wok-tossed noodles with shredded chicken, crunchy bell peppers & Szechuan oil.").price(new BigDecimal("299")).image("https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800").isVeg(false).spicyLevel(2).prepTime("15 mins").rating(4.5).category(chinese).build(),

            MenuItem.builder().name("Royal Hyderabadi Dum Biryani").description("Fragrant basmati rice layered with succulent marinated chicken & saffron gravy.").price(new BigDecimal("399")).image("https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800").isVeg(false).spicyLevel(3).prepTime("25 mins").rating(4.9).category(biryani).build(),
            MenuItem.builder().name("Creamy Butter Chicken").description("Tender tandoori chicken simmered in a velvety tomato, butter & cashew gravy.").price(new BigDecimal("379")).image("https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800").isVeg(false).spicyLevel(1).prepTime("20 mins").rating(4.9).category(curry).build(),
            MenuItem.builder().name("Garlic Butter Tandoori Naan").description("Leavened flatbread topped with minced garlic & fresh cilantro, baked in tandoor.").price(new BigDecimal("79")).image("https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800").isVeg(true).spicyLevel(0).prepTime("8 mins").rating(4.8).category(breads).build(),

            MenuItem.builder().name("Warm Sizzling Brownie with Ice Cream").description("Decadent dark chocolate brownie served on a hot skillet with vanilla ice cream.").price(new BigDecimal("249")).image("https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800").isVeg(true).spicyLevel(0).prepTime("10 mins").rating(4.9).category(dessert).build(),
            MenuItem.builder().name("Iced Passion Fruit Mint Cooler").description("Refreshing blend of passion fruit pulp, fresh mint leaves & sparkling soda.").price(new BigDecimal("179")).image("https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800").isVeg(true).spicyLevel(0).prepTime("5 mins").rating(4.7).category(beverage).build()
        );

        menuItemRepository.saveAll(items);
        log.info("Successfully seeded {} initial categories and {} menu items into database.", categoryRepository.count(), menuItemRepository.count());
    }

    private void seedSampleOrders() {
        if (orderRepository.count() > 0) {
            return;
        }

        List<MenuItem> allItems = menuItemRepository.findAll();
        if (allItems.isEmpty()) {
            return;
        }

        log.info("Seeding initial kitchen orders into database...");

        MenuItem item1 = allItems.get(0); // Classic Smash Cheeseburger
        MenuItem item2 = allItems.size() > 3 ? allItems.get(3) : item1; // Margherita Pizza
        MenuItem item3 = allItems.size() > 5 ? allItems.get(5) : item1; // Truffle Pasta

        // Order 1: PENDING
        com.sizzle.backend.model.Order order1 = com.sizzle.backend.model.Order.builder()
                .orderNumber("SZ-1001")
                .customerName("Sarah Connor")
                .customerPhone("+1 555-0144")
                .tableNumber("Table 4")
                .orderType(com.sizzle.backend.model.OrderType.DINE_IN)
                .paymentMethod(com.sizzle.backend.model.PaymentMethod.UPI)
                .orderStatus(com.sizzle.backend.model.OrderStatus.PENDING)
                .subtotal(new BigDecimal("698.00"))
                .taxAmount(new BigDecimal("34.90"))
                .discountAmount(BigDecimal.ZERO)
                .grandTotal(new BigDecimal("732.90"))
                .orderNotes("Extra spicy salsa on the side please")
                .build();

        com.sizzle.backend.model.OrderItem order1Item1 = com.sizzle.backend.model.OrderItem.builder()
                .menuItem(item1)
                .itemName(item1.getName())
                .price(item1.getPrice())
                .quantity(2)
                .subtotal(item1.getPrice().multiply(new BigDecimal("2")))
                .build();

        order1.addItem(order1Item1);
        orderRepository.save(order1);

        // Order 2: PREPARING
        com.sizzle.backend.model.Order order2 = com.sizzle.backend.model.Order.builder()
                .orderNumber("SZ-1002")
                .customerName("Michael Scott")
                .customerPhone("+1 555-0188")
                .tableNumber("Table 2")
                .orderType(com.sizzle.backend.model.OrderType.DINE_IN)
                .paymentMethod(com.sizzle.backend.model.PaymentMethod.CARD)
                .orderStatus(com.sizzle.backend.model.OrderStatus.PREPARING)
                .subtotal(new BigDecimal("948.00"))
                .taxAmount(new BigDecimal("47.40"))
                .discountAmount(BigDecimal.ZERO)
                .grandTotal(new BigDecimal("995.40"))
                .orderNotes("No onions in pizza")
                .build();

        com.sizzle.backend.model.OrderItem order2Item1 = com.sizzle.backend.model.OrderItem.builder()
                .menuItem(item2)
                .itemName(item2.getName())
                .price(item2.getPrice())
                .quantity(1)
                .subtotal(item2.getPrice())
                .build();

        com.sizzle.backend.model.OrderItem order2Item2 = com.sizzle.backend.model.OrderItem.builder()
                .menuItem(item3)
                .itemName(item3.getName())
                .price(item3.getPrice())
                .quantity(1)
                .subtotal(item3.getPrice())
                .build();

        order2.addItem(order2Item1);
        order2.addItem(order2Item2);
        orderRepository.save(order2);

        // Order 3: READY
        com.sizzle.backend.model.Order order3 = com.sizzle.backend.model.Order.builder()
                .orderNumber("SZ-1003")
                .customerName("David Miller")
                .customerPhone("+1 555-0192")
                .tableNumber("Takeaway #1")
                .orderType(com.sizzle.backend.model.OrderType.TAKEAWAY)
                .paymentMethod(com.sizzle.backend.model.PaymentMethod.CASH)
                .orderStatus(com.sizzle.backend.model.OrderStatus.READY)
                .subtotal(new BigDecimal("349.00"))
                .taxAmount(new BigDecimal("17.45"))
                .discountAmount(BigDecimal.ZERO)
                .grandTotal(new BigDecimal("366.45"))
                .orderNotes("Pack extra cutlery")
                .build();

        com.sizzle.backend.model.OrderItem order3Item1 = com.sizzle.backend.model.OrderItem.builder()
                .menuItem(item1)
                .itemName(item1.getName())
                .price(item1.getPrice())
                .quantity(1)
                .subtotal(item1.getPrice())
                .build();

        order3.addItem(order3Item1);
        orderRepository.save(order3);

        log.info("Successfully seeded 3 initial kitchen orders into database.");
    }

    private void seedSampleInventory() {
        if (inventoryRepository.count() > 0) {
            return;
        }

        log.info("Seeding initial inventory items into database...");

        List<com.sizzle.backend.model.InventoryItem> inventoryList = List.of(
            com.sizzle.backend.model.InventoryItem.builder().name("Angus Beef Patties").category("Meat & Poultry").quantity(45.0).unit("kg").minThreshold(10.0).costPerUnit(new BigDecimal("450.00")).supplier("Prime Meats Co.").build(),
            com.sizzle.backend.model.InventoryItem.builder().name("Fresh Buffalo Mozzarella").category("Dairy").quantity(18.5).unit("kg").minThreshold(5.0).costPerUnit(new BigDecimal("320.00")).supplier("Dairy Fresh Ltd.").build(),
            com.sizzle.backend.model.InventoryItem.builder().name("Premium Basmati Rice").category("Grains & Rice").quantity(8.0).unit("kg").minThreshold(15.0).costPerUnit(new BigDecimal("120.00")).supplier("Royal Grains").build(),
            com.sizzle.backend.model.InventoryItem.builder().name("Artisanal Burger Buns").category("Bakery").quantity(120.0).unit("pcs").minThreshold(30.0).costPerUnit(new BigDecimal("15.00")).supplier("Bakehouse Inc.").build(),
            com.sizzle.backend.model.InventoryItem.builder().name("White Truffle Oil").category("Condiments").quantity(2.5).unit("liters").minThreshold(1.0).costPerUnit(new BigDecimal("1200.00")).supplier("Gourmet Imports").build(),
            com.sizzle.backend.model.InventoryItem.builder().name("Fresh San Marzano Tomatoes").category("Produce").quantity(35.0).unit("kg").minThreshold(10.0).costPerUnit(new BigDecimal("80.00")).supplier("Farm Direct").build(),
            com.sizzle.backend.model.InventoryItem.builder().name("San Pellegrino Sparkling Water").category("Beverages").quantity(0.0).unit("pcs").minThreshold(20.0).costPerUnit(new BigDecimal("95.00")).supplier("Beverage Supply Co.").build(),
            com.sizzle.backend.model.InventoryItem.builder().name("Fresh Mint Leaves").category("Produce").quantity(3.0).unit("kg").minThreshold(1.5).costPerUnit(new BigDecimal("150.00")).supplier("Organic Farms").build(),
            com.sizzle.backend.model.InventoryItem.builder().name("Aged Cheddar Cheese Slices").category("Dairy").quantity(12.0).unit("packs").minThreshold(5.0).costPerUnit(new BigDecimal("220.00")).supplier("Dairy Fresh Ltd.").build(),
            com.sizzle.backend.model.InventoryItem.builder().name("Dark Chocolate Compound").category("Baking").quantity(15.0).unit("kg").minThreshold(4.0).costPerUnit(new BigDecimal("380.00")).supplier("Sweet Craft").build()
        );

        inventoryRepository.saveAll(inventoryList);
        log.info("Successfully seeded 10 initial inventory items into database.");
    }
}
