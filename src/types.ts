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
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
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
  paymentStatus?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  transactionId?: string;
  tableNumber?: string;
  orderNotes?: string;
  updatedAt?: string;
}

export interface PaymentTransaction {
  id: number;
  transactionId: string;
  gatewayOrderId?: string;
  orderId: number;
  orderNumber?: string;
  amount: number;
  currency: string;
  paymentMethod: 'CASH' | 'CARD' | 'UPI';
  gatewayProvider: 'RAZORPAY' | 'STRIPE' | 'UPI_DIRECT' | 'CASH_ON_DELIVERY';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  cardLastFour?: string;
  upiId?: string;
  createdAt?: string;
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

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  costPerUnit: number;
  totalValue: number;
  supplier?: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  lastRestockedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DailyRevenueData {
  date: string;
  revenue: number;
  orderCount: number;
}

export interface TopDishData {
  menuItemId: number;
  dishName: string;
  categoryName: string;
  quantitySold: number;
  totalRevenue: number;
  imageUrl?: string;
}

export interface CategorySalesData {
  categoryName: string;
  itemsSold: number;
  totalRevenue: number;
  percentageShare: number;
}

export interface HourlyDemandData {
  hour: number;
  orderCount: number;
  totalRevenue: number;
}

export interface AnalyticsOverviewData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  pendingOrders: number;
  preparingOrders: number;
  completedOrders: number;
  dailyTrends: DailyRevenueData[];
}

export type FitnessPreset = 'HIGH_PROTEIN' | 'KETO' | 'LOW_CALORIE' | 'BALANCED';

export interface MacroGoalRequest {
  targetCalories: number;
  minProtein: number;
  dietaryFilter: 'All' | 'Veg' | 'Non-Veg';
  preset?: FitnessPreset;
}

export interface MacroMealCombo {
  id: string;
  title: string;
  badge: string;
  matchScore: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalPrice: number;
  items: { foodItem: FoodItem; quantity: number }[];
  explanation: string;
}

export interface MacroMealResponse {
  preset: FitnessPreset;
  matchScore: number; // 0..100%
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalPrice: number;
  items: { foodItem: FoodItem; quantity: number }[];
  explanation: string;
  topCombos: MacroMealCombo[];
}

export type MoodOccasion =
  | 'RAINY_DAY'
  | 'POST_WORKOUT'
  | 'LATE_NIGHT'
  | 'ROMANTIC_DATE'
  | 'BUSY_WORKDAY'
  | 'FESTIVE_PARTY';

export interface MoodFeastCombo {
  id: string;
  title: string;
  badge: string;
  vibeTag: string;
  totalCalories: number;
  totalProtein: number;
  totalPrice: number;
  items: { foodItem: FoodItem; quantity: number }[];
  chefQuote: string;
}

export interface MoodFeastResponse {
  mood: MoodOccasion;
  headline: string;
  combos: MoodFeastCombo[];
}

export type TasteBudget = 'UNDER_250' | 'MID_RANGE' | 'PREMIUM';
export type TasteVibe = 'WILD_SURPRISE' | 'FAST_FOOD' | 'ROYAL_INDIAN' | 'ITALIAN_GOURMET';

export interface MysteryBoxItem {
  foodItem: FoodItem;
  quantity: number;
}

export interface MysteryBoxResponse {
  boxId: string;
  boxTitle: string;
  boxBadge: string;
  budgetPreset: TasteBudget;
  vibePreset: TasteVibe;
  matchScore: number;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  totalCalories: number;
  totalProtein: number;
  items: MysteryBoxItem[];
  mysteryDescription: string;
}

export interface UsualFeastItem {
  foodItem: FoodItem;
  quantity: number;
  timesOrdered: number;
}

export interface UsualFeastResponse {
  isNewUser: boolean;
  timeBadge: string;
  feastTitle: string;
  totalOrdersCount: number;
  totalPrice: number;
  totalCalories: number;
  totalProtein: number;
  items: UsualFeastItem[];
  chefGreeting: string;
}

export type OrderReceipt = ReceiptData;
