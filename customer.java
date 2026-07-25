public class customer {

    private String customerName;
    private String phoneNumber;
    private String paymentMethod;

    // Constructor
    public customer(String customerName, String phoneNumber, String paymentMethod) {
        this.customerName = customerName;
        this.phoneNumber = phoneNumber;
        this.paymentMethod = paymentMethod;
    }

    // Getters
    public String getCustomerName() {
        return customerName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    // Display Customer Details
    public void displayCustomer() {
        System.out.println("Customer Name : " + customerName);
        System.out.println("Phone Number  : " + phoneNumber);
        System.out.println("Payment Mode  : " + paymentMethod);
    }
}