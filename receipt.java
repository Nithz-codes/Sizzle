import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class receipt {

    private static int billNumber = 1001;

    public void printReceipt(customer customer, cart cart, bill bill) {

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

        System.out.println();
        System.out.println("==============================================================");
        System.out.println("                          SIZZLE");
        System.out.println("                  Taste That Brings People Together");
        System.out.println("==============================================================");

        System.out.println("Bill No        : " + billNumber++);
        System.out.println("Date & Time    : " +
                LocalDateTime.now().format(formatter));

        System.out.println("Customer Name  : " +
                customer.getCustomerName());

        System.out.println("Phone Number   : " +
                customer.getPhoneNumber());

        System.out.println("Payment Method : " +
                customer.getPaymentMethod());

        System.out.println("--------------------------------------------------------------");

        System.out.printf("%-4s %-25s %-8s %-10s%n",
                "ID",
                "Item",
                "Qty",
                "Amount");

        System.out.println("--------------------------------------------------------------");

        for (cartitem item : cart.getcartitems()) {

            System.out.printf("%-4d %-25s %-8d ₹%.2f%n",
                    item.getfooditem().getId(),
                    item.getfooditem().getName(),
                    item.getQuantity(),
                    item.getTotalPrice());

        }

        System.out.println("--------------------------------------------------------------");

        System.out.printf("Subtotal              : ₹%.2f%n",
                bill.getSubtotal());

        System.out.printf("GST (5%%)              : ₹%.2f%n",
                bill.getGST());

        System.out.printf("Discount              : ₹%.2f%n",
                bill.getDiscount());

        System.out.println("--------------------------------------------------------------");

        System.out.printf("Grand Total           : ₹%.2f%n",
                bill.getGrandTotal());

        System.out.println("==============================================================");
        System.out.println("          Thank You For Dining With Sizzle!");
        System.out.println("               Visit Again Soon ❤️");
        System.out.println("==============================================================");

        cart.clearCart();
    }
}
