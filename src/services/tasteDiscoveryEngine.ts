import { FoodItem, TasteBudget, TasteVibe, MysteryBoxResponse, MysteryBoxItem } from '../types';
import { MENU_ITEMS } from '../data/menuData';
import { getItemMacros } from './macroAiBuilder';

// Helper to look up dish by ID or name
function getRichDish(query: string | number): FoodItem {
  let found: FoodItem | undefined;
  if (typeof query === 'number') {
    found = MENU_ITEMS.find((i) => i.id === query);
  } else {
    const qLower = String(query).toLowerCase();
    found = MENU_ITEMS.find((i) => i.name.toLowerCase().includes(qLower));
  }
  const raw = found || MENU_ITEMS[0];
  const macros = getItemMacros(raw);
  return { ...raw, ...macros };
}

export function generateMysteryBox(
  budgetPreset: TasteBudget = 'MID_RANGE',
  dietaryFilter: 'All' | 'Veg' | 'Non-Veg' = 'All',
  vibePreset: TasteVibe = 'WILD_SURPRISE'
): MysteryBoxResponse {
  // Candidate pool based on dietary filter
  let pool = MENU_ITEMS.filter((item) => {
    if (dietaryFilter === 'Veg' && !item.isVeg) return false;
    if (dietaryFilter === 'Non-Veg' && item.isVeg) return false;
    return true;
  });

  if (pool.length === 0) pool = MENU_ITEMS;

  let chosenQueries: (string | number)[] = [];
  let boxTitle = '🎁 Mystery Gourmet Box';
  let boxBadge = '10% OFF Discovery Box';
  let mysteryDescription = 'A specially curated gourmet surprise pairing selected by Chef Mario AI!';

  // Budget & Vibe pairing presets
  if (budgetPreset === 'UNDER_250') {
    boxTitle = '🪙 Express Value Mystery Box';
    boxBadge = 'Budget Saver Deal';
    if (vibePreset === 'FAST_FOOD') {
      chosenQueries = [1, 41]; // Single Cheeseburger + French Fries
    } else if (vibePreset === 'ROYAL_INDIAN') {
      chosenQueries = [22, 30]; // Egg Dum Biryani + Tandoori Roti
    } else if (vibePreset === 'ITALIAN_GOURMET') {
      chosenQueries = [12, 50]; // Red Sauce Pasta + Lime Soda
    } else {
      chosenQueries = [7, 50]; // Club Sandwich + Lime Soda
    }
  } else if (budgetPreset === 'PREMIUM') {
    boxTitle = '💎 Royal Feast Mystery Box';
    boxBadge = 'Gourmet Grand Deal';
    if (vibePreset === 'ROYAL_INDIAN') {
      chosenQueries = [24, 39, 45]; // Mutton Dum Biryani + Seekh Kebab + Gulab Jamun
    } else if (vibePreset === 'ITALIAN_GOURMET') {
      chosenQueries = [14, 11, 46]; // Smoked Chicken Pasta + Pepperoni Pizza + Lava Cake
    } else if (vibePreset === 'FAST_FOOD') {
      chosenQueries = [4, 42, 52]; // Double Chicken Burger + Hot Wings + Chocolate Shake
    } else {
      chosenQueries = [23, 36, 47]; // Chicken Biryani + Tandoori Chicken Half + Rasmalai
    }
  } else {
    // MID_RANGE
    boxTitle = '💵 Chef Favorite Mystery Box';
    boxBadge = 'Popular Flavor Pair';
    if (vibePreset === 'FAST_FOOD') {
      chosenQueries = [2, 41, 52]; // Chicken Smash Burger + Fries + Chocolate Shake
    } else if (vibePreset === 'ROYAL_INDIAN') {
      chosenQueries = [23, 31]; // Chicken Dum Biryani + Butter Naan
    } else if (vibePreset === 'ITALIAN_GOURMET') {
      chosenQueries = [9, 46]; // Farmhouse Pizza + Chocolate Lava Cake
    } else {
      chosenQueries = [29, 32, 50]; // Chicken Tikka Masala + Garlic Naan + Lime Soda
    }
  }

  // Build items array
  const items: MysteryBoxItem[] = chosenQueries.map((q) => ({
    foodItem: getRichDish(q),
    quantity: 1,
  }));

  const originalPrice = items.reduce((sum, item) => sum + item.foodItem.price, 0);
  const discountPercentage = 10;
  const discountedPrice = Math.round(originalPrice * 0.9);
  const totalCalories = items.reduce((sum, item) => sum + (item.foodItem.calories || 400), 0);
  const totalProtein = items.reduce((sum, item) => sum + (item.foodItem.protein || 20), 0);

  return {
    boxId: `box-${Date.now()}`,
    boxTitle,
    boxBadge,
    budgetPreset,
    vibePreset,
    matchScore: 96,
    originalPrice,
    discountedPrice,
    discountPercentage,
    totalCalories,
    totalProtein,
    items,
    mysteryDescription,
  };
}

export function rerollDish(
  currentBox: MysteryBoxResponse,
  dishIndexToSwap: number
): MysteryBoxResponse {
  if (dishIndexToSwap < 0 || dishIndexToSwap >= currentBox.items.length) return currentBox;

  const currentDishId = currentBox.items[dishIndexToSwap].foodItem.id;
  const existingIds = currentBox.items.map((i) => i.foodItem.id);

  // Find candidate dishes not already in the box
  const candidateDishes = MENU_ITEMS.filter((i) => !existingIds.includes(i.id));
  if (candidateDishes.length === 0) return currentBox;

  // Pick a fresh dish
  const randomIndex = Math.floor(Math.random() * candidateDishes.length);
  const newDishRaw = candidateDishes[randomIndex];
  const newDishRich = { ...newDishRaw, ...getItemMacros(newDishRaw) };

  const newItems = [...currentBox.items];
  newItems[dishIndexToSwap] = {
    foodItem: newDishRich,
    quantity: 1,
  };

  const originalPrice = newItems.reduce((sum, item) => sum + item.foodItem.price, 0);
  const discountedPrice = Math.round(originalPrice * 0.9);
  const totalCalories = newItems.reduce((sum, item) => sum + (item.foodItem.calories || 400), 0);
  const totalProtein = newItems.reduce((sum, item) => sum + (item.foodItem.protein || 20), 0);

  return {
    ...currentBox,
    items: newItems,
    originalPrice,
    discountedPrice,
    totalCalories,
    totalProtein,
    mysteryDescription: `Dish ${dishIndexToSwap + 1} swapped for ${newDishRich.name}!`,
  };
}
