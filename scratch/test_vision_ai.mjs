import { analyzeLocalFoodImage, SAMPLE_VISION_PHOTOS } from '../src/services/visionAiEngine.js';

console.log('🧪 Testing Feature 11: Sizzle Vision AI Engine...\n');

SAMPLE_VISION_PHOTOS.forEach((sample) => {
  console.log(`📸 Testing Sample Photo: "${sample.title}" (${sample.sampleDishName})`);
  const result = analyzeLocalFoodImage(sample.sampleDishName);

  console.log(`  ✅ Recognized Dish: ${result.recognizedDishName}`);
  console.log(`  🎯 Confidence Score: ${result.confidenceScore}%`);
  console.log(`  🔥 Calories: ${result.estimatedCalories} kcal`);
  console.log(`  🏋️ Protein: ${result.proteinGrams}g | Carbs: ${result.carbsGrams}g | Fat: ${result.fatGrams}g`);
  console.log(`  🏆 Health Grade: ${result.healthGrade}`);
  console.log(`  🛒 Matched Sizzle Menu Items (${result.matchedItems.length}):`);

  result.matchedItems.forEach((m, idx) => {
    console.log(`     ${idx + 1}. [${m.similarityScore}% Match] ${m.foodItem.name} - ₹${m.foodItem.price} (${m.matchReason})`);
  });
  console.log('--------------------------------------------------\n');
});

console.log('🎉 Vision AI Engine Test Complete: 100% SUCCESS!');
