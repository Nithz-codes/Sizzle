export interface FoodItem {
  id: number;
  name: string;
  category: string; // "Burger" | "Pizza" | "Pasta" | "Chinese" | "Biryani" | "Indian Curry" | "Breads" | "Grill" | "Starters" | "Dessert" | "Beverage"
  price: number;
  description: string;
  image: string;
  isVeg: boolean;
  spicyLevel?: number; // 0: None, 1: Mild, 2: Medium, 3: Spicy
  prepTime?: string;
  rating?: number;
  tags?: string[];
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
  totalPrice: number;
}

export interface Customer {
  customerName: string;
  phoneNumber: string;
  paymentMethod: 'Cash' | 'Card' | 'UPI';
  amountReceived?: number;
  changeReturned?: number;
  cardHolderName?: string;
  cardLastFour?: string;
  upiId?: string;
}

export interface BillSummary {
  subtotal: number;
  gst: number; // 5%
  discount: number; // 10% if subtotal >= 1000
  grandTotal: number;
}

export interface ReceiptData {
  billNumber: number;
  dateTime: string;
  customer: Customer;
  items: CartItem[];
  bill: BillSummary;
}

export interface CategoryOption {
  id: number;
  name: string; // Internal name matching Java menu.getCategoryName()
  displayName: string;
  icon: string;
  description: string;
  itemCount: number;
}
