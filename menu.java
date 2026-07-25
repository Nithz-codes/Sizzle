import java.util.ArrayList;

public class menu {

    private ArrayList<fooditem> menuItems;

    // Constructor
    public menu() {

        menuItems = new ArrayList<>();

        loadMenu();

    }

    // Display all available categories
    public void displayCategories() {

        System.out.println("\n==================================================");
        System.out.println("              🍽️ WELCOME TO SIZZLE");
        System.out.println("==================================================");
        System.out.println("What are your taste buds craving today?\n");

        System.out.println("1. 🍔 Burgers & Sandwiches");
        System.out.println("2. 🍕 Pizza");
        System.out.println("3. 🍝 Pasta");
        System.out.println("4. 🍜 Chinese");
        System.out.println("5. 🍛 Biryani");
        System.out.println("6. 🍲 Indian Curry");
        System.out.println("7. 🫓 Breads");
        System.out.println("8. 🍗 Grills & Tandoor");
        System.out.println("9. 🍟 Starters");
        System.out.println("10. 🍰 Desserts");
        System.out.println("11. 🥤 Beverages");
        System.out.println("0. 🔙 Back");

        System.out.println("==================================================");

    }

    // Display items belonging to one category
    public void displayCategoryMenu(String category) {

        System.out.println("\n==================================================");
        System.out.println("           " + category.toUpperCase());
        System.out.println("==================================================");

        System.out.printf("%-5s %-35s %s%n",
                "ID",
                "Item",
                "Price");

        System.out.println("--------------------------------------------------");

        for (fooditem item : menuItems) {

            if (item.getCategory().equalsIgnoreCase(category)) {

                System.out.printf("%-5d %-35s ₹%.2f%n",
                        item.getId(),
                        item.getName(),
                        item.getPrice());

            }

        }

        System.out.println("==================================================");

    }

    // Load all menu items
    private void loadMenu() {

        // ================================
        // Burgers & Sandwiches
        // ================================

        menuItems.add(new fooditem(1, "Classic Burger", "Burger", 120));
        menuItems.add(new fooditem(2, "Cheese Burger", "Burger", 150));
        menuItems.add(new fooditem(3, "Chicken Burger", "Burger", 180));
        menuItems.add(new fooditem(4, "Double Chicken Burger", "Burger", 240));
        menuItems.add(new fooditem(5, "Veg Sandwich", "Burger", 110));
        menuItems.add(new fooditem(6, "Grilled Sandwich", "Burger", 150));
        menuItems.add(new fooditem(7, "Club Sandwich", "Burger", 180));

        // ================================
        // Pizza
        // ================================

        menuItems.add(new fooditem(8, "Margherita Pizza", "Pizza", 250));
        menuItems.add(new fooditem(9, "Farmhouse Pizza", "Pizza", 320));
        menuItems.add(new fooditem(10, "Veg Supreme Pizza", "Pizza", 340));
        menuItems.add(new fooditem(11, "Chicken BBQ Pizza", "Pizza", 390));

        // ================================
        // Pasta
        // ================================

        menuItems.add(new fooditem(12, "White Sauce Pasta", "Pasta", 220));
        menuItems.add(new fooditem(13, "Red Sauce Pasta", "Pasta", 210));
        menuItems.add(new fooditem(14, "Pink Sauce Pasta", "Pasta", 240));
        menuItems.add(new fooditem(15, "Chicken Alfredo Pasta", "Pasta", 310));

        // ================================
        // Chinese
        // ================================

        menuItems.add(new fooditem(16, "Veg Fried Rice", "Chinese", 180));
        menuItems.add(new fooditem(17, "Chicken Fried Rice", "Chinese", 230));
        menuItems.add(new fooditem(18, "Veg Noodles", "Chinese", 170));
        menuItems.add(new fooditem(19, "Chicken Noodles", "Chinese", 240));
        menuItems.add(new fooditem(20, "Gobi Manchurian", "Chinese", 190));
        menuItems.add(new fooditem(21, "Chicken Manchurian", "Chinese", 260));

        // ================================
        // Biryani
        // ================================

        menuItems.add(new fooditem(22, "Veg Biryani", "Biryani", 180));
        menuItems.add(new fooditem(23, "Chicken Biryani", "Biryani", 260));
        menuItems.add(new fooditem(24, "Mutton Biryani", "Biryani", 340));
        menuItems.add(new fooditem(25, "Hyderabadi Chicken Biryani", "Biryani", 320));

        // ================================
        // Indian Curry
        // ================================

        menuItems.add(new fooditem(26, "Paneer Butter Masala", "Indian Curry", 220));
        menuItems.add(new fooditem(27, "Chicken Butter Masala", "Indian Curry", 280));
        menuItems.add(new fooditem(28, "Butter Chicken", "Indian Curry", 300));
                menuItems.add(new fooditem(29, "Kadai Paneer", "Indian Curry", 240));

        // ================================
        // Breads
        // ================================

        menuItems.add(new fooditem(30, "Butter Naan", "Breads", 35));
        menuItems.add(new fooditem(31, "Garlic Naan", "Breads", 50));
        menuItems.add(new fooditem(32, "Butter Roti", "Breads", 25));
        menuItems.add(new fooditem(33, "Parotta", "Breads", 25));
        menuItems.add(new fooditem(34, "Kerala Parotta", "Breads", 35));

        // ================================
        // Grills & Tandoor
        // ================================

        menuItems.add(new fooditem(35, "Chicken 65", "Grill", 240));
        menuItems.add(new fooditem(36, "Dragon Chicken", "Grill", 280));
        menuItems.add(new fooditem(37, "Grill Chicken Half", "Grill", 420));
        menuItems.add(new fooditem(38, "Grill Chicken Full", "Grill", 760));
        menuItems.add(new fooditem(39, "Tandoori Chicken Half", "Grill", 400));
        menuItems.add(new fooditem(40, "Tandoori Chicken Full", "Grill", 720));

        // ================================
        // Starters
        // ================================

        menuItems.add(new fooditem(41, "French Fries", "Starters", 90));
        menuItems.add(new fooditem(42, "Peri Peri Fries", "Starters", 120));
        menuItems.add(new fooditem(43, "Veg Momos", "Starters", 130));
        menuItems.add(new fooditem(44, "Chicken Momos", "Starters", 170));

        // ================================
        // Desserts
        // ================================

        menuItems.add(new fooditem(45, "Chocolate Brownie", "Dessert", 160));
        menuItems.add(new fooditem(46, "Ice Cream Sundae", "Dessert", 180));
        menuItems.add(new fooditem(47, "Gulab Jamun", "Dessert", 90));
        menuItems.add(new fooditem(48, "Chocolate Lava Cake", "Dessert", 190));

        // ================================
        // Beverages
        // ================================

        menuItems.add(new fooditem(49, "Cold Coffee", "Beverage", 110));
        menuItems.add(new fooditem(50, "Coke", "Beverage", 40));
        menuItems.add(new fooditem(51, "Fresh Lime Soda", "Beverage", 70));
        menuItems.add(new fooditem(52, "Chocolate Milkshake", "Beverage", 150));

    }
    public String getCategoryName(int choice) {

    switch (choice) {

        case 1:
            return "Burger";

        case 2:
            return "Pizza";

        case 3:
            return "Pasta";

        case 4:
            return "Chinese";

        case 5:
            return "Biryani";

        case 6:
            return "Indian Curry";

        case 7:
            return "Breads";

        case 8:
            return "Grill";

        case 9:
            return "Starters";

        case 10:
            return "Dessert";

        case 11:
            return "Beverage";

        default:
            return null;

    }

}

    // Display complete menu
    public void displayMenu() {

        System.out.println("\n==============================================================");
        System.out.println("                        SIZZLE MENU");
        System.out.println("==============================================================");

        System.out.printf("%-9s %-18s %-17s %s%n",
                "ID",
                "Item",
                "Category",
                "Price");

        System.out.println("--------------------------------------------------------------");

        for (fooditem item : menuItems) {
            item.displayItem();
        }

        System.out.println("==============================================================");

    }

    // Return food item using ID
    public fooditem getfooditemById(int id) {

        for (fooditem item : menuItems) {

            if (item.getId() == id) {

                return item;

            }

        }

        return null;

    }

    // Return complete menu list
    public ArrayList<fooditem> getMenuItems() {

        return menuItems;

    }

}