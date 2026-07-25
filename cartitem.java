public class cartitem {

    private fooditem fooditem;
    private int quantity;

    // Constructor
    public cartitem(fooditem fooditem, int quantity) {
        this.fooditem = fooditem;
        this.quantity = quantity;
    }

    public fooditem getfooditem() {
        return fooditem;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getTotalPrice() {
        return fooditem.getPrice() * quantity;
    }
}
