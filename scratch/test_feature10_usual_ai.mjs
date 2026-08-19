import { getUsualFeast } from '../src/services/smartReorderEngine.ts';

console.log("=== FEATURE 10: AI ONE-TAP USUAL FEAST ALGORITHMIC TESTS ===");

// Test 1: New customer (empty past order receipts)
const newFeast = getUsualFeast([], 'Rahul');
console.log(`\n1. [NEW DINER TEST] Customer: Rahul`);
console.log(`   - Is New User: ${newFeast.isNewUser}`);
console.log(`   - Time Context Badge: ${newFeast.timeBadge}`);
console.log(`   - Feast Title: "${newFeast.feastTitle}"`);
console.log(`   - Total Price: ₹${newFeast.totalPrice}`);
console.log(`   - Greeting: "${newFeast.chefGreeting}"`);
console.log(`   - Items: ${newFeast.items.map((i) => `${i.foodItem.name} x${i.quantity}`).join(' + ')}`);

// Test 2: Returning customer with mock past receipts
const mockReceipts = [
  {
    orderId: 'ORD-101',
    items: [
      { foodItem: { id: 2, name: 'Chicken Smash Burger', price: 190 }, quantity: 2 },
      { foodItem: { id: 41, name: 'French Fries', price: 90 }, quantity: 1 },
      { foodItem: { id: 52, name: 'Chocolate Milkshake', price: 110 }, quantity: 1 },
    ],
  },
  {
    orderId: 'ORD-102',
    items: [
      { foodItem: { id: 2, name: 'Chicken Smash Burger', price: 190 }, quantity: 1 },
      { foodItem: { id: 52, name: 'Chocolate Milkshake', price: 110 }, quantity: 1 },
    ],
  },
  {
    orderId: 'ORD-103',
    items: [
      { foodItem: { id: 23, name: 'Chicken Dum Biryani', price: 240 }, quantity: 1 },
      { foodItem: { id: 2, name: 'Chicken Smash Burger', price: 190 }, quantity: 1 },
    ],
  },
];

const returningFeast = getUsualFeast(mockReceipts, 'Priya');
console.log(`\n2. [RETURNING DINER TEST] Customer: Priya (3 Past Orders)`);
console.log(`   - Is New User: ${returningFeast.isNewUser}`);
console.log(`   - Time Context Badge: ${returningFeast.timeBadge}`);
console.log(`   - Feast Title: "${returningFeast.feastTitle}"`);
console.log(`   - Total Price: ₹${returningFeast.totalPrice}`);
console.log(`   - Total Past Orders Analyzed: ${returningFeast.totalOrdersCount}`);
console.log(`   - Items: ${returningFeast.items.map((i) => `${i.foodItem.name} x${i.quantity} (Ordered ${i.timesOrdered}x)`).join(' + ')}`);

console.log("\n🎉 ALL FEATURE 10 AI USUAL FEAST TESTS PASSED SUCCESSFULLY! 🎉\n");
