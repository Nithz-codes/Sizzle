import java.util.ArrayList;

public class menu {

    private ArrayList<fooditem> menuItems;

    // Constructor
    public menu() {

        menuItems = new ArrayList<>();

        loadMenu();

    }

    // Add all menu items
    private void loadMenu() {

        menuItems.add(new fooditem(1, "Classic Burger", "Burger", 120));
        menuItems.add(new fooditem(2, "Cheese Burger", "Burger", 150));
        menuItems.add(new fooditem(3, "Margherita Pizza", "Pizza", 250));
        menuItems.add(new fooditem(4, "Farmhouse Pizza", "Pizza", 320));
        menuItems.add(new fooditem(5, "White Sauce Pasta", "Pasta", 220));
        menuItems.add(new fooditem(6, "Red Sauce Pasta", "Pasta", 210));
        menuItems.add(new fooditem(7, "Grilled Sandwich", "Sandwich", 150));
        menuItems.add(new fooditem(8, "French Fries", "Snacks", 90));
        menuItems.add(new fooditem(9, "Veg Momos", "Snacks", 130));
        menuItems.add(new fooditem(10, "Chicken Wrap", "Wrap", 180));
        menuItems.add(new fooditem(11, "Cold Coffee", "Beverage", 110));
        menuItems.add(new fooditem(12, "Coke", "Beverage", 40));
        menuItems.add(new fooditem(13, "Chocolate Brownie", "Dessert", 160));
        menuItems.add(new fooditem(14, "Ice Cream Sundae", "Dessert", 180));

    }

    // Display complete menu
    public void displayMenu() {

        System.out.println("\n==============================================================");
        System.out.println("                       SIZZLE MENU");
        System.out.println("==============================================================");

        System.out.printf("%-3s %-25s %-15s %s%n",
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

    // Return a food item using ID
    public fooditem getfooditemById(int id) {

        for (fooditem item : menuItems) {

            if (item.getId() == id) {
                return item;
            }

        }

        return null;

    }

    // Return complete menu
    public ArrayList<fooditem> getMenuItems() {
        return menuItems;
    }

}