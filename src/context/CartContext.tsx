import React, { createContext, useContext, useState, useMemo } from 'react';
import { FoodItem, CartItem, Customer, BillSummary, ReceiptData } from '../types';
import { MENU_ITEMS } from '../data/menuData';

export interface ToastNotification {
  foodItemId: number;
  itemName: string;
  quantityAdded: number;
  cartTotal: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addItem: (foodItem: FoodItem, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  gst: number;
  discount: number;
  grandTotal: number;
  billSummary: BillSummary;
  
  // Navigation & UI filters
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  dietaryFilter: 'All' | 'Veg' | 'Non-Veg';
  setDietaryFilter: (filter: 'All' | 'Veg' | 'Non-Veg') => void;
  quickFilter: string;
  setQuickFilter: (filter: string) => void;
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  priceFilter: string;
  setPriceFilter: (price: string) => void;
  resetFilters: () => void;
  highlightedItemId: number | null;
  setHighlightedItemId: (id: number | null) => void;
  
  // Modal / Drawer controls
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  
  // Checkout & Receipts
  customer: Customer | null;
  activeReceipt: ReceiptData | null;
  setActiveReceipt: (receipt: ReceiptData | null) => void;
  pastReceipts: ReceiptData[];
  placeOrder: (customer: Customer) => ReceiptData;
  
  // Toast notifications
  toastMessage: string | null;
  toastInfo: ToastNotification | null;
  showToast: (msg: string) => void;
  undoLastAction: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeCategory, _setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<'All' | 'Veg' | 'Non-Veg'>('All');
  const [quickFilter, setQuickFilter] = useState<string>('All');
  const [categoryFilter, _setCategoryFilter] = useState<string>('All');
  const [priceFilter, _setPriceFilter] = useState<string>('All Prices');
  const [highlightedItemId, setHighlightedItemId] = useState<number | null>(null);

  // Sync category filter and clear search query when browsing by category
  const setCategoryFilter = (cat: string) => {
    _setCategoryFilter(cat);
    if (cat === 'Veg') {
      setDietaryFilter('Veg');
      _setActiveCategory('All');
    } else if (cat === 'Non-Veg') {
      setDietaryFilter('Non-Veg');
      _setActiveCategory('All');
    } else if (cat === 'Burgers' || cat === 'Burger') {
      _setActiveCategory('Burger');
      setDietaryFilter('All');
    } else if (cat === 'Grills & Tandoor' || cat === 'Grill') {
      _setActiveCategory('Grill');
      setDietaryFilter('All');
    } else if (cat === 'All') {
      _setActiveCategory('All');
      setDietaryFilter('All');
    } else {
      _setActiveCategory(cat);
      setDietaryFilter('All');
    }

    if (cat !== 'All') {
      setSearchQuery('');
    }
  };

  const setActiveCategory = (cat: string) => {
    _setActiveCategory(cat);
    if (cat === 'Veg') {
      _setCategoryFilter('Veg');
      setDietaryFilter('Veg');
      _setActiveCategory('All');
    } else if (cat === 'Non-Veg') {
      _setCategoryFilter('Non-Veg');
      setDietaryFilter('Non-Veg');
      _setActiveCategory('All');
    } else if (cat === 'Burger' || cat === 'Burgers') {
      _setCategoryFilter('Burgers');
      setDietaryFilter('All');
    } else if (cat === 'Grill' || cat === 'Grills & Tandoor') {
      _setCategoryFilter('Grills & Tandoor');
      setDietaryFilter('All');
    } else {
      _setCategoryFilter(cat);
      setDietaryFilter('All');
    }

    if (cat !== 'All') {
      setSearchQuery('');
    }
  };

  // Clear search query when selecting a price filter
  const setPriceFilter = (price: string) => {
    _setPriceFilter(price);
    if (price !== 'All Prices' && price !== 'All') {
      setSearchQuery('');
    }
  };

  const resetFilters = () => {
    _setActiveCategory('All');
    setSearchQuery('');
    setDietaryFilter('All');
    setQuickFilter('All');
    _setCategoryFilter('All');
    _setPriceFilter('All Prices');
  };
  
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [nextBillNumber, setNextBillNumber] = useState<number>(1001);
  const [activeReceipt, setActiveReceipt] = useState<ReceiptData | null>(null);
  const [pastReceipts, setPastReceipts] = useState<ReceiptData[]>([]);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastInfo, setToastInfo] = useState<ToastNotification | null>(null);
  const [lastAddedAction, setLastAddedAction] = useState<{ foodItemId: number; quantity: number } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // Add item logic with rich notification & undo support
  const addItem = (foodItem: FoodItem, quantity: number = 1) => {
    setCartItems((prevItems) => {
      let nextItems: CartItem[];
      const existingIndex = prevItems.findIndex((item) => item.foodItem.id === foodItem.id);
      if (existingIndex > -1) {
        nextItems = [...prevItems];
        const newQty = nextItems[existingIndex].quantity + quantity;
        nextItems[existingIndex] = {
          foodItem,
          quantity: newQty,
          totalPrice: foodItem.price * newQty,
        };
      } else {
        nextItems = [
          ...prevItems,
          {
            foodItem,
            quantity,
            totalPrice: foodItem.price * quantity,
          },
        ];
      }

      // Calculate updated grand total for toast
      const nextSubtotal = nextItems.reduce((acc, i) => acc + i.totalPrice, 0);
      const nextDiscount = nextSubtotal >= 1000 ? nextSubtotal * 0.10 : 0;
      const nextGst = (nextSubtotal - nextDiscount) * 0.05;
      const nextGrandTotal = nextSubtotal - nextDiscount + nextGst;

      setToastInfo({
        foodItemId: foodItem.id,
        itemName: foodItem.name,
        quantityAdded: quantity,
        cartTotal: nextGrandTotal,
      });

      setLastAddedAction({
        foodItemId: foodItem.id,
        quantity: quantity,
      });

      return nextItems;
    });

    const msg = `Added ${quantity}x ${foodItem.name} to cart`;
    setToastMessage(msg);

    setTimeout(() => {
      setToastInfo((prev) => (prev && prev.itemName === foodItem.name ? null : prev));
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const undoLastAction = () => {
    if (lastAddedAction) {
      const { foodItemId, quantity } = lastAddedAction;
      setCartItems((prevItems) => {
        const existing = prevItems.find((i) => i.foodItem.id === foodItemId);
        if (!existing) return prevItems;
        if (existing.quantity <= quantity) {
          return prevItems.filter((i) => i.foodItem.id !== foodItemId);
        }
        return prevItems.map((i) =>
          i.foodItem.id === foodItemId
            ? { ...i, quantity: i.quantity - quantity, totalPrice: i.foodItem.price * (i.quantity - quantity) }
            : i
        );
      });
      setToastInfo(null);
      setToastMessage(null);
      setLastAddedAction(null);
    }
  };

  // Remove item logic matching Java cart.removeItem()
  const removeItem = (id: number) => {
    setCartItems((prevItems) => {
      const target = prevItems.find((i) => i.foodItem.id === id);
      if (target) {
        showToast(`Removed ${target.foodItem.name} from cart`);
      }
      return prevItems.filter((item) => item.foodItem.id !== id);
    });
  };

  // Update quantity matching Java cart.updateQuantity()
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.foodItem.id === id) {
          return {
            ...item,
            quantity,
            totalPrice: item.foodItem.price * quantity,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculations matching bill.java
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  }, [cartItems]);

  const gst = useMemo(() => {
    return subtotal * 0.05; // 5% GST
  }, [subtotal]);

  const discount = useMemo(() => {
    // Java logic: if (getSubtotal() >= 1000) return getSubtotal() * 0.10;
    return subtotal >= 1000 ? subtotal * 0.10 : 0;
  }, [subtotal]);

  const grandTotal = useMemo(() => {
    return subtotal + gst - discount;
  }, [subtotal, gst, discount]);

  const billSummary: BillSummary = useMemo(
    () => ({
      subtotal,
      gst,
      discount,
      grandTotal,
    }),
    [subtotal, gst, discount, grandTotal]
  );

  // Place order matching Main.checkout() & receipt.printReceipt()
  const placeOrder = (custDetails: Customer): ReceiptData => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(
      2,
      '0'
    )}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const receipt: ReceiptData = {
      billNumber: nextBillNumber,
      dateTime: formattedDate,
      customer: custDetails,
      items: [...cartItems],
      bill: { ...billSummary },
    };

    setCustomer(custDetails);
    setNextBillNumber((prev) => prev + 1);
    setActiveReceipt(receipt);
    setPastReceipts((prev) => [receipt, ...prev]);
    
    // Clear cart as in receipt.java line cart.clearCart()
    clearCart();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    
    showToast(`Order #${receipt.billNumber} placed successfully!`);
    return receipt;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        gst,
        discount,
        grandTotal,
        billSummary,
        
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        dietaryFilter,
        setDietaryFilter,
        quickFilter,
        setQuickFilter,
        categoryFilter,
        setCategoryFilter,
        priceFilter,
        setPriceFilter,
        resetFilters,
        highlightedItemId,
        setHighlightedItemId,
        
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        
        customer,
        activeReceipt,
        setActiveReceipt,
        pastReceipts,
        placeOrder,
        
        toastMessage,
        toastInfo,
        showToast,
        undoLastAction,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
