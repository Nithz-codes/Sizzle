import { GoogleGenAI } from '@google/genai';
import { MENU_ITEMS } from '../data/menuData';
import {
  MacroGoalRequest,
  MacroMealResponse,
  MoodOccasion,
  MoodFeastResponse,
  TasteBudget,
  TasteVibe,
  MysteryBoxResponse,
  OrderReceipt,
  UsualFeastResponse,
} from '../types';

import { buildMacroMeal } from './macroAiBuilder';
import { curateMoodFeast } from './moodAiCurator';
import { generateMysteryBox } from './tasteDiscoveryEngine';
import { getUsualFeast } from './smartReorderEngine';

const STORAGE_KEY = 'sizzle_gemini_api_key';

export function getStoredApiKey(): string {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local && local.trim()) return local.trim();
  }
  return (
    import.meta.env?.VITE_GEMINI_API_KEY ||
    (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '') ||
    ''
  );
}

export function saveStoredApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, key.trim());
  }
}

export function hasGeminiApiKey(): boolean {
  return getStoredApiKey().length > 5;
}

function getAiClient() {
  const key = getStoredApiKey();
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
}

// System context containing Sizzle's 52 menu items for Gemini LLM
const SYSTEM_MENU_CONTEXT = `
You are Chef Mario AI, the head executive chef at Sizzle Gourmet Restaurant.
Here is Sizzle's 52-dish menu database:
${JSON.stringify(
  MENU_ITEMS.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    price: item.price,
    isVeg: item.isVeg,
    calories: item.calories,
    protein: item.protein,
    carbs: item.carbs,
    fat: item.fat,
  })),
  null,
  2
)}
Always respond strictly in JSON format matching the requested schema.
`;

/**
 * 1. Gemini Macro Meal Builder
 */
export async function generateGeminiMacroMeal(
  request: MacroGoalRequest
): Promise<MacroMealResponse> {
  const ai = getAiClient();
  if (!ai) {
    console.warn('Gemini API key missing, falling back to Local Solver Engine.');
    return buildMacroMeal(request, MENU_ITEMS);
  }

  try {
    const prompt = `
${SYSTEM_MENU_CONTEXT}

The diner requested a fitness meal combo:
- Target Calories: ${request.targetCalories} kcal
- Min Protein: ${request.minProtein}g
- Preset: ${request.preset || 'BALANCED'}
- Dietary: ${request.dietaryFilter}

Curate 3 distinct meal option combos using dish IDs from Sizzle's menu.
Return valid JSON matching:
{
  "preset": "${request.preset || 'BALANCED'}",
  "matchScore": 99,
  "totalCalories": number,
  "totalProtein": number,
  "totalCarbs": number,
  "totalFat": number,
  "totalPrice": number,
  "explanation": "Chef Mario explanation...",
  "topCombos": [
    {
      "id": "gemini-combo-1",
      "title": "Option 1: Chef Gemini Selection",
      "badge": "🥇 Chef Choice",
      "matchScore": 99,
      "totalCalories": number,
      "totalProtein": number,
      "totalCarbs": number,
      "totalFat": number,
      "totalPrice": number,
      "itemIds": [dish_ids_here],
      "explanation": "Explanation..."
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const jsonText = response.text || '';
    const parsed = JSON.parse(jsonText);

    if (parsed && parsed.topCombos && Array.isArray(parsed.topCombos)) {
      // Map itemIds back to full FoodItem entities
      const hydratedCombos = parsed.topCombos.map((c: any) => {
        const itemIds: (number | string)[] = c.itemIds || [1];
        const items = itemIds.map((id) => {
          const dish = MENU_ITEMS.find((m) => String(m.id) === String(id)) || MENU_ITEMS[0];
          return { foodItem: dish, quantity: 1 };
        });
        return {
          id: c.id || 'combo-gemini',
          title: c.title || 'Option 1: Gemini Selection',
          badge: c.badge || '🥇 Gemini Choice',
          matchScore: c.matchScore || 99,
          totalCalories: c.totalCalories || items.reduce((s, i) => s + (i.foodItem.calories || 400), 0),
          totalProtein: c.totalProtein || items.reduce((s, i) => s + (i.foodItem.protein || 20), 0),
          totalCarbs: c.totalCarbs || 40,
          totalFat: c.totalFat || 20,
          totalPrice: c.totalPrice || items.reduce((s, i) => s + i.foodItem.price, 0),
          items,
          explanation: c.explanation || 'Curated by Gemini 1.5 AI.',
        };
      });

      const first = hydratedCombos[0];
      return {
        preset: request.preset || 'BALANCED',
        matchScore: first.matchScore,
        totalCalories: first.totalCalories,
        totalProtein: first.totalProtein,
        totalCarbs: first.totalCarbs,
        totalFat: first.totalFat,
        totalPrice: first.totalPrice,
        items: first.items,
        explanation: first.explanation,
        topCombos: hydratedCombos,
      };
    }
  } catch (err) {
    console.error('Gemini API call failed, falling back to Local Solver:', err);
  }

  return buildMacroMeal(request, MENU_ITEMS);
}

/**
 * 2. Gemini Mood Curator
 */
export async function generateGeminiMoodFeast(
  mood: MoodOccasion,
  customPrompt?: string
): Promise<MoodFeastResponse> {
  const ai = getAiClient();
  if (!ai) {
    return curateMoodFeast(mood, customPrompt);
  }

  try {
    const prompt = `
${SYSTEM_MENU_CONTEXT}

Customer Mood: ${mood}
Custom Prompt: ${customPrompt || 'None'}

Curate 3 distinct multi-course feast options matching this emotional vibe.
Return valid JSON:
{
  "mood": "${mood}",
  "headline": "Gemini AI Curated Headline",
  "combos": [
    {
      "id": "gemini-mood-1",
      "title": "Option 1: Gemini Mood Feast",
      "badge": "🥇 AI Master Match",
      "vibeTag": "Vibe Name",
      "dishIds": [dish_ids_here],
      "chefQuote": "Personalized Chef Mario quote..."
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '');
    if (parsed && parsed.combos && Array.isArray(parsed.combos)) {
      const combos = parsed.combos.map((c: any, idx: number) => {
        const dishIds: (number | string)[] = c.dishIds || [23, 31];
        const items = dishIds.map((id) => {
          const dish = MENU_ITEMS.find((m) => String(m.id) === String(id)) || MENU_ITEMS[idx];
          return { foodItem: dish, quantity: 1 };
        });

        return {
          id: c.id || `gemini-mood-${idx}`,
          title: c.title || `Option ${idx + 1}: Gemini Choice`,
          badge: c.badge || `🥇 Option ${idx + 1}`,
          vibeTag: c.vibeTag || 'Gemini Vibe',
          totalCalories: items.reduce((s, i) => s + (i.foodItem.calories || 400), 0),
          totalProtein: items.reduce((s, i) => s + (i.foodItem.protein || 20), 0),
          totalPrice: items.reduce((s, i) => s + i.foodItem.price, 0),
          items,
          chefQuote: c.chefQuote || 'Crafted with passion by Gemini AI.',
        };
      });

      return {
        mood,
        headline: parsed.headline || '✨ Gemini AI Mood Selection',
        combos,
      };
    }
  } catch (err) {
    console.error('Gemini Mood API call failed, falling back to Local Solver:', err);
  }

  return curateMoodFeast(mood, customPrompt);
}

/**
 * 3. Gemini Taste Discovery Box
 */
export async function generateGeminiTasteDiscovery(
  budgetPreset: TasteBudget,
  dietaryFilter: 'All' | 'Veg' | 'Non-Veg',
  vibePreset: TasteVibe
): Promise<MysteryBoxResponse> {
  const ai = getAiClient();
  if (!ai) {
    return generateMysteryBox(budgetPreset, dietaryFilter, vibePreset);
  }

  try {
    const prompt = `
${SYSTEM_MENU_CONTEXT}

Budget: ${budgetPreset}
Dietary: ${dietaryFilter}
Vibe: ${vibePreset}

Curate a 2-3 item mystery box from Sizzle's menu.
Return valid JSON:
{
  "boxTitle": "Gemini AI Mystery Box",
  "boxBadge": "10% OFF Discovery Box",
  "dishIds": [dish_ids_here],
  "mysteryDescription": "Creative unboxing story..."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '');
    if (parsed && parsed.dishIds && Array.isArray(parsed.dishIds)) {
      const items = parsed.dishIds.map((id: any) => {
        const dish = MENU_ITEMS.find((m) => String(m.id) === String(id)) || MENU_ITEMS[0];
        return { foodItem: dish, quantity: 1 };
      });

      const originalPrice = items.reduce((s, i) => s + i.foodItem.price, 0);
      const discountedPrice = Math.round(originalPrice * 0.9);

      return {
        boxId: `gemini-box-${Date.now()}`,
        boxTitle: parsed.boxTitle || '✨ Gemini AI Mystery Box',
        boxBadge: parsed.boxBadge || '10% OFF Deal',
        budgetPreset,
        vibePreset,
        matchScore: 98,
        originalPrice,
        discountedPrice,
        discountPercentage: 10,
        totalCalories: items.reduce((s, i) => s + (i.foodItem.calories || 400), 0),
        totalProtein: items.reduce((s, i) => s + (i.foodItem.protein || 20), 0),
        items,
        mysteryDescription: parsed.mysteryDescription || 'Curated by Gemini 1.5 LLM.',
      };
    }
  } catch (err) {
    console.error('Gemini Taste Discovery API call failed, falling back:', err);
  }

  return generateMysteryBox(budgetPreset, dietaryFilter, vibePreset);
}
