import java.util.Scanner;

public class Main {

    static Scanner sc = new Scanner(System.in);

    static menu menu = new menu();
    static cart cart = new cart();
    static receipt receipt = new receipt();

    public static void main(String[] args) {

        int choice;

        System.out.println("====================================================");
        System.out.println("                 WELCOME TO SIZZLE");
        System.out.println("         Taste That Brings People Together");
        System.out.println("====================================================");

        do {

            System.out.println("\n============== MAIN MENU ==============");
            System.out.println("1. View Menu");
            System.out.println("2. Order Food");
            System.out.println("3. View Cart");
            System.out.println("4. Remove Item");
            System.out.println("5. Update Quantity");
            System.out.println("6. Checkout");
            System.out.println("7. Exit");
            System.out.print("Enter your choice : ");

            choice = sc.nextInt();

            switch (choice) {

                case 1:
                    menu.displayMenu();
                    break;

                case 2:
                    orderFood();
                    break;

                case 3:
                    cart.viewCart();
                    break;

                case 4:

                    if (cart.getcartitems().isEmpty()) {

                        System.out.println("Your cart is empty.");
                        break;

                    }

                    cart.viewCart();

                    System.out.print("\nEnter Item ID to Remove : ");
                    int removeId = sc.nextInt();

                    cart.removeItem(removeId);

                    break;

                case 5:

                    if (cart.getcartitems().isEmpty()) {

                        System.out.println("Your cart is empty.");
                        break;

                    }

                    cart.viewCart();

                    System.out.print("\nEnter Item ID : ");
                    int updateId = sc.nextInt();

                    System.out.print("Enter New Quantity : ");
                    int newQty = sc.nextInt();

                    if (newQty <= 0) {

                        System.out.println("Invalid Quantity.");

                    } else {

                        cart.updateQuantity(updateId, newQty);

                    }

                    break;

                case 6:
                    checkout();
                    break;

                case 7:

                    System.out.println("\n=====================================");
                    System.out.println("Thank You For Visiting Sizzle!");
                    System.out.println("Have a Wonderful Day!");
                    System.out.println("=====================================");
                    break;

                default:

                    System.out.println("Invalid Choice.");

            }

        } while (choice != 7);

    }

    public static void orderFood() {

    int categoryChoice;
    String category;
    int id;
    int quantity;

    while (true) {

        menu.displayCategories();

        System.out.print("Choose Category (0 to return) : ");
        categoryChoice = sc.nextInt();

        if (categoryChoice == 0) {

            return;

        }

        category = menu.getCategoryName(categoryChoice);

        if (category == null) {

            System.out.println("\nInvalid Category! Please try again.\n");
            continue;

        }

        boolean stayInCategory = true;

        while (stayInCategory) {

            menu.displayCategoryMenu(category);

            System.out.print("\nEnter Item ID : ");
            id = sc.nextInt();

            fooditem item = menu.getfooditemById(id);

            if (item == null || !item.getCategory().equalsIgnoreCase(category)) {

                System.out.println("\nInvalid Item! Please choose an item from the displayed category.");

                continue;

            }

            System.out.print("Enter Quantity : ");
            quantity = sc.nextInt();

            if (quantity <= 0) {

                System.out.println("\nQuantity must be greater than zero.");

                continue;

            }
            cart.addItem(item, quantity);
           /*  cart.addItem(item, quantity);

            System.out.println("\n======================================");
            System.out.println("✅ " + quantity + " x " + item.getName() + " added to cart.");
            System.out.println("======================================");

            System.out.println("\nWhat would you like to do next?");
            System.out.println("1. Continue in " + category);
            System.out.println("2. Browse Another Category");
            System.out.println("3. View Cart");
            System.out.println("4. Return to Main Menu");
            System.out.print("Enter Choice : ");
            */
            System.out.println("\n======================================");
            System.out.println("✓ " + item.getName() + " x" + quantity + " added to cart!");
            System.out.println();
            System.out.println("Cart Items    : " + cart.getcartitems().size());
            System.out.printf("Current Total : ₹%.2f%n", cart.getSubtotal());
            System.out.println("======================================");

            System.out.println("\nWhat would you like to do next?");
            System.out.println("1. Continue Ordering");
            System.out.println("2. Browse Another Category");
            System.out.println("3. View Cart");
            System.out.println("4. Proceed to Checkout");
            System.out.println("5. Return to Main Menu");
            System.out.print("Enter Choice : ");

            int nextChoice = sc.nextInt();

            switch (nextChoice) {

                case 1:
                    // Continue in the same category
                    break;

                case 2:
                    // Browse another category
                    stayInCategory = false;
                    break;

                case 3:

                    cart.viewCart();

                    System.out.println("\nWhat would you like to do next?");
                    System.out.println("1. Continue Ordering");
                    System.out.println("2. Browse Another Category");
                    System.out.println("3. Proceed to Checkout");
                    System.out.println("4. Return to Main Menu");
                    System.out.print("Enter Choice : ");

                    int cartChoice = sc.nextInt();

                    switch (cartChoice) {

                        case 1:
                            break;

                        case 2:
                            stayInCategory = false;
                            break;

                        case 3:
                            checkout();
                            return;

                        case 4:
                            return;

                        default:
                            System.out.println("\nInvalid Choice! Continuing Order...");
                            break;

                    }

                    break;

                case 4:
                    checkout();
                    return;

                case 5:
                    return;

                default:
                    System.out.println("\nInvalid Choice! Please try again.");
                    break;

            }

        }

    }

}
       

    
        public static void checkout() {

        if (cart.getcartitems().isEmpty()) {

            System.out.println("\nYour cart is empty.");
            System.out.println("Please order something first.");

            return;

        }

        sc.nextLine(); // Clear buffer

        System.out.println("\n============== CHECKOUT ==============");

        System.out.print("Enter Customer Name : ");
        String customerName = sc.nextLine();

        System.out.print("Enter Phone Number : ");
        String phoneNumber = sc.nextLine();

        int paymentChoice;

        String paymentMethod = "";

        do {

            System.out.println("\nSelect Payment Method");
            System.out.println("1. Cash");
            System.out.println("2. Card");
            System.out.println("3. UPI");
            System.out.print("Enter Choice : ");

            paymentChoice = sc.nextInt();

            switch (paymentChoice) {

                case 1:
                    paymentMethod = "Cash";
                    break;

                case 2:
                    paymentMethod = "Card";
                    break;

                case 3:
                    paymentMethod = "UPI";
                    break;

                default:
                    System.out.println("Invalid Choice. Please try again.");

            }

        } while (paymentChoice < 1 || paymentChoice > 3);

        customer customer = new customer(
                customerName,
                phoneNumber,
                paymentMethod);

        bill bill = new bill(cart);

        System.out.println("\nGenerating Bill...");

        bill.printbillSummary();

        System.out.print("\nWould you like to print the receipt? (Y/N) : ");

        char printReceipt = sc.next().toUpperCase().charAt(0);

        if (printReceipt == 'Y') {

            receipt.printReceipt(customer, cart, bill);

        } else {

            System.out.println("\nOrder Placed Successfully!");
            System.out.println("Thank You For Choosing Sizzle!");

            cart.clearCart();

        }

    }

}