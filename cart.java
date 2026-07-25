import java.util.ArrayList;

public class cart {

    private ArrayList<cartitem> cartitems;

    public cart() {
        cartitems = new ArrayList<>();
    }

    // Add item to cart
    public void addItem(fooditem fooditem, int quantity) {

        for (cartitem item : cartitems) {

            if (item.getfooditem().getId() == fooditem.getId()) {

                item.setQuantity(item.getQuantity() + quantity);

                System.out.println(fooditem.getName() + " quantity updated!");

                return;
            }

        }

        cartitems.add(new cartitem(fooditem, quantity));

        System.out.println(fooditem.getName() + " added to cart.");

    }

    // View Cart
    public void viewCart() {

        if (cartitems.isEmpty()) {

            System.out.println("\nYour cart is empty.");
            return;

        }

        System.out.println("\n================ YOUR CART ================");

        System.out.printf("%-4s %-25s %-8s %-10s%n",
                "ID",
                "Item",
                "Qty",
                "Amount");

        System.out.println("-------------------------------------------");

        for (cartitem item : cartitems) {

            System.out.printf("%-4d %-25s %-8d ₹%.2f%n",
                    item.getfooditem().getId(),
                    item.getfooditem().getName(),
                    item.getQuantity(),
                    item.getTotalPrice());

        }

        System.out.println("-------------------------------------------");

        System.out.printf("Subtotal : ₹%.2f%n", getSubtotal());

    }

    // Remove Item
    public void removeItem(int id) {

        for (int i = 0; i < cartitems.size(); i++) {

            if (cartitems.get(i).getfooditem().getId() == id) {

                System.out.println(cartitems.get(i).getfooditem().getName()
                        + " removed.");

                cartitems.remove(i);

                return;

            }

        }

        System.out.println("Item not found.");

    }

    // Update Quantity
    public void updateQuantity(int id, int quantity) {

        for (cartitem item : cartitems) {

            if (item.getfooditem().getId() == id) {

                item.setQuantity(quantity);

                System.out.println("Quantity Updated.");

                return;

            }

        }

        System.out.println("Item not found.");

    }

    // Calculate subtotal
    public double getSubtotal() {

        double total = 0;

        for (cartitem item : cartitems) {

            total += item.getTotalPrice();

        }

        return total;

    }

    // Empty cart
    public void clearCart() {

        cartitems.clear();

    }

    // Return cart items
    public ArrayList<cartitem> getcartitems() {

        return cartitems;

    }

}