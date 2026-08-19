import { OrderReceipt, UsualFeastResponse, UsualFeastItem, FoodItem } from '../types';
import { MENU_ITEMS } from '../data/menuData';
import { getItemMacros } from './macroAiBuilder';

function findDish(id: string | number): FoodItem {
  const found = MENU_ITEMS.find((i) => String(i.id) === String(id));
  const raw = found || MENU_ITEMS[0];
  const macros = getItemMacros(raw);
  return { ...raw, ...macros };
}

export function getUsualFeast(
  pastReceipts: OrderReceipt[] = [],
  customerName = 'Gourmet Diner'
): UsualFeastResponse {
  // Determine time context badge
  const hour = new Date().getHours();
  let timeBadge = '☀️ Lunchtime Usual';
  if (hour >= 16 && hour < 22) {
    timeBadge = '🌙 Dinner Feast Usual';
  } else if (hour >= 22 || hour < 5) {
    timeBadge = '🎬 Midnight Usual';
  }

  // 1. If customer is new / has zero past orders
  if (!pastReceipts || pastReceipts.length === 0) {
    const bestsellerQueries = [23, 31, 50]; // Biryani + Naan + Soda
    const items: UsualFeastItem[] = bestsellerQueries.map((id) => ({
      foodItem: findDish(id),
      quantity: 1,
      timesOrdered: 1,
    }));

    const totalPrice = items.reduce((sum, i) => sum + i.foodItem.price, 0);
    const totalCalories = items.reduce((sum, i) => sum + (i.foodItem.calories || 400), 0);
    const totalProtein = items.reduce((sum, i) => sum + (i.foodItem.protein || 20), 0);

    return {
      isNewUser: true,
      timeBadge,
      feastTitle: `${customerName}'s Bestseller Starter Feast`,
      totalOrdersCount: 0,
      totalPrice,
      totalCalories,
      totalProtein,
      items,
      chefGreeting: `Welcome to Sizzle! Since you're new, AI curated Sizzle's #1 Trending Community Feast, loved by over 2,400+ local diners!`,
    };
  }

  // 2. Count dish frequencies across past receipts
  const frequencyMap: { [id: string]: { foodItem: FoodItem; count: number; qtySum: number } } = {};

  pastReceipts.forEach((receipt) => {
    if (receipt.items && Array.isArray(receipt.items)) {
      receipt.items.forEach(({ foodItem, quantity }) => {
        const key = String(foodItem.id);
        if (!frequencyMap[key]) {
          frequencyMap[key] = {
            foodItem: findDish(foodItem.id),
            count: 0,
            qtySum: 0,
          };
        }
        frequencyMap[key].count += 1;
        frequencyMap[key].qtySum += quantity || 1;
      });
    }
  });

  const sortedDishes = Object.values(frequencyMap).sort((a, b) => b.count - a.count || b.qtySum - a.qtySum);

  // Pick top 2-3 most ordered dishes
  const topDishes = sortedDishes.slice(0, 3);

  // Fallback if structure had invalid items
  if (topDishes.length === 0) {
    return getUsualFeast([], customerName);
  }

  const items: UsualFeastItem[] = topDishes.map((d) => ({
    foodItem: d.foodItem,
    quantity: Math.min(2, Math.max(1, Math.round(d.qtySum / d.count))),
    timesOrdered: d.count,
  }));

  const totalPrice = items.reduce((sum, i) => sum + i.foodItem.price * i.quantity, 0);
  const totalCalories = items.reduce((sum, i) => sum + (i.foodItem.calories || 400) * i.quantity, 0);
  const totalProtein = items.reduce((sum, i) => sum + (i.foodItem.protein || 20) * i.quantity, 0);

  return {
    isNewUser: false,
    timeBadge,
    feastTitle: `${customerName}'s Signature Usual Feast`,
    totalOrdersCount: pastReceipts.length,
    totalPrice,
    totalCalories,
    totalProtein,
    items,
    chefGreeting: `Welcome back, ${customerName}! AI analyzed your ${pastReceipts.length} past order(s) to prepare your exact Usual Feast!`,
  };
}
