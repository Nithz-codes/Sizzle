public class bill {

    private cart cart;

    private final double GST_RATE = 0.05;

    private final double DISCOUNT_RATE = 0.10;

    public bill(cart cart) {

        this.cart = cart;

    }

    public double getSubtotal() {

        return cart.getSubtotal();

    }

    public double getGST() {

        return getSubtotal() * GST_RATE;

    }

    public double getDiscount() {

        if (getSubtotal() >= 1000) {

            return getSubtotal() * DISCOUNT_RATE;

        }

        return 0;

    }

    public double getGrandTotal() {

        return getSubtotal()
                + getGST()
                - getDiscount();

    }

    public void printbillSummary() {

        System.out.println("\n============= bill =============");

        System.out.printf("Subtotal      : ₹%.2f%n",
                getSubtotal());

        System.out.printf("GST (5%%)      : ₹%.2f%n",
                getGST());

        System.out.printf("Discount      : ₹%.2f%n",
                getDiscount());

        System.out.println("-------------------------------");

        System.out.printf("Grand Total   : ₹%.2f%n",
                getGrandTotal());

    }

}