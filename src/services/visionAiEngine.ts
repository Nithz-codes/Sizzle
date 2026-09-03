import { GoogleGenAI } from '@google/genai';
import { FoodItem, VisionScanResult, VisionSamplePhoto } from '../types';
import { AiEngineMode } from '../components/AiEngineToggle';
import { MENU_ITEMS } from '../data/menuData';
import { getStoredApiKey } from './geminiAiService';

export const SAMPLE_VISION_PHOTOS: VisionSamplePhoto[] = [
  {
    id: 'sample-burger',
    title: 'Gourmet Cheese Burger',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    sampleDishName: 'Cheese Burger',
  },
  {
    id: 'sample-pizza',
    title: 'Margherita Pizza',
    imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80',
    sampleDishName: 'Margherita Pizza',
  },
  {
    id: 'sample-biryani',
    title: 'Hyderabadi Chicken Biryani',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    sampleDishName: 'Chicken Biryani',
  },
  {
    id: 'sample-salad',
    title: 'Fresh Mediterranean Salad',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    sampleDishName: 'Caesar Salad',
  },
];

/**
 * Local Solver Fallback: Analyzes photo metadata/keyword or sample dish to generate instant 0ms result
 */
export function analyzeLocalFoodImage(
  imageHint: string = '',
  menuList: FoodItem[] = MENU_ITEMS
): VisionScanResult {
  const hintLower = imageHint.toLowerCase();

  let matchedDish = menuList.find((item) =>
    hintLower.includes(item.name.toLowerCase()) || hintLower.includes(item.category.toLowerCase())
  );

  if (!matchedDish) {
    if (hintLower.includes('pizza')) {
      matchedDish = menuList.find((i) => i.name.toLowerCase().includes('pizza')) || menuList[0];
    } else if (hintLower.includes('biryani') || hintLower.includes('rice')) {
      matchedDish = menuList.find((i) => i.name.toLowerCase().includes('biryani')) || menuList[0];
    } else if (hintLower.includes('salad') || hintLower.includes('veg')) {
      matchedDish = menuList.find((i) => i.name.toLowerCase().includes('salad')) || menuList[0];
    } else {
      matchedDish = menuList.find((i) => i.name.toLowerCase().includes('burger')) || menuList[0];
    }
  }

  // Find 2 complimentary paired items from menu
  const pairedItems = menuList
    .filter((i) => i.id !== matchedDish!.id && (i.isVeg === matchedDish!.isVeg || i.category !== matchedDish!.category))
    .slice(0, 2);

  return {
    recognizedDishName: matchedDish.name,
    confidenceScore: 97,
    estimatedCalories: matchedDish.calories || 520,
    proteinGrams: matchedDish.protein || 28,
    carbsGrams: 45,
    fatGrams: 22,
    fiberGrams: 6,
    healthGrade: matchedDish.protein >= 25 ? 'A+ High Protein' : 'B+ Gourmet Balance',
    summary: `Visual scan detected ${matchedDish.name} prepared fresh with rich artisanal ingredients.`,
    chefInsights: `Chef Mario Notes: Perfect pairing for ${matchedDish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'} lovers with ${matchedDish.calories} kcal energy profile.`,
    matchedItems: [
      {
        foodItem: matchedDish,
        similarityScore: 98,
        matchReason: 'Direct 1:1 Sizzle Menu Match',
      },
      ...pairedItems.map((item, idx) => ({
        foodItem: item,
        similarityScore: 88 - idx * 5,
        matchReason: 'Recommended Flavor Pairing',
      })),
    ],
  };
}

/**
 * Main Vision AI Entry Point: Uses Gemini 1.5 Flash Vision API when key is available, else 0ms local fallback
 */
export async function analyzeFoodImage(
  base64DataUrl: string,
  engineMode: AiEngineMode = 'LOCAL',
  imageHint: string = '',
  menuList: FoodItem[] = MENU_ITEMS
): Promise<VisionScanResult> {
  const apiKey = getStoredApiKey() || import.meta.env.VITE_GEMINI_API_KEY || '';

  if (engineMode === 'LOCAL' || !apiKey) {
    // 0ms Local Solver Fallback
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(analyzeLocalFoodImage(imageHint, menuList));
      }, 500); // 500ms realistic scan simulation
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Clean Base64 prefix if present (e.g. data:image/jpeg;base64,...)
    let mimeType = 'image/jpeg';
    let base64Clean = base64DataUrl;

    if (base64DataUrl.includes(';base64,')) {
      const parts = base64DataUrl.split(';base64,');
      mimeType = parts[0].replace('data:', '') || 'image/jpeg';
      base64Clean = parts[1];
    }

    const menuCatalog = menuList
      .slice(0, 30)
      .map((item) => `[ID:${item.id}] ${item.name} (${item.category}, Cal:${item.calories}kcal, P:${item.protein}g, ₹${item.price})`)
      .join('\n');

    const prompt = `You are Chef Mario AI, Sizzle's master culinary vision inspector.
Analyze this food plate photo in detail.
Match it with Sizzle's active menu catalog below:

--- SIZZLE MENU CATALOG ---
${menuCatalog}

Return ONLY valid JSON matching this exact structure:
{
  "recognizedDishName": "Name of dish in photo",
  "confidenceScore": 95,
  "estimatedCalories": 550,
  "proteinGrams": 32,
  "carbsGrams": 45,
  "fatGrams": 20,
  "fiberGrams": 5,
  "healthGrade": "A+ High Protein",
  "summary": "1 sentence description of food detected",
  "chefInsights": "Flavor notes and cooking technique",
  "matchedItemIds": [matched_id_1, matched_id_2]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          inlineData: {
            mimeType,
            data: base64Clean,
          },
        },
        {
          text: prompt,
        },
      ],
    });

    const responseText = response.text || '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      const matchedIds: number[] = parsed.matchedItemIds || [];
      const matchedItems = menuList
        .filter((i) => matchedIds.includes(i.id))
        .map((item, idx) => ({
          foodItem: item,
          similarityScore: 98 - idx * 5,
          matchReason: idx === 0 ? 'Gemini 1.5 Vision Menu Match' : 'Chef Paired Recommendation',
        }));

      // Fallback matching if Gemini returned ids outside catalog
      if (matchedItems.length === 0) {
        const localFallback = analyzeLocalFoodImage(parsed.recognizedDishName || imageHint, menuList);
        return {
          ...localFallback,
          recognizedDishName: parsed.recognizedDishName || localFallback.recognizedDishName,
          estimatedCalories: parsed.estimatedCalories || localFallback.estimatedCalories,
          proteinGrams: parsed.proteinGrams || localFallback.proteinGrams,
          carbsGrams: parsed.carbsGrams || localFallback.carbsGrams,
          fatGrams: parsed.fatGrams || localFallback.fatGrams,
          summary: parsed.summary || localFallback.summary,
          chefInsights: parsed.chefInsights || localFallback.chefInsights,
        };
      }

      return {
        recognizedDishName: parsed.recognizedDishName || 'Gourmet Dish',
        confidenceScore: parsed.confidenceScore || 95,
        estimatedCalories: parsed.estimatedCalories || 520,
        proteinGrams: parsed.proteinGrams || 28,
        carbsGrams: parsed.carbsGrams || 45,
        fatGrams: parsed.fatGrams || 20,
        fiberGrams: parsed.fiberGrams || 5,
        healthGrade: parsed.healthGrade || 'A+ Gourmet Balance',
        summary: parsed.summary || 'Freshly detected gourmet meal.',
        chefInsights: parsed.chefInsights || 'Artisanal preparation with balanced macros.',
        matchedItems,
      };
    }

    return analyzeLocalFoodImage(imageHint, menuList);
  } catch (err) {
    console.warn('Gemini Vision API error, falling back to local visual engine:', err);
    return analyzeLocalFoodImage(imageHint, menuList);
  }
}
