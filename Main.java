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

        int id;
        int quantity;
        char more = 'N';

        do {

            menu.displayMenu();

            System.out.print("\nEnter Item ID : ");
            id = sc.nextInt();

            fooditem item = menu.getfooditemById(id);

            if (item == null) {

                System.out.println("Invalid Item ID.");

                continue;

            }

            System.out.print("Enter Quantity : ");
            quantity = sc.nextInt();

            if (quantity <= 0) {

                System.out.println("Invalid Quantity.");

                continue;

            }

            cart.addItem(item, quantity);

            System.out.print("\nAdd More Items? (Y/N) : ");

            more = sc.next().toUpperCase().charAt(0);

        } while (more == 'Y');

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