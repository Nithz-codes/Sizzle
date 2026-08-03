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
  orderStatus?: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  tableNumber?: string;
  orderNotes?: string;
  updatedAt?: string;
}

export interface CategoryOption {
  id: number;
  name: string;
  displayName: string;
  icon: string;
  description: string;
  itemCount: number;
}

export interface Reservation {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guestCount: number;
  assignedTable: string;
  status: 'CONFIRMED' | 'SEATED' | 'COMPLETED' | 'CANCELLED';
  occasion?: string;
  specialRequest?: string;
  createdAt: string;
}

export interface CustomerRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  avatarUrl?: string;
  totalOrders: number;
  totalReservations: number;
  totalSpent: number;
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export interface RestaurantSettings {
  restaurantName: string;
  contactNumber: string;
  email: string;
  address: string;
  openingHours: string;
  currencySymbol: string;
  gstPercentage: number;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'reservation' | 'status' | 'food' | 'info';
  timestamp: string;
  read: boolean;
}
