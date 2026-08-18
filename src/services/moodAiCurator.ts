import { FoodItem, MoodOccasion, MoodFeastCombo, MoodFeastResponse } from '../types';
import { MENU_ITEMS } from '../data/menuData';
import { getItemMacros } from './macroAiBuilder';

// Helper to locate menu item by id or keyword name
function findDish(query: string | number, fallbackIndex = 0): FoodItem {
  if (typeof query === 'number') {
    const found = MENU_ITEMS.find((i) => i.id === query);
    if (found) return found;
  }
  const qLower = String(query).toLowerCase();
  const found = MENU_ITEMS.find((i) => i.name.toLowerCase().includes(qLower));
  return found || MENU_ITEMS[fallbackIndex] || MENU_ITEMS[0];
}

// Compute total calories, protein, and price for a dish combo
function buildCombo(
  id: string,
  title: string,
  badge: string,
  vibeTag: string,
  dishQueries: (string | number)[],
  chefQuote: string
): MoodFeastCombo {
  const items = dishQueries.map((q) => {
    const rawDish = findDish(q);
    const macros = getItemMacros(rawDish);
    return {
      foodItem: { ...rawDish, ...macros },
      quantity: 1,
    };
  });

  const totalCalories = items.reduce((sum, item) => sum + (item.foodItem.calories || 400), 0);
  const totalProtein = items.reduce((sum, item) => sum + (item.foodItem.protein || 20), 0);
  const totalPrice = items.reduce((sum, item) => sum + item.foodItem.price, 0);

  return {
    id,
    title,
    badge,
    vibeTag,
    totalCalories,
    totalProtein,
    totalPrice,
    items,
    chefQuote,
  };
}

export function curateMoodFeast(mood: MoodOccasion, customPrompt?: string): MoodFeastResponse {
  // If user provided a natural language custom prompt
  if (customPrompt && customPrompt.trim().length > 0) {
    const promptLower = customPrompt.toLowerCase();

    let combo1Queries: (string | number)[] = [36, 31, 50]; // Tandoori + Naan + Soda
    let combo2Queries: (string | number)[] = [23, 27];     // Biryani + Kadai Chicken
    let combo3Queries: (string | number)[] = [14, 46];     // Pasta + Lava Cake

    if (promptLower.includes('pasta') || promptLower.includes('italian') || promptLower.includes('cheese')) {
      combo1Queries = [14, 8, 46]; // Pasta + Pizza + Cake
      combo2Queries = [13, 33];    // Alfredo + Cheese Naan
      combo3Queries = [2, 41, 52];  // Smash Burger + Fries + Shake
    } else if (promptLower.includes('spicy') || promptLower.includes('hot') || promptLower.includes('biryani')) {
      combo1Queries = [23, 27, 31]; // Dum Biryani + Kadai Chicken + Naan
      combo2Queries = [36, 39, 50]; // Tandoori Chicken + Seekh Kebab + Soda
      combo3Queries = [17, 42];     // Schezwan Rice + Wings
    } else if (promptLower.includes('healthy') || promptLower.includes('protein') || promptLower.includes('gym')) {
      combo1Queries = [36, 30, 50]; // Tandoori Chicken + Roti + Lime Soda
      combo2Queries = [35, 39];     // BBQ Grill + Seekh Kebab
      combo3Queries = [40, 37];     // Reshmi Kebab + Paneer Tikka
    }

    return {
      mood: 'CUSTOM_MOOD' as any,
      headline: `Chef AI Curated Selection for "${customPrompt}"`,
      combos: [
        buildCombo(
          'custom-1',
          'Option 1: Chef Tailored Match',
          '🥇 AI Chef Special',
          'Custom Comfort',
          combo1Queries,
          `Chef Mario specifically selected these flavors to match "${customPrompt}".`
        ),
        buildCombo(
          'custom-2',
          'Option 2: High Flavor Gourmet Combo',
          '🥈 Flavor Match',
          'Gourmet Pair',
          combo2Queries,
          `A rich, savory combination crafted around your preferences.`
        ),
        buildCombo(
          'custom-3',
          'Option 3: Quick Bites & Sips',
          '🥉 Express Pair',
          'Light Refresh',
          combo3Queries,
          `A lighter, satisfying pairing matching your request.`
        ),
      ],
    };
  }

  // Pre-configured Mood Occasions
  switch (mood) {
    case 'RAINY_DAY':
      return {
        mood: 'RAINY_DAY',
        headline: '🌧️ Rainy Day Warmth & Comfort Feasts',
        combos: [
          buildCombo(
            'rainy-1',
            'Option 1: Steaming Dum Biryani & Gravy',
            '🥇 Ultimate Rainy Comfort',
            'Hot & Steaming',
            [23, 27, 31], // Chicken Dum Biryani + Kadai Chicken + Butter Naan
            'Nothing beats hot dum biryani and simmered kadai chicken on a cold rainy day.'
          ),
          buildCombo(
            'rainy-2',
            'Option 2: Cozy Tandoori & Garlic Naan',
            '🥈 Cozy Tandoori Pair',
            'Rich & Savory',
            [29, 32, 50], // Chicken Tikka Masala + Garlic Naan + Fresh Lime Soda
            'Rich simmered chicken tikka masala scooped with garlic butter naan.'
          ),
          buildCombo(
            'rainy-3',
            'Option 3: Indo-Chinese Hot Noodle Bowl',
            '🥉 Hot Spicy Bowl',
            'Spicy Warmth',
            [19, 42], // Chicken Manchow Noodles + Hot Wings
            'Piping hot wok-tossed noodles paired with spicy crisp chicken wings.'
          ),
        ],
      };

    case 'POST_WORKOUT':
      return {
        mood: 'POST_WORKOUT',
        headline: '🏋️ Post-Workout Muscle Power Fuel',
        combos: [
          buildCombo(
            'workout-1',
            'Option 1: Lean Tandoori Protein Power',
            '🥇 58g Protein Fuel',
            'Muscle Recovery',
            [36, 30, 49], // Tandoori Chicken (Half) + Tandoori Roti + Cold Coffee
            'Delivers 58g of lean protein from charred tandoori chicken to accelerate muscle repair.'
          ),
          buildCombo(
            'workout-2',
            'Option 2: Smokey BBQ & Mutton Seekh Kebab',
            '🥈 Dual Grill Power',
            'High Protein',
            [35, 39], // BBQ Grill Chicken + Mutton Seekh Kebab
            'Smokey charcoal-grilled chicken breast and spiced mutton seekh kebab.'
          ),
          buildCombo(
            'workout-3',
            'Option 3: Paneer Tikka & Chicken Reshmi',
            '🥉 Clean Protein Combo',
            'Lean & Clean',
            [40, 37], // Chicken Reshmi Kebab + Paneer Tikka
            'Tender chicken reshmi kebab combined with protein-rich paneer tikka.'
          ),
        ],
      };

    case 'LATE_NIGHT':
      return {
        mood: 'LATE_NIGHT',
        headline: '🎬 Late Night Midnight Cravings Binge',
        combos: [
          buildCombo(
            'night-1',
            'Option 1: Cheesy Smash & Wings Binge',
            '🥇 Ultimate Midnight Feast',
            'Binge Cravings',
            [4, 42, 52], // Double Chicken Burger + Spicy Wings + Chocolate Shake
            'Double chicken smash burger, hot wings, and a thick chocolate shake.'
          ),
          buildCombo(
            'night-2',
            'Option 2: Pepperoni Pizza & Lava Cake',
            '🥈 Pizza & Dessert Binge',
            'Late Night Slice',
            [11, 46], // Pepperoni Feast Pizza + Warm Chocolate Lava Cake
            'Fiery pepperoni feast pizza followed by warm oozing chocolate lava cake.'
          ),
          buildCombo(
            'night-3',
            'Option 3: Club Sandwich & Golden Fries',
            '🥉 Crispy Night Snack',
            'Quick Cravings',
            [7, 41, 49], // Club Sandwich + French Fries + Cold Coffee
            'Triple-decker chicken club sandwich with golden salted french fries.'
          ),
        ],
      };

    case 'ROMANTIC_DATE':
      return {
        mood: 'ROMANTIC_DATE',
        headline: '🕯️ Romantic Gourmet Date Night Pairing',
        combos: [
          buildCombo(
            'date-1',
            'Option 1: Smoked Pasta & Lava Cake',
            '🥇 Gourmet Date Special',
            'Romantic Candlelight',
            [14, 9, 46], // Chicken Creamy Pasta + Farmhouse Pizza + Lava Cake
            'Silky smoked chicken pasta, farm pizza, and warm chocolate lava cake for two.'
          ),
          buildCombo(
            'date-2',
            'Option 2: Alfredo Pasta & Virgin Mojito',
            '🥈 Creamy Italian Date',
            'Smooth & Delicate',
            [13, 33, 51], // Alfredo Pasta + Cheese Garlic Naan + Virgin Mojito
            'Fettuccine Alfredo with cheese garlic naan and chilled mint virgin mojito.'
          ),
          buildCombo(
            'date-3',
            'Option 3: Paneer Masala & Royal Rasmalai',
            '🥉 Royal Saffron Date',
            'Sweet Endings',
            [26, 31, 47], // Paneer Butter Masala + Butter Naan + Rasmalai
            'Rich paneer butter masala with naan and delicate saffron rasmalai.'
          ),
        ],
      };

    case 'BUSY_WORKDAY':
      return {
        mood: 'BUSY_WORKDAY',
        headline: '💼 Express Busy Workday Lunch Combos',
        combos: [
          buildCombo(
            'work-1',
            'Option 1: Triple-Decker Club Express',
            '🥇 10-Min Fast Express',
            'Quick Desk Lunch',
            [7, 41], // Club Sandwich + French Fries
            'Triple-decker club sandwich with fries — ready in under 10 minutes.'
          ),
          buildCombo(
            'work-2',
            'Option 2: Schezwan Fried Rice & Soda',
            '🥈 Wok Rice Express',
            'Energizing Wok',
            [17, 50], // Chicken Schezwan Fried Rice + Lime Soda
            'Spicy wok-tossed chicken Schezwan fried rice with refreshing lime soda.'
          ),
          buildCombo(
            'work-3',
            'Option 3: Hakka Noodles & Spring Rolls',
            '🥉 Asian Quick Combo',
            'Crispy & Savory',
            [18, 43], // Veg Hakka Noodles + Spring Rolls
            'Stir-fried Hakka noodles with crunchy vegetable spring rolls.'
          ),
        ],
      };

    case 'FESTIVE_PARTY':
    default:
      return {
        mood: 'FESTIVE_PARTY',
        headline: '🥳 Grand Celebration & Party Feast',
        combos: [
          buildCombo(
            'party-1',
            'Option 1: Royal Dum Biryani Celebration',
            '🥇 Grand Party Feast',
            'Celebration Dum',
            [24, 39, 45], // Mutton Dum Biryani + Seekh Kebab + Gulab Jamun
            'Royal mutton dum biryani, spiced seekh kebab, and warm gulab jamun.'
          ),
          buildCombo(
            'party-2',
            'Option 2: Tandoori Platter Celebration',
            '🥈 Charcoal Grill Party',
            'Smokey Platter',
            [36, 40, 33], // Tandoori Chicken + Reshmi Kebab + Cheese Naan
            'Half tandoori chicken, reshmi kebab, and cheese garlic naan.'
          ),
          buildCombo(
            'party-3',
            'Option 3: Supreme Pizza & Wings Bash',
            '🥉 Pizza Party Combo',
            'Cheesy Bash',
            [10, 42, 52], // Veg Supreme Pizza + Spicy Wings + Chocolate Milkshake
            'Veg supreme pizza, spicy wings, and thick chocolate shake.'
          ),
        ],
      };
  }
}
