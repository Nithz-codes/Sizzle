public class fooditem {

    private int id;
    private String name;
    private String category;
    private double price;

    // Constructor
    public fooditem(int id, String name, String category, double price) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
    }

    // Getter Methods
    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public double getPrice() {
        return price;
    }

    // Display one menu item
    public void displayItem() {
        System.out.printf("%-3d %-25s %-15s ₹%.2f%n",
                id,
                name,
                category,
                price);
    }
}