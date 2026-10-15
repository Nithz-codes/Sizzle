import { FoodItem, DishReview } from '../types';

export interface DishDetailExtension {
  ingredients: string[];
  allergens: string[];
  chefNotes: string;
  reviews: DishReview[];
}

export const DISH_DETAILS_DATABASE: Record<number, DishDetailExtension> = {
  // Burgers & Sandwiches
  1: {
    ingredients: ['Crispy Farm-Fresh Veg Patty', 'Artisanal Brioche Bun', 'Vine Tomatoes', 'Crisp Iceberg Lettuce', 'House Garlic Aioli', 'Dill Pickles'],
    allergens: ['Gluten (Wheat)', 'Dairy', 'Mustard'],
    chefNotes: 'Patty is handmade every morning with garden peas, sweet corn, russet potatoes, and our proprietary spice rub.',
    reviews: [
      { id: 'rev-1-1', userName: 'Ananya Sharma', rating: 5, date: '2 days ago', comment: 'Hands down the crispiest veg burger in the city! The garlic aioli is to die for.', verifiedDiner: true, helpfulCount: 14 },
      { id: 'rev-1-2', userName: 'Rohan Mehta', rating: 4, date: '1 week ago', comment: 'Bun was super soft and fresh. Great value for money.', verifiedDiner: true, helpfulCount: 6 },
      { id: 'rev-1-3', userName: 'Priya Nair', rating: 5, date: '2 weeks ago', comment: 'Perfect crunch and not oily at all. Loved the fresh lettuce crunch.', verifiedDiner: true, helpfulCount: 9 },
    ],
  },
  2: {
    ingredients: ['Spiced Vegetable Cutlet', 'Melted Aged Cheddar', 'Caramelized Sweet Onions', 'Toasted Sesame Bun', 'Pickled Jalapeños', 'Signature Relish Sauce'],
    allergens: ['Dairy (Cheddar)', 'Gluten (Wheat)', 'Sesame'],
    chefNotes: 'Double-melted aged cheddar over slow-caramelized onions gives this burger its signature rich umami depth.',
    reviews: [
      { id: 'rev-2-1', userName: 'Vikram Joshi', rating: 5, date: 'Yesterday', comment: 'The cheese melt on this is insane! Gooey and flavorful.', verifiedDiner: true, helpfulCount: 19 },
      { id: 'rev-2-2', userName: 'Kavita Menon', rating: 5, date: '4 days ago', comment: 'Caramelized onions elevate this to a gourmet standard.', verifiedDiner: true, helpfulCount: 8 },
    ],
  },
  3: {
    ingredients: ['Crispy Buttermilk Chicken Breast', 'Brioche Bun', 'Creamy Slaw', 'Smoked Paprika Mayo', 'Crunchy Gherkins'],
    allergens: ['Gluten (Wheat)', 'Dairy (Buttermilk)', 'Eggs'],
    chefNotes: 'Brined in cultured buttermilk for 8 hours for supreme tenderness, then double-dredged for maximum golden crunch.',
    reviews: [
      { id: 'rev-3-1', userName: 'Arjun Das', rating: 5, date: '3 days ago', comment: 'Crispy on the outside, insanely juicy inside! Reminds me of Nashville style fried chicken.', verifiedDiner: true, helpfulCount: 23 },
      { id: 'rev-3-2', userName: 'Sneha Roy', rating: 4, date: '5 days ago', comment: 'Generous chicken fillet and smoky mayo was top tier.', verifiedDiner: true, helpfulCount: 11 },
    ],
  },
  4: {
    ingredients: ['Twin Grilled Chicken Patties', 'Smoked Bacon Relish', 'Double American Cheese', 'Pickled Jalapeños', 'Hickory BBQ Glaze', 'Brioche Bun'],
    allergens: ['Gluten (Wheat)', 'Dairy', 'Eggs'],
    chefNotes: 'A serious protein powerhouse (46g protein). Grilled over lava stones for authentic smoky char marks.',
    reviews: [
      { id: 'rev-4-1', userName: 'Tanmay K.', rating: 5, date: 'Yesterday', comment: 'Post workout beast meal! 46g protein and tastes heavenly.', verifiedDiner: true, helpfulCount: 31 },
      { id: 'rev-4-2', userName: 'Aditya Rao', rating: 5, date: '1 week ago', comment: 'Extremely filling and the smoky BBQ sauce balances the spice perfectly.', verifiedDiner: true, helpfulCount: 15 },
    ],
  },
  5: {
    ingredients: ['Multigrain Farm Bread', 'Sliced English Cucumbers', 'Vine Tomatoes', 'Green Bell Peppers', 'Spicy Mint & Coriander Chutney', 'Chaat Masala'],
    allergens: ['Gluten (Wheat)'],
    chefNotes: 'Stoneground artisanal multigrain bread paired with fresh garden veggies and freshly ground chaat spices.',
    reviews: [
      { id: 'rev-5-1', userName: 'Meera Patel', rating: 5, date: '3 days ago', comment: 'Healthy, refreshing, and clean. Mint chutney is zesty and homemade!', verifiedDiner: true, helpfulCount: 7 },
      { id: 'rev-5-2', userName: 'Suresh B.', rating: 4, date: '1 week ago', comment: 'Great light lunch. Low calorie and satisfying.', verifiedDiner: true, helpfulCount: 3 },
    ],
  },
  6: {
    ingredients: ['Artisanal White Bread', 'Shredded Mozzarella & Processed Cheese', 'Sweet Corn Kernels', 'Capsicum Juliennes', 'Butter Toasting', 'Oregano Herb Rub'],
    allergens: ['Dairy (Butter, Mozzarella)', 'Gluten (Wheat)'],
    chefNotes: 'Pressed on high-heat cast iron grill plates with rich butter until golden brown and crackling.',
    reviews: [
      { id: 'rev-6-1', userName: 'Deepak V.', rating: 5, date: '2 days ago', comment: 'Crispy buttery crust with glorious cheese pull.', verifiedDiner: true, helpfulCount: 12 },
    ],
  },
  7: {
    ingredients: ['Triple Deck Toasted Bread', 'Shredded Roasted Chicken', 'Boiled Egg Slices', 'Crisp Lettuce', 'Cheddar Slice', 'Herb Mayonnaise'],
    allergens: ['Gluten (Wheat)', 'Eggs', 'Dairy'],
    chefNotes: 'Classic 3-tier presentation skewered and served with a side of crispy fries and garlic dip.',
    reviews: [
      { id: 'rev-7-1', userName: 'Karan G.', rating: 5, date: '4 days ago', comment: 'Huge portion size! Three layers loaded with real chicken and eggs.', verifiedDiner: true, helpfulCount: 18 },
    ],
  },

  // Pizzas
  8: {
    ingredients: ['00 Flour Hand-Tossed Dough', 'San Marzano Tomato Sauce', 'Fresh Fior di Latte Mozzarella', 'Extra Virgin Olive Oil', 'Fresh Sweet Basil Leaves'],
    allergens: ['Gluten (Wheat)', 'Dairy (Mozzarella)'],
    chefNotes: 'Fermented for 48 hours for light, airy crust with signature leopard-spotting in our 450°C stone oven.',
    reviews: [
      { id: 'rev-8-1', userName: 'Chef Lorenzo S.', rating: 5, date: 'Yesterday', comment: 'Authentic Neapolitan crust with real San Marzano tomatoes. Outstanding!', verifiedDiner: true, helpfulCount: 42 },
      { id: 'rev-8-2', userName: 'Pooja Hegde', rating: 5, date: '3 days ago', comment: 'Simple ingredients done to perfection. The basil aroma is intoxicating.', verifiedDiner: true, helpfulCount: 14 },
    ],
  },
  9: {
    ingredients: ['Stone-Baked Pizza Crust', 'Herbed Tomato Sauce', 'Sliced Button Mushrooms', 'Black Olives', 'Diced Bell Peppers', 'Sweet Corn', 'Mozzarella'],
    allergens: ['Gluten (Wheat)', 'Dairy (Mozzarella)'],
    chefNotes: 'Farm-picked vegetables flash-roasted right on the pizza to retain crisp bite and natural sweetness.',
    reviews: [
      { id: 'rev-9-1', userName: 'Rahul Sen', rating: 5, date: '2 days ago', comment: 'Loaded with veggies and cheese. My family favorite for movie nights.', verifiedDiner: true, helpfulCount: 15 },
    ],
  },
  10: {
    ingredients: ['Thin Crust Dough', 'Spicy Marinara', 'Paneer Tikka Cubes', 'Red Paprika', 'Baby Corn', 'Golden Mozzarella', 'Italian Oregano'],
    allergens: ['Gluten (Wheat)', 'Dairy'],
    chefNotes: 'Cottage cheese marinated in tandoori spices meets authentic Italian pizza craft.',
    reviews: [
      { id: 'rev-10-1', userName: 'Nitin K.', rating: 5, date: '3 days ago', comment: 'The paneer tikka topping has incredible flavor with the spicy marinara.', verifiedDiner: true, helpfulCount: 11 },
    ],
  },
  11: {
    ingredients: ['Artisanal Crust', 'Italian Cured Pepperoni', 'Smoked Mozzarella', 'Crushed Chilli Flakes', 'Hot Honey Drizzle', 'Rich Tomato Base'],
    allergens: ['Gluten (Wheat)', 'Dairy'],
    chefNotes: 'Crisp cupped pepperoni slices with a subtle drizzle of hot chili-infused wild flower honey.',
    reviews: [
      { id: 'rev-11-1', userName: 'Daniel Miller', rating: 5, date: 'Yesterday', comment: 'The hot honey drizzle on pepperoni is a stroke of culinary genius!', verifiedDiner: true, helpfulCount: 29 },
    ],
  },

  // Pastas
  12: {
    ingredients: ['Durum Wheat Penne Rigate', 'Crushed San Marzano Tomatoes', 'Fresh Garlic', 'Extra Virgin Olive Oil', 'Red Pepper Flakes (Peperoncino)', 'Chopped Parsley'],
    allergens: ['Gluten (Durum Wheat)'],
    chefNotes: 'Cooked strictly al-dente. Emulsified with starchy pasta cooking water for a glossy, clinging tomato coating.',
    reviews: [
      { id: 'rev-12-1', userName: 'Anil Kapoor', rating: 5, date: '5 days ago', comment: 'Zesty, spicy, and the penne has the perfect bite. Truly authentic Italian.', verifiedDiner: true, helpfulCount: 16 },
    ],
  },
  13: {
    ingredients: ['Fettuccine Ribbons', 'European Heavy Cream', 'Parmigiano-Reggiano', 'Cultured Butter', 'Cracked Black Pepper', 'Nutmeg Touch'],
    allergens: ['Dairy (Cream, Butter, Parmesan)', 'Gluten (Wheat)'],
    chefNotes: 'Silky, velvety sauce simmered to order with aged 24-month parmesan cheese.',
    reviews: [
      { id: 'rev-13-1', userName: 'Shalini Verma', rating: 5, date: '2 days ago', comment: 'Rich, luscious, and comforting. The cracked black pepper cuts right through the richness.', verifiedDiner: true, helpfulCount: 21 },
    ],
  },
  14: {
    ingredients: ['Penne Pasta', 'Pan-Seared Chicken Strips', 'Garlic Parmesan Cream', 'Sautéed Baby Spinach', 'Toasted Pine Nuts'],
    allergens: ['Gluten (Wheat)', 'Dairy', 'Tree Nuts (Pine nuts)'],
    chefNotes: 'Chicken strips are seared in olive oil with rosemary before folding into the parmesan cream reduction.',
    reviews: [
      { id: 'rev-14-1', userName: 'Gaurav Roy', rating: 5, date: '3 days ago', comment: 'Huge portions of juicy chicken and the sauce is so creamy. 10/10.', verifiedDiner: true, helpfulCount: 13 },
    ],
  },
  15: {
    ingredients: ['Fusilli Spirals', 'Fresh Genovese Basil Pesto', 'Extra Virgin Olive Oil', 'Crushed Garlic', 'Roasted Walnuts', 'Parmesan', 'Cherry Tomatoes'],
    allergens: ['Gluten (Wheat)', 'Dairy', 'Tree Nuts (Walnuts)'],
    chefNotes: 'Fresh basil cold-ground with extra virgin olive oil to preserve vibrant green color and aromatic essential oils.',
    reviews: [
      { id: 'rev-15-1', userName: 'Divya S.', rating: 5, date: '6 days ago', comment: 'Vibrant green, intensely fragrant, and super fresh. You can taste the real basil.', verifiedDiner: true, helpfulCount: 8 },
    ],
  },

  // Chinese & Wok
  16: {
    ingredients: ['Long-Grain Jasmine Rice', 'Wok-Charred Spring Onions', 'Diced Carrots & Beans', 'Light Soy Sauce', 'Toasted Sesame Oil', 'White Pepper'],
    allergens: ['Soy', 'Sesame'],
    chefNotes: 'Tossed in a searing-hot seasoned carbon steel wok to achieve authentic "Wok Hei" (breath of the wok).',
    reviews: [
      { id: 'rev-16-1', userName: 'Manoj Pillai', rating: 5, date: '4 days ago', comment: 'Real wok hei flavor! Grains of rice are separate and non-greasy.', verifiedDiner: true, helpfulCount: 10 },
    ],
  },
  17: {
    ingredients: ['Aromatic Rice', 'Tender Chicken Cubes', 'House Schezwan Chilli Paste', 'Szechuan Peppercorns', 'Garlic Scallions', 'Dark Soy Sauce'],
    allergens: ['Soy', 'Sesame'],
    chefNotes: 'Our house-made Schezwan oil infuses authentic tingling mala heat from hand-pounded red chilies.',
    reviews: [
      { id: 'rev-17-1', userName: 'Karthik N.', rating: 5, date: 'Yesterday', comment: 'Spicy kick is addictive! Chicken is moist and well distributed.', verifiedDiner: true, helpfulCount: 17 },
    ],
  },
  18: {
    ingredients: ['Eggless Wheat Noodles', 'Shredded Cabbage', 'Carrot Ribbons', 'Bell Peppers', 'Garlic Ginger Oil', 'Spring Onion Greens'],
    allergens: ['Gluten (Wheat)', 'Soy'],
    chefNotes: 'Flash-tossed with crisp shredded vegetables and light seasonings for that street-style nostalgia.',
    reviews: [
      { id: 'rev-18-1', userName: 'Swati R.', rating: 4, date: '1 week ago', comment: 'Great texture on noodles, very nostalgic and satisfying.', verifiedDiner: true, helpfulCount: 5 },
    ],
  },
  19: {
    ingredients: ['Wok Noodles', 'Braised Diced Chicken', 'Fiery Manchow Broth Reduction', 'Crispy Fried Noodle Topping', 'Fresh Coriander', 'Chilli Garlic Oil'],
    allergens: ['Gluten (Wheat)', 'Soy'],
    chefNotes: 'Served crowned with our golden crisp noodles for a delightful crunch in every spicy bite.',
    reviews: [
      { id: 'rev-19-1', userName: 'Varun T.', rating: 5, date: '3 days ago', comment: 'Spicy, tangy, and the crispy fried noodles on top are perfection.', verifiedDiner: true, helpfulCount: 12 },
    ],
  },

  // Biryanis
  20: {
    ingredients: ['Aged Daawat Basmati Rice', 'Seasonal Cauliflower & Beans', 'Baby Potatoes', 'Shahi Garam Masala', 'Browned Onions (Birista)', 'Pure Desi Ghee'],
    allergens: ['Dairy (Desi Ghee)'],
    chefNotes: 'Cooked in sealed copper handis over slow charcoal embers (Dum Pukht technique) to seal in fragrant steam.',
    reviews: [
      { id: 'rev-20-1', userName: 'Sanjay Gupta', rating: 5, date: '2 days ago', comment: 'Who says veg biryani is just pulao? This has authentic dum layers and rich aroma!', verifiedDiner: true, helpfulCount: 22 },
    ],
  },
  21: {
    ingredients: ['Aged Basmati Rice', 'Malai Paneer Cubes (Cottage Cheese)', 'Saffron Milk Infusion', 'Kewra & Rose Water', 'Ghee-Fried Cashews', 'Fresh Mint'],
    allergens: ['Dairy (Paneer, Ghee, Milk)', 'Tree Nuts (Cashews)'],
    chefNotes: 'Soft melt-in-mouth cottage cheese marinated in hung curd and toasted cumin before layering.',
    reviews: [
      { id: 'rev-21-1', userName: 'Aishwarya M.', rating: 5, date: 'Yesterday', comment: 'Paneer is so soft and juicy! Saffron fragrance fills the entire room.', verifiedDiner: true, helpfulCount: 19 },
    ],
  },
  22: {
    ingredients: ['Basmati Rice', 'Farm Golden Eggs', 'Spiced Caramelized Onion Gravy', 'Star Anise & Green Cardamom', 'Desi Ghee', 'Coriander Garnish'],
    allergens: ['Eggs', 'Dairy (Ghee)'],
    chefNotes: 'Eggs are pan-roasted with turmeric and Kashmiri chili until golden-blistered before dum cooking.',
    reviews: [
      { id: 'rev-22-1', userName: 'Siddharth P.', rating: 5, date: '4 days ago', comment: 'The masala-coated eggs give every bite a rich flavor.', verifiedDiner: true, helpfulCount: 9 },
    ],
  },
  23: {
    ingredients: ['Royal Aged Basmati', 'Farm-Raised Chicken Leg & Breast Pieces', 'Kashmiri Saffron Strands', 'Caramelized Crispy Birista', 'Pure Cow Ghee', 'Whole Spices (Cardamom, Cinnamon, Bay Leaf)'],
    allergens: ['Dairy (Ghee, Curd)'],
    chefNotes: 'Marinated for 14 hours in ginger-garlic paste, yogurt, and 18 hand-ground royal spices. Cooked under dough-sealed copper handis.',
    reviews: [
      { id: 'rev-23-1', userName: 'Farhan Akhtar', rating: 5, date: 'Yesterday', comment: 'Undisputed king of biryanis in this city. Chicken falls off the bone!', verifiedDiner: true, helpfulCount: 64 },
      { id: 'rev-23-2', userName: 'Meenakshi Sundaram', rating: 5, date: '3 days ago', comment: 'Fragrant, rich, and not overly spicy. The mirchi ka salan pairing is superb.', verifiedDiner: true, helpfulCount: 28 },
    ],
  },
  24: {
    ingredients: ['Slow-Cooked Tender Mutton Cuts', 'Basmati Rice', 'Rich Bone Marrow Juices', 'Saffron & Mace (Javitri)', 'Desi Ghee', 'Fried Onions'],
    allergens: ['Dairy (Ghee)'],
    chefNotes: 'Selected bone-in mutton cuts slow-braised for 3 hours until gelatinous and tender.',
    reviews: [
      { id: 'rev-24-1', userName: 'Harish Babu', rating: 5, date: '2 days ago', comment: 'Tender mutton that literally melts in your mouth. Rich and royal.', verifiedDiner: true, helpfulCount: 35 },
    ],
  },
  25: {
    ingredients: ['Basmati Rice', 'Spiced Chicken Pieces', 'Boiled Golden Egg', 'Hyderabadi Gravy Base', 'Green Chilies', 'Crispy Cashews & Raisins'],
    allergens: ['Eggs', 'Dairy', 'Tree Nuts (Cashews)'],
    chefNotes: 'Authentic Nizami blend with fiery green chilies and cooling mint.',
    reviews: [
      { id: 'rev-25-1', userName: 'Kiran Reddy', rating: 5, date: '5 days ago', comment: 'True Hyderabadi flavor with authentic spice level. Highly recommended!', verifiedDiner: true, helpfulCount: 20 },
    ],
  },

  // Indian Curries
  26: {
    ingredients: ['Fresh Malai Paneer Cubes', 'Slow-Simmered Tomato Cashew Gravy', 'White Butter (Makhan)', 'Heavy Cream', 'Kasuri Methi (Fenugreek Leaves)', 'Kashmiri Chilli'],
    allergens: ['Dairy (Paneer, Butter, Cream)', 'Tree Nuts (Cashews)'],
    chefNotes: 'Silky, velvety gravy strained twice to achieve butter-smooth perfection without any grit.',
    reviews: [
      { id: 'rev-26-1', userName: 'Sunita Agarwal', rating: 5, date: 'Yesterday', comment: 'Best Paneer Butter Masala ever! Mildly sweet, creamy and pairs heavenly with Garlic Naan.', verifiedDiner: true, helpfulCount: 31 },
      { id: 'rev-26-2', userName: 'Amitabh S.', rating: 5, date: '4 days ago', comment: 'The fenugreek herb touch at the end makes this restaurant-quality perfection.', verifiedDiner: true, helpfulCount: 14 },
    ],
  },
  27: {
    ingredients: ['Succulent Chicken Chunks', 'Crushed Coriander & Fennel Seeds', 'Red Bell Peppers', 'Onion Petals', 'Fresh Ginger & Green Chillies', 'Iron Kadai Gravy'],
    allergens: ['Dairy'],
    chefNotes: 'Simmered in an authentic cast iron kadai with freshly roasted whole coriander seeds and dried red chilies.',
    reviews: [
      { id: 'rev-27-1', userName: 'Rajesh Nair', rating: 5, date: '2 days ago', comment: 'Robust, spicy and bold flavors. The capsicum adds a lovely crunch.', verifiedDiner: true, helpfulCount: 16 },
    ],
  },
  28: {
    ingredients: ['Black Urad Lentils (Whole Gram)', 'Red Kidney Beans (Rajma)', 'Slow-Cooked Dairy Cream', 'Churned Butter', 'Tomato Puree', 'Smoked Charcoal Flavour'],
    allergens: ['Dairy (Cream, Butter)'],
    chefNotes: 'Slow-simmered for 24 continuous hours on tandoor embers. Finished with a smoky dhungar charcoal infusion.',
    reviews: [
      { id: 'rev-28-1', userName: 'Manpreet Singh', rating: 5, date: 'Yesterday', comment: 'Legendary Dal Makhani! You can taste the 24-hour slow cooking in every spoonful.', verifiedDiner: true, helpfulCount: 45 },
    ],
  },
  29: {
    ingredients: ['Tandoor-Charred Chicken Tikka', 'Spiced Tomato Onion Masala', 'Fresh Cream', 'Kasuri Methi', 'Ginger Juliennes', 'Coriander'],
    allergens: ['Dairy (Cream, Curd, Butter)'],
    chefNotes: 'Smoky clay-oven charred chicken tikka pieces finished in an aromatic spiced red gravy.',
    reviews: [
      { id: 'rev-29-1', userName: 'Naveen Kumar', rating: 5, date: '3 days ago', comment: 'Rich, smoky, and the chicken is incredibly tender.', verifiedDiner: true, helpfulCount: 18 },
    ],
  },

  // Breads
  30: {
    ingredients: ['Whole Wheat Atta', 'Water', 'Pinch of Sea Salt', 'Clay Tandoor Bake'],
    allergens: ['Gluten (Wheat)'],
    chefNotes: 'Hand-stretched whole wheat flatbread slapped on the walls of an earthen tandoor.',
    reviews: [
      { id: 'rev-30-1', userName: 'Ramesh G.', rating: 5, date: '5 days ago', comment: 'Crisp on the edges, soft in the center. Healthy and guilt-free.', verifiedDiner: true, helpfulCount: 7 },
    ],
  },
  31: {
    ingredients: ['Refined Maida Flour', 'Cultured Milk & Yogurt', 'Pure Salted Butter', 'Black Kalonji Seeds', 'Clay Tandoor Roast'],
    allergens: ['Gluten (Wheat)', 'Dairy (Butter, Milk)'],
    chefNotes: 'Brushed generously with melted butter as soon as it exits the blazing 400°C clay tandoor.',
    reviews: [
      { id: 'rev-31-1', userName: 'Zoya Khan', rating: 5, date: '2 days ago', comment: 'So buttery and pillowy soft. Pairs with every curry on the menu.', verifiedDiner: true, helpfulCount: 15 },
    ],
  },
  32: {
    ingredients: ['Refined Flour Dough', 'Minced Fresh Garlic Cloves', 'Chopped Coriander', 'Melted Butter', 'Tandoor Kissed'],
    allergens: ['Gluten (Wheat)', 'Dairy (Butter)'],
    chefNotes: 'Generously topped with roasted minced garlic that caramelizes against the tandoor walls.',
    reviews: [
      { id: 'rev-32-1', userName: 'Deepa Jain', rating: 5, date: 'Yesterday', comment: 'The roasted garlic aroma hits you the second the plate arrives. Fantastic!', verifiedDiner: true, helpfulCount: 22 },
    ],
  },
  33: {
    ingredients: ['Leavened Dough', 'Stuffed Mozzarella & Cheddar', 'Garlic Butter Glaze', 'Fresh Herb Sprinkling'],
    allergens: ['Gluten (Wheat)', 'Dairy (Cheese, Butter)'],
    chefNotes: 'Stuffed generously with stringy cheese that melts into molten deliciousness.',
    reviews: [
      { id: 'rev-33-1', userName: 'Kunal Shah', rating: 5, date: '3 days ago', comment: 'The ultimate cheese pull! More like a gourmet cheesy flatbread.', verifiedDiner: true, helpfulCount: 28 },
    ],
  },
  34: {
    ingredients: ['Whole Wheat & Maida', 'Layered Ghee Lamination', 'Ajwain (Carom Seeds)', 'Crispy Flaky Tawa Toasting'],
    allergens: ['Gluten (Wheat)', 'Dairy (Ghee)'],
    chefNotes: 'Hand-pleated into spiral layers with ghee to create countless crispy, flaky ribbons.',
    reviews: [
      { id: 'rev-34-1', userName: 'Prashant M.', rating: 5, date: '6 days ago', comment: 'Crispy flaky layers! Great with Dal Makhani.', verifiedDiner: true, helpfulCount: 9 },
    ],
  },

  // Grills & Tandoor
  35: {
    ingredients: ['Bone-In Chicken Halves', 'House Hickory BBQ Marinade', 'Brown Sugar Glaze', 'Crushed Black Pepper', 'Smoked Paprika', 'Lava Stone Sear'],
    allergens: ['Mustard'],
    chefNotes: 'Slow-smoked over hickory wood pellets then seared over red-hot lava rocks with caramelized glaze.',
    reviews: [
      { id: 'rev-35-1', userName: 'Jason D.', rating: 5, date: 'Yesterday', comment: 'Sweet, smoky, and sticky fingers good! 48g of pure protein.', verifiedDiner: true, helpfulCount: 30 },
    ],
  },
  36: {
    ingredients: ['Whole Chicken Drumsticks & Thighs', 'Hung Greek Yogurt', 'Mustard Oil (Sarson)', 'Kashmiri Degi Mirch', 'Garam Masala Rub', 'Charcoal Smoke'],
    allergens: ['Dairy (Yogurt)', 'Mustard'],
    chefNotes: 'Traditional 12-hour double marinade in spiced yogurt and mustard oil roasted on long iron skewers.',
    reviews: [
      { id: 'rev-36-1', userName: 'Suraj Rawat', rating: 5, date: '2 days ago', comment: 'Charred edges, juicy meat, and that distinct clay oven aroma. 54g protein winner!', verifiedDiner: true, helpfulCount: 38 },
    ],
  },
  37: {
    ingredients: ['Thick Paneer Blocks', 'Bell Pepper Petals', 'Red Onions', 'Ajwain Curd Marinade', 'Chaat Masala Dusting', 'Mint Chutney'],
    allergens: ['Dairy (Paneer, Curd)'],
    chefNotes: 'Skewered with fresh peppers and onions, roasted until blistered and smokey.',
    reviews: [
      { id: 'rev-37-1', userName: 'Neha Chawla', rating: 5, date: '3 days ago', comment: 'Paneer is pillowy soft and marinated to the core.', verifiedDiner: true, helpfulCount: 16 },
    ],
  },
  38: {
    ingredients: ['Boneless Chicken Breast Chunks', 'Heavy Clotted Cream (Malai)', 'Cashew Nut Paste', 'White Pepper & Cardamom', 'Green Cardamom Powder', 'Cheese Melt'],
    allergens: ['Dairy (Cream, Cheese)', 'Tree Nuts (Cashews)'],
    chefNotes: 'Mild, silky, and delicately perfumed with green cardamom and white pepper.',
    reviews: [
      { id: 'rev-38-1', userName: 'Ashwin K.', rating: 5, date: '4 days ago', comment: 'Melt in mouth texture with zero harsh spice. Kids and elders loved it alike!', verifiedDiner: true, helpfulCount: 21 },
    ],
  },
  39: {
    ingredients: ['Finely Minced Mutton', 'Fresh Mint & Coriander Leaves', 'Green Chillies', 'Mutton Fat Binder', 'Roasted Cumin & Coriander', 'Skewered Flame Char'],
    allergens: [],
    chefNotes: 'Triple-minced meat with exact 80/20 lean-to-fat ratio for supreme juiciness on the skewer.',
    reviews: [
      { id: 'rev-39-1', userName: 'Tariq Mansoor', rating: 5, date: 'Yesterday', comment: 'Succulent and juicy, not dry at all. The mint chutney accompaniment is perfect.', verifiedDiner: true, helpfulCount: 25 },
    ],
  },
  40: {
    ingredients: ['Silken Chicken Mince', 'Fresh Cream & Egg White', 'Saffron Strands', 'White Pepper', 'Silver Warq Finish', 'Lemon Wedges'],
    allergens: ['Eggs', 'Dairy'],
    chefNotes: 'Royal Awadhi recipe named "Reshmi" for its silk-like smooth texture.',
    reviews: [
      { id: 'rev-40-1', userName: 'Preeti Sharma', rating: 5, date: '5 days ago', comment: 'Silk smooth texture. Truly lives up to its name!', verifiedDiner: true, helpfulCount: 14 },
    ],
  },

  // Starters & Sides
  41: {
    ingredients: ['Select Russet Potatoes', 'Sea Salt', 'Vegetable Oil', 'House Seasoning Rub'],
    allergens: [],
    chefNotes: 'Double-fried: blanched at low temp for fluffy interior, then flash-crisped at high temp.',
    reviews: [
      { id: 'rev-41-1', userName: 'Rahul V.', rating: 5, date: 'Yesterday', comment: 'Golden, crispy, and stayed crunchy till the last fry!', verifiedDiner: true, helpfulCount: 12 },
    ],
  },
  42: {
    ingredients: ['Jumbo Chicken Wings', 'Spicy Buffalo Chili Glaze', 'Garlic Herb Butter', 'Celery Sticks', 'Blue Cheese Dip'],
    allergens: ['Dairy (Butter, Cheese)'],
    chefNotes: 'Tossed immediately in sizzling hot buffalo butter glaze right out of the fryer.',
    reviews: [
      { id: 'rev-42-1', userName: 'Mike Ross', rating: 5, date: '3 days ago', comment: 'Crispy skin with tangy, fiery glaze. Essential game-night snack.', verifiedDiner: true, helpfulCount: 24 },
    ],
  },
  43: {
    ingredients: ['Crisp Spring Roll Wrappers', 'Julienned Cabbage & Carrots', 'Glass Noodles', 'Sweet Chilli Dipping Sauce'],
    allergens: ['Gluten (Wheat)', 'Soy'],
    chefNotes: 'Golden fried with zero oil retention, packed with crunchy wok-tossed aromatics.',
    reviews: [
      { id: 'rev-43-1', userName: 'Alia Khan', rating: 4, date: '4 days ago', comment: 'Super crunchy and the sweet chilli sauce is delicious.', verifiedDiner: true, helpfulCount: 8 },
    ],
  },
  44: {
    ingredients: ['Sweet American Corn Kernels', 'Cornflour Crust', 'Black Pepper & Chaat Masala', 'Chopped Scallions', 'Lemon Juice'],
    allergens: [],
    chefNotes: 'Sweet corn pops with crisp outer shell and zesty chaat masala tang.',
    reviews: [
      { id: 'rev-44-1', userName: 'Geeta V.', rating: 5, date: '2 days ago', comment: 'Addictive! Couldn’t stop munching on this.', verifiedDiner: true, helpfulCount: 13 },
    ],
  },

  // Desserts
  45: {
    ingredients: ['Reduced Milk Solids (Khoya)', 'Cardamom Scented Sugar Syrup', 'Rose Water', 'Pistachio Slivers', 'Desi Ghee Frying'],
    allergens: ['Dairy (Khoya, Ghee)', 'Tree Nuts (Pistachios)'],
    chefNotes: 'Served warm. The dough balls soak in fragrant cardamom sugar syrup for a minimum of 4 hours.',
    reviews: [
      { id: 'rev-45-1', userName: 'Madhavan R.', rating: 5, date: 'Yesterday', comment: 'Melt-in-mouth warm gulab jamuns. Pure heaven with vanilla ice cream!', verifiedDiner: true, helpfulCount: 18 },
    ],
  },
  46: {
    ingredients: ['Belgian Dark Chocolate (70%)', 'Cultured Butter', 'Farm Fresh Eggs', 'Cacao Dust', 'Molten Chocolate Center'],
    allergens: ['Dairy (Butter)', 'Eggs', 'Gluten (Wheat)'],
    chefNotes: 'Baked to order so cutting into the soft cake releases a warm cascade of molten Belgian chocolate.',
    reviews: [
      { id: 'rev-46-1', userName: 'Natasha P.', rating: 5, date: '2 days ago', comment: 'The chocolate eruption is real! Decadent, rich, and high quality chocolate.', verifiedDiner: true, helpfulCount: 32 },
    ],
  },
  47: {
    ingredients: ['Artisanal Vanilla & Strawberry Scoops', 'Hot Chocolate Fudge', 'Roasted Almond Niblets', 'Maraschino Cherry', 'Whipped Cream'],
    allergens: ['Dairy (Milk, Cream)', 'Tree Nuts (Almonds)'],
    chefNotes: 'Classic 3-tier sundae with warm fudge dripping over chilled velvety gelato.',
    reviews: [
      { id: 'rev-47-1', userName: 'Kabir B.', rating: 5, date: '4 days ago', comment: 'Childhood nostalgia in a glass. Generous fudge and crunchy roasted almonds.', verifiedDiner: true, helpfulCount: 11 },
    ],
  },
  48: {
    ingredients: ['Soft Chenna Cottage Cheese Patties', 'Saffron Cardamom Infused Milk (Rabri)', 'Chilled Saffron Strands', 'Crushed Pistachios & Almonds'],
    allergens: ['Dairy (Milk, Chenna)', 'Tree Nuts (Pistachios, Almonds)'],
    chefNotes: 'Spongy chenna discs soaked in slow-condensed cardamom milk. Served chilled.',
    reviews: [
      { id: 'rev-48-1', userName: 'Rohini Iyer', rating: 5, date: '3 days ago', comment: 'Spongy, delicate, and not overly sweet. Royal saffron flavor.', verifiedDiner: true, helpfulCount: 17 },
    ],
  },

  // Beverages
  49: {
    ingredients: ['Double Espresso Shot (Arabica Beans)', 'Chilled Full Cream Milk', 'Chocolate Drizzle', 'Vanilla Ice Cream Scoop', 'Ice Cubes'],
    allergens: ['Dairy (Milk, Ice Cream)'],
    chefNotes: 'Blended with fresh espresso brewed from 100% shade-grown Coorg Arabica coffee beans.',
    reviews: [
      { id: 'rev-49-1', userName: 'Abhishek Roy', rating: 5, date: 'Yesterday', comment: 'Perfect caffeine kick! Rich, creamy and not too sweet.', verifiedDiner: true, helpfulCount: 19 },
    ],
  },
  50: {
    ingredients: ['Carbonated Filtered Water', 'Caramel Color', 'Caffeine', 'Natural Botanical Flavors', 'Fresh Lemon Wedge'],
    allergens: [],
    chefNotes: 'Served in an ice-cold vintage glass bottle with ice and a fresh lemon slice.',
    reviews: [
      { id: 'rev-50-1', userName: 'Dev K.', rating: 5, date: '1 week ago', comment: 'Classic chilled Coke. Pairs with everything.', verifiedDiner: true, helpfulCount: 6 },
    ],
  },
  51: {
    ingredients: ['Freshly Hand-Squeezed Persian Limes', 'Sparkling Mineral Soda', 'Rock Salt (Kala Namak)', 'Simple Cane Syrup', 'Mint Sprig'],
    allergens: [],
    chefNotes: 'The ultimate palate cleanser and refresher after a hearty gourmet feast.',
    reviews: [
      { id: 'rev-51-1', userName: 'Sanjay M.', rating: 5, date: '2 days ago', comment: 'Zesty, fizzy, and super refreshing. Sweet & salted mix is the way to go.', verifiedDiner: true, helpfulCount: 14 },
    ],
  },
  52: {
    ingredients: ['Belgian Cocoa Fudge', 'Dark Chocolate Ice Cream Scoops', 'Chilled Whole Milk', 'Whipped Cream Swirl', 'Chocolate Shavings'],
    allergens: ['Dairy (Milk, Cream)'],
    chefNotes: 'Ultra-thick shake that requires a wide straw. Made with pure chocolate gelato.',
    reviews: [
      { id: 'rev-52-1', userName: 'Shruti Sen', rating: 5, date: 'Yesterday', comment: 'Thick, creamy, and intensely chocolaty. Absolute heaven for chocoholics!', verifiedDiner: true, helpfulCount: 27 },
    ],
  },
};

/**
 * Intelligent Fallback Generator for any dynamic or newly added dish
 */
function generateFallbackDetails(item: FoodItem): DishDetailExtension {
  const isVeg = item.isVeg;
  const cat = item.category.toLowerCase();

  let ingredients: string[] = [];
  let allergens: string[] = [];
  let notes = `Handcrafted fresh to order by Sizzle's culinary team using farm-fresh ingredients.`;

  if (cat.includes('burger') || cat.includes('sandwich')) {
    ingredients = [
      isVeg ? 'Artisanal Veg Cutlet' : 'Premium Grilled Fillet',
      'Brioche Bun',
      'Crisp Lettuce',
      'Fresh Tomatoes',
      'Signature Aioli Sauce',
      'Aged Cheddar Slice',
    ];
    allergens = ['Gluten (Wheat)', 'Dairy'];
    notes = 'Toasted to golden perfection on our flat top grill.';
  } else if (cat.includes('pizza')) {
    ingredients = [
      'Italian 00 Flour Crust',
      'San Marzano Tomato Sauce',
      'Fior di Latte Mozzarella',
      isVeg ? 'Farm Fresh Vegetables' : 'Seasoned Meat Cuts',
      'Extra Virgin Olive Oil',
      'Fresh Sweet Basil',
    ];
    allergens = ['Gluten (Wheat)', 'Dairy'];
    notes = 'Baked in our 450°C stone oven for an airy, blistered crust.';
  } else if (cat.includes('pasta')) {
    ingredients = [
      'Durum Wheat Pasta',
      'Cold-Pressed Olive Oil',
      'Garlic & Fresh Herbs',
      'Parmesan Cheese',
      isVeg ? 'Sautéed Vegetables' : 'Pan-Seared Meat',
    ];
    allergens = ['Gluten (Wheat)', 'Dairy'];
    notes = 'Cooked strictly al-dente and tossed in slow-simmered artisanal sauce.';
  } else if (cat.includes('biryani')) {
    ingredients = [
      'Royal Aged Basmati Rice',
      isVeg ? 'Farm-Fresh Vegetables & Paneer' : 'Tender Marinated Cuts',
      'Kashmiri Saffron Infusion',
      'Desi Cow Ghee',
      'Crispy Birista (Browned Onions)',
      'Whole Shahi Spices',
    ];
    allergens = ['Dairy (Ghee)'];
    notes = 'Slow-cooked in dough-sealed copper handis over charcoal embers.';
  } else if (cat.includes('curry')) {
    ingredients = [
      isVeg ? 'Fresh Cottage Cheese (Paneer)' : 'Tender Chicken Pieces',
      'Slow-Simmered Tomato Onion Gravy',
      'Cultured Butter & Cream',
      'Kasuri Methi',
      'Fresh Ginger & Cilantro',
    ];
    allergens = ['Dairy'];
    notes = 'Simmered gently for hours for deep, harmonized flavor extraction.';
  } else if (cat.includes('dessert')) {
    ingredients = ['Pure Full-Cream Dairy', 'Organic Raw Sugar', 'Cardamom & Vanilla', 'Roasted Nut Flakes'];
    allergens = ['Dairy', 'Tree Nuts'];
    notes = 'Prepared daily by our pastry chef using artisanal techniques.';
  } else {
    ingredients = [
      isVeg ? 'Fresh Farm Harvest' : 'Tender Protein Cuts',
      'Cold-Pressed Oils',
      'Secret Sizzle Spice Rub',
      'Fresh Herbs & Seasoning',
    ];
    allergens = isVeg ? [] : ['Poultry/Meat'];
  }

  const reviews: DishReview[] = [
    {
      id: `fallback-rev-${item.id}-1`,
      userName: 'Aarav Mehta',
      rating: 5,
      date: '2 days ago',
      comment: `Incredible taste and aroma! ${item.name} was served piping hot and bursting with flavor.`,
      verifiedDiner: true,
      helpfulCount: 8,
    },
    {
      id: `fallback-rev-${item.id}-2`,
      userName: 'Priya Sundaram',
      rating: 4,
      date: '1 week ago',
      comment: `Great portion size and fresh ingredients. Definitely ordering again!`,
      verifiedDiner: true,
      helpfulCount: 4,
    },
  ];

  return {
    ingredients,
    allergens,
    chefNotes: notes,
    reviews,
  };
}

/**
 * Storage key for user reviews
 */
const STORAGE_PREFIX = 'sizzle_dish_user_reviews_';

/**
 * Load user reviews saved in localStorage for this dish
 */
export function getSavedUserReviews(dishId: number): DishReview[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${dishId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error reading dish reviews from localStorage', err);
  }
  return [];
}

/**
 * Save user review to localStorage
 */
export function saveDishReview(
  dishId: number,
  reviewInput: { userName: string; rating: number; comment: string }
): DishReview {
  const newReview: DishReview = {
    id: `user-rev-${dishId}-${Date.now()}`,
    userName: reviewInput.userName.trim() || 'Verified Gourmet Diner',
    rating: Math.max(1, Math.min(5, reviewInput.rating)),
    date: 'Just now',
    comment: reviewInput.comment.trim(),
    verifiedDiner: true,
    helpfulCount: 0,
  };

  if (typeof window !== 'undefined') {
    try {
      const existing = getSavedUserReviews(dishId);
      const updated = [newReview, ...existing];
      localStorage.setItem(`${STORAGE_PREFIX}${dishId}`, JSON.stringify(updated));
    } catch (err) {
      console.warn('Error saving dish review to localStorage', err);
    }
  }

  return newReview;
}

/**
 * Get comprehensive dish details including ingredients and merged reviews
 */
export function getDishFullDetails(item: FoodItem): {
  ingredients: string[];
  allergens: string[];
  chefNotes: string;
  reviews: DishReview[];
  averageRating: number;
  totalReviewCount: number;
  ratingDistribution: Record<number, number>;
} {
  const baseDetails = DISH_DETAILS_DATABASE[item.id] || generateFallbackDetails(item);
  const userReviews = getSavedUserReviews(item.id);

  // Merge reviews: user reviews first, then curated reviews
  const allReviews = [...userReviews, ...baseDetails.reviews];

  // Calculate actual average rating
  const totalStars = allReviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = allReviews.length > 0 ? Number((totalStars / allReviews.length).toFixed(1)) : (item.rating || 4.5);

  // Calculate rating distribution
  const ratingDistribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  allReviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating)));
    ratingDistribution[star] = (ratingDistribution[star] || 0) + 1;
  });

  return {
    ingredients: item.ingredients && item.ingredients.length > 0 ? item.ingredients : baseDetails.ingredients,
    allergens: item.allergens && item.allergens.length > 0 ? item.allergens : baseDetails.allergens,
    chefNotes: item.chefNotes || baseDetails.chefNotes,
    reviews: allReviews,
    averageRating,
    totalReviewCount: allReviews.length,
    ratingDistribution,
  };
}
