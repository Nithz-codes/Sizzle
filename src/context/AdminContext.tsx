import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ReceiptData, Reservation, CustomerRecord, RestaurantSettings, AdminNotification } from '../types';
import { adminApi } from '../services/api';
import { useAuth } from './AuthContext';

export type AdminTab = 'dashboard' | 'orders' | 'reservations' | 'customers' | 'reports' | 'settings' | 'menu';

interface AdminContextType {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;

  // Orders
  orders: ReceiptData[];
  updateOrderStatus: (billNumber: number, status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED') => void;
  addOrder: (order: ReceiptData) => void;

  // Reservations
  reservations: Reservation[];
  updateReservationStatus: (id: string, status: 'CONFIRMED' | 'SEATED' | 'COMPLETED' | 'CANCELLED') => void;
  assignTable: (id: string, tableNumber: string) => void;
  addReservation: (res: Omit<Reservation, 'id' | 'createdAt'>) => void;

  // Customers
  customers: CustomerRecord[];
  isLoadingCustomers: boolean;
  updateCustomerStatus: (id: number, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => Promise<void>;

  // Settings
  settings: RestaurantSettings;
  updateSettings: (newSettings: Partial<RestaurantSettings>) => void;

  // Notifications
  notifications: AdminNotification[];
  toastAlert: AdminNotification | null;
  addNotification: (title: string, message: string, type: 'order' | 'reservation' | 'status' | 'food' | 'info') => void;
  dismissToastAlert: () => void;
  clearNotifications: () => void;

  // Tables availability metadata
  tablesList: { name: string; capacity: number; isOccupied: boolean; currentReservationId?: string }[];
}

const DEFAULT_SETTINGS: RestaurantSettings = {
  restaurantName: 'SIZZLE Gourmet Bistro & Grill',
  contactNumber: '+1 (555) 382-9000',
  email: 'contact@sizzle.com',
  address: '124 Culinary Boulevard, Foodville, NY 10001',
  openingHours: 'Mon - Sun: 11:00 AM - 11:00 PM',
  currencySymbol: '₹',
  gstPercentage: 5,
};

const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'RES-801',
    guestName: 'Sarah Connor',
    email: 'sarah.c@example.com',
    phone: '+1 555-0144',
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    guestCount: 4,
    assignedTable: 'Table 4 (VIP Booth)',
    status: 'CONFIRMED',
    occasion: 'Anniversary Dinner',
    specialRequest: 'Window booth requested with candle setup',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'RES-802',
    guestName: 'Michael Scott',
    email: 'mscott@dundermifflin.com',
    phone: '+1 555-0188',
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    guestCount: 6,
    assignedTable: 'Table 2 (6-Seater)',
    status: 'SEATED',
    occasion: 'Team Celebration',
    specialRequest: 'Needs high chair and extra dessert plates',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'RES-803',
    guestName: 'Priya Sharma',
    email: 'priya.s@techcorp.in',
    phone: '+91 98765 43210',
    date: new Date().toISOString().split('T')[0],
    time: '18:15',
    guestCount: 2,
    assignedTable: 'Table 1 (2-Seater)',
    status: 'COMPLETED',
    occasion: 'Casual Dining',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'RES-804',
    guestName: 'David Miller',
    email: 'david.m@apex.io',
    phone: '+1 555-0192',
    date: new Date().toISOString().split('T')[0],
    time: '21:00',
    guestCount: 8,
    assignedTable: 'Unassigned',
    status: 'CONFIRMED',
    occasion: 'Business Dinner',
    specialRequest: 'Quiet section for discussion',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'RES-805',
    guestName: 'Emma Watson',
    email: 'emma.w@cinema.org',
    phone: '+44 7700 900077',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '19:00',
    guestCount: 3,
    assignedTable: 'Table 6 (Patio)',
    status: 'CONFIRMED',
    occasion: 'Birthday Party',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

const INITIAL_ORDERS: ReceiptData[] = [
  {
    billNumber: 1004,
    dateTime: new Date(Date.now() - 15 * 60000).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
    customer: {
      customerName: 'Sarah Connor',
      phoneNumber: '+1 555-0144',
      paymentMethod: 'UPI',
      upiId: 'sarah@okicici',
    },
    items: [
      {
        foodItem: {
          id: 1,
          name: 'Classic Cheese Burger',
          category: 'Burger',
          price: 249,
          description: 'Juicy grilled beef patty with aged cheddar',
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
          isVeg: false,
        },
        quantity: 2,
        totalPrice: 498,
      },
      {
        foodItem: {
          id: 25,
          name: 'Crispy French Fries',
          category: 'Starters',
          price: 149,
          description: 'Golden salted French fries',
          image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80',
          isVeg: true,
        },
        quantity: 1,
        totalPrice: 149,
      },
    ],
    bill: {
      subtotal: 647,
      gst: 32.35,
      discount: 0,
      grandTotal: 679.35,
    },
    orderStatus: 'PENDING',
    tableNumber: 'Table 4',
    orderNotes: 'Extra spicy salsa sauce on the side please',
  },
  {
    billNumber: 1003,
    dateTime: new Date(Date.now() - 45 * 60000).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
    customer: {
      customerName: 'Michael Scott',
      phoneNumber: '+1 555-0188',
      paymentMethod: 'Card',
      cardHolderName: 'Michael G Scott',
      cardLastFour: '4242',
    },
    items: [
      {
        foodItem: {
          id: 10,
          name: 'Truffle Mushroom Pizza',
          category: 'Pizza',
          price: 499,
          description: 'Wild mushrooms, truffle oil, and creamy mozzarella',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
          isVeg: true,
        },
        quantity: 2,
        totalPrice: 998,
      },
      {
        foodItem: {
          id: 30,
          name: 'Cold Brew Iced Coffee',
          category: 'Beverage',
          price: 179,
          description: 'Smooth cold-brewed espresso coffee',
          image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=80',
          isVeg: true,
        },
        quantity: 2,
        totalPrice: 358,
      },
    ],
    bill: {
      subtotal: 1356,
      gst: 61.02,
      discount: 135.6,
      grandTotal: 1281.42,
    },
    orderStatus: 'PREPARING',
    tableNumber: 'Table 2',
  },
  {
    billNumber: 1002,
    dateTime: new Date(Date.now() - 90 * 60000).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
    customer: {
      customerName: 'Priya Sharma',
      phoneNumber: '+91 98765 43210',
      paymentMethod: 'Cash',
      amountReceived: 1000,
      changeReturned: 165,
    },
    items: [
      {
        foodItem: {
          id: 15,
          name: 'Hyderabadi Chicken Biryani',
          category: 'Biryani',
          price: 389,
          description: 'Slow-cooked aromatic basmati rice with spiced chicken',
          image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
          isVeg: false,
        },
        quantity: 2,
        totalPrice: 778,
      },
    ],
    bill: {
      subtotal: 778,
      gst: 38.9,
      discount: 0,
      grandTotal: 816.9,
    },
    orderStatus: 'READY',
    tableNumber: 'Table 1',
  },
  {
    billNumber: 1001,
    dateTime: new Date(Date.now() - 180 * 60000).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
    customer: {
      customerName: 'John Customer',
      phoneNumber: '+1 555-0100',
      paymentMethod: 'Card',
      cardHolderName: 'John Customer',
      cardLastFour: '9081',
    },
    items: [
      {
        foodItem: {
          id: 20,
          name: 'Tandoori Malai Tikka',
          category: 'Grill',
          price: 349,
          description: 'Charcoal grilled chicken tikka in creamy marinade',
          image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&auto=format&fit=crop&q=80',
          isVeg: false,
        },
        quantity: 1,
        totalPrice: 349,
      },
    ],
    bill: {
      subtotal: 349,
      gst: 17.45,
      discount: 0,
      grandTotal: 366.45,
    },
    orderStatus: 'DELIVERED',
    tableNumber: 'Delivery #4',
  },
];

const TABLES_CONFIG = [
  { name: 'Table 1 (2-Seater)', capacity: 2, isOccupied: true, currentReservationId: 'RES-803' },
  { name: 'Table 2 (6-Seater)', capacity: 6, isOccupied: true, currentReservationId: 'RES-802' },
  { name: 'Table 3 (4-Seater)', capacity: 4, isOccupied: false },
  { name: 'Table 4 (VIP Booth)', capacity: 4, isOccupied: true, currentReservationId: 'RES-801' },
  { name: 'Table 5 (4-Seater)', capacity: 4, isOccupied: false },
  { name: 'Table 6 (Patio)', capacity: 4, isOccupied: false },
  { name: 'Table 7 (2-Seater)', capacity: 2, isOccupied: false },
  { name: 'Table 8 (Private Dining)', capacity: 10, isOccupied: false },
  { name: 'Table 9 (Bar Top 1)', capacity: 2, isOccupied: false },
  { name: 'Table 10 (Bar Top 2)', capacity: 2, isOccupied: false },
  { name: 'Table 11 (Garden Table)', capacity: 4, isOccupied: false },
  { name: 'Table 12 (Corner Booth)', capacity: 6, isOccupied: false },
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Orders State
  const [orders, setOrders] = useState<ReceiptData[]>(() => {
    const saved = localStorage.getItem('sizzle_admin_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Save orders to localStorage
  useEffect(() => {
    localStorage.setItem('sizzle_admin_orders', JSON.stringify(orders));
  }, [orders]);

  // Reservations State
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('sizzle_admin_reservations');
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  useEffect(() => {
    localStorage.setItem('sizzle_admin_reservations', JSON.stringify(reservations));
  }, [reservations]);

  // Settings State
  const [settings, setSettings] = useState<RestaurantSettings>(() => {
    const saved = localStorage.getItem('sizzle_admin_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('sizzle_admin_settings', JSON.stringify(settings));
  }, [settings]);

  // Customers State (Fetched from Spring Boot backend)
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState<boolean>(false);

  // Notifications State
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [toastAlert, setToastAlert] = useState<AdminNotification | null>(null);

  const addNotification = (
    title: string,
    message: string,
    type: 'order' | 'reservation' | 'status' | 'food' | 'info'
  ) => {
    const newNotif: AdminNotification = {
      id: 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    setNotifications((prev) => [newNotif, ...prev.slice(0, 49)]);
    setToastAlert(newNotif);

    setTimeout(() => {
      setToastAlert((curr) => (curr?.id === newNotif.id ? null : curr));
    }, 4500);
  };

  const dismissToastAlert = () => setToastAlert(null);
  const clearNotifications = () => setNotifications([]);

  // Fetch Customers from Spring Boot Backend `/api/admin/users`
  const fetchCustomersFromBackend = async () => {
    if (!isAdmin) return;
    setIsLoadingCustomers(true);
    try {
      const res = await adminApi.getAllUsers();
      if (res.success && Array.isArray(res.data)) {
        const mapped: CustomerRecord[] = res.data.map((u: any) => ({
          id: u.id,
          name: u.name || 'User #' + u.id,
          email: u.email,
          phone: u.phone || 'N/A',
          address: u.address,
          avatarUrl: u.avatarUrl,
          totalOrders: Math.floor(Math.random() * 8) + 1,
          totalReservations: Math.floor(Math.random() * 4),
          totalSpent: Math.floor(Math.random() * 4000) + 500,
          accountStatus: (u.accountStatus as any) || 'ACTIVE',
          createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent',
        }));
        setCustomers(mapped);
      }
    } catch (err) {
      console.warn('Backend API not reached for customers, using fallback seed customers:', err);
      // Fallback seed list if backend not yet logged in as Admin token
      setCustomers([
        {
          id: 1,
          name: 'John Customer',
          email: 'customer@sizzle.com',
          phone: '+1 555-0100',
          totalOrders: 6,
          totalReservations: 2,
          totalSpent: 3420,
          accountStatus: 'ACTIVE',
          createdAt: '2026-01-15',
        },
        {
          id: 2,
          name: 'Sarah Connor',
          email: 'sarah.c@example.com',
          phone: '+1 555-0144',
          totalOrders: 4,
          totalReservations: 3,
          totalSpent: 2890,
          accountStatus: 'ACTIVE',
          createdAt: '2026-02-01',
        },
        {
          id: 3,
          name: 'Michael Scott',
          email: 'mscott@dundermifflin.com',
          phone: '+1 555-0188',
          totalOrders: 8,
          totalReservations: 4,
          totalSpent: 6540,
          accountStatus: 'ACTIVE',
          createdAt: '2026-02-10',
        },
        {
          id: 4,
          name: 'Priya Sharma',
          email: 'priya.s@techcorp.in',
          phone: '+91 98765 43210',
          totalOrders: 3,
          totalReservations: 1,
          totalSpent: 1950,
          accountStatus: 'ACTIVE',
          createdAt: '2026-03-05',
        },
        {
          id: 5,
          name: 'David Miller',
          email: 'david.m@apex.io',
          phone: '+1 555-0192',
          totalOrders: 5,
          totalReservations: 2,
          totalSpent: 4120,
          accountStatus: 'INACTIVE',
          createdAt: '2026-03-12',
        },
      ]);
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  useEffect(() => {
    fetchCustomersFromBackend();
  }, [isAdmin]);

  // Update Customer Status via backend API
  const updateCustomerStatus = async (id: number, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => {
    try {
      await adminApi.updateUserStatus(id, status);
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, accountStatus: status } : c))
      );
      addNotification(
        'Customer Status Updated',
        `Customer #${id} status changed to ${status}`,
        'status'
      );
    } catch (err: any) {
      // Local optimistic fallback if backend fails
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, accountStatus: status } : c))
      );
      addNotification(
        'Customer Status Updated',
        `Updated status to ${status}`,
        'status'
      );
    }
  };

  // Orders Actions
  const updateOrderStatus = (
    billNumber: number,
    status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED'
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.billNumber === billNumber ? { ...o, orderStatus: status, updatedAt: new Date().toLocaleTimeString() } : o))
    );
    addNotification(
      'Order Status Updated',
      `Order #${billNumber} moved to ${status}`,
      'order'
    );
  };

  const addOrder = (order: ReceiptData) => {
    const enrichedOrder: ReceiptData = {
      ...order,
      orderStatus: order.orderStatus || 'PENDING',
    };
    setOrders((prev) => [enrichedOrder, ...prev]);
    addNotification(
      'New Order Placed!',
      `Order #${order.billNumber} received for ₹${order.bill.grandTotal.toFixed(2)}`,
      'order'
    );
  };

  // Reservations Actions
  const updateReservationStatus = (
    id: string,
    status: 'CONFIRMED' | 'SEATED' | 'COMPLETED' | 'CANCELLED'
  ) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    addNotification(
      'Reservation Updated',
      `Reservation ${id} changed to ${status}`,
      'reservation'
    );
  };

  const assignTable = (id: string, tableNumber: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, assignedTable: tableNumber } : r))
    );
    addNotification(
      'Table Assigned',
      `Reservation ${id} assigned to ${tableNumber}`,
      'reservation'
    );
  };

  const addReservation = (resData: Omit<Reservation, 'id' | 'createdAt'>) => {
    const newRes: Reservation = {
      ...resData,
      id: 'RES-' + (800 + reservations.length + 1),
      createdAt: new Date().toISOString(),
    };
    setReservations((prev) => [newRes, ...prev]);
    addNotification(
      'New Reservation Added',
      `Table reserved for ${resData.guestName} (${resData.guestCount} Guests) on ${resData.date}`,
      'reservation'
    );
  };

  // Settings Action
  const updateSettings = (newSettings: Partial<RestaurantSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addNotification(
      'Settings Saved',
      'Restaurant configuration updated successfully',
      'info'
    );
  };

  return (
    <AdminContext.Provider
      value={{
        activeTab,
        setActiveTab,
        orders,
        updateOrderStatus,
        addOrder,
        reservations,
        updateReservationStatus,
        assignTable,
        addReservation,
        customers,
        isLoadingCustomers,
        updateCustomerStatus,
        settings,
        updateSettings,
        notifications,
        toastAlert,
        addNotification,
        dismissToastAlert,
        clearNotifications,
        tablesList: TABLES_CONFIG,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
