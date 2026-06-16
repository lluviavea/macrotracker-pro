export interface NutritionEntry {
  matches: string[]
  nameEn: string
  protein: number
  fat: number
  carbs: number
  sugar?: number
  fiber?: number
  calories: number
  measureType: 'gram' | 'unit'
  unitName?: string
  unitGrams?: number
  preparation?: 'crudo' | 'cocido'
}

export const NUTRITION_DATA: NutritionEntry[] = [
  { matches: ['huevo', 'huevos'], nameEn: 'Egg', protein: 13, fat: 11, carbs: 1.1, sugar: 1.1, fiber: 0, calories: 155, measureType: 'unit', unitName: 'huevo', unitGrams: 60, preparation: 'crudo' },
  { matches: ['atun', 'atún'], nameEn: 'Tuna', protein: 26, fat: 1, carbs: 0, sugar: 0, fiber: 0, calories: 116, measureType: 'gram', preparation: 'crudo' },
  { matches: ['queso', 'quesos'], nameEn: 'Cheese', protein: 25, fat: 33, carbs: 1.3, sugar: 1.3, fiber: 0, calories: 402, measureType: 'gram', preparation: 'crudo' },
  { matches: ['cerdo'], nameEn: 'Pork', protein: 21, fat: 10, carbs: 0, sugar: 0, fiber: 0, calories: 180, measureType: 'gram', preparation: 'crudo' },
  { matches: ['res', 'carne de res', 'molida de res'], nameEn: 'Beef', protein: 26, fat: 15, carbs: 0, sugar: 0, fiber: 0, calories: 242, measureType: 'gram', preparation: 'crudo' },
  { matches: ['yogurt griego', 'yogur griego'], nameEn: 'Greek Yogurt', protein: 10, fat: 3, carbs: 4, sugar: 4, fiber: 0, calories: 97, measureType: 'gram', preparation: 'crudo' },
  { matches: ['salmon', 'salmón'], nameEn: 'Salmon', protein: 20, fat: 13, carbs: 0, sugar: 0, fiber: 0, calories: 208, measureType: 'gram', preparation: 'crudo' },
  { matches: ['pescado blanco', 'tilapia', 'mero'], nameEn: 'White Fish', protein: 20, fat: 1.7, carbs: 0, sugar: 0, fiber: 0, calories: 96, measureType: 'gram', preparation: 'crudo' },
  { matches: ['pechuga de pavo', 'pavo'], nameEn: 'Turkey Breast', protein: 22, fat: 1.6, carbs: 0, sugar: 0, fiber: 0, calories: 104, measureType: 'gram', preparation: 'crudo' },
  { matches: ['jamon de pavo', 'jamón de pavo'], nameEn: 'Turkey Ham', protein: 19, fat: 3, carbs: 2, sugar: 1, fiber: 0, calories: 110, measureType: 'gram', preparation: 'crudo' },
  { matches: ['claras de huevo', 'clara de huevo'], nameEn: 'Egg White', protein: 11, fat: 0.2, carbs: 0.7, sugar: 0.7, fiber: 0, calories: 52, measureType: 'gram', preparation: 'crudo' },
  { matches: ['cottage cheese', 'requeson', 'requesón'], nameEn: 'Cottage Cheese', protein: 11, fat: 4.3, carbs: 3.4, sugar: 2.7, fiber: 0, calories: 98, measureType: 'gram', preparation: 'crudo' },
  { matches: ['salchicha', 'salchichas'], nameEn: 'Sausage', protein: 13, fat: 18, carbs: 1, sugar: 1, fiber: 0, calories: 215, measureType: 'gram', preparation: 'crudo' },
  { matches: ['soya texturizada'], nameEn: 'Textured Soy', protein: 52, fat: 1, carbs: 33, sugar: 0, fiber: 13, calories: 290, measureType: 'gram', preparation: 'crudo' },
  { matches: ['tofu'], nameEn: 'Tofu', protein: 8, fat: 4, carbs: 2, sugar: 0.5, fiber: 0.5, calories: 76, measureType: 'gram', preparation: 'crudo' },
  { matches: ['pollo', 'pechuga'], nameEn: 'Chicken', protein: 31, fat: 3.6, carbs: 0, sugar: 0, fiber: 0, calories: 165, measureType: 'gram', preparation: 'crudo' },

  { matches: ['frijol', 'frijoles'], nameEn: 'Beans', protein: 21, fat: 1.2, carbs: 63, sugar: 2, fiber: 15, calories: 347, measureType: 'gram', preparation: 'cocido' },
  { matches: ['lentejas'], nameEn: 'Lentils', protein: 25, fat: 1.1, carbs: 60, sugar: 2, fiber: 11, calories: 353, measureType: 'gram', preparation: 'cocido' },
  { matches: ['garbanzo'], nameEn: 'Chickpea', protein: 19, fat: 6, carbs: 61, sugar: 11, fiber: 17, calories: 364, measureType: 'gram', preparation: 'cocido' },
  { matches: ['quinoa'], nameEn: 'Quinoa', protein: 14, fat: 6, carbs: 64, sugar: 0, fiber: 7, calories: 368, measureType: 'gram', preparation: 'cocido' },
  { matches: ['edamames', 'edamame'], nameEn: 'Edamame', protein: 12, fat: 5, carbs: 9, sugar: 3, fiber: 5, calories: 121, measureType: 'gram', preparation: 'cocido' },
  { matches: ['cacahuate'], nameEn: 'Peanuts', protein: 26, fat: 49, carbs: 16, sugar: 4, fiber: 9, calories: 567, measureType: 'gram', preparation: 'cocido' },
  { matches: ['arroz integral', 'arroz jazmin', 'arroz'], nameEn: 'Rice', protein: 2.6, fat: 0.3, carbs: 28, sugar: 0.1, fiber: 0.4, calories: 130, measureType: 'gram', preparation: 'cocido' },
  { matches: ['avena integral', 'avena'], nameEn: 'Oats', protein: 13.5, fat: 6.5, carbs: 66, sugar: 1, fiber: 10, calories: 379, measureType: 'gram', preparation: 'cocido' },
  { matches: ['tortilla de nopal'], nameEn: 'Nopal Tortilla', protein: 2, fat: 1, carbs: 15, sugar: 0, fiber: 3, calories: 80, measureType: 'unit', unitName: 'tortilla', unitGrams: 40, preparation: 'cocido' },
  { matches: ['tortilla de nixtamal'], nameEn: 'Corn Tortilla', protein: 2.5, fat: 0.5, carbs: 22, sugar: 0.5, fiber: 3, calories: 105, measureType: 'unit', unitName: 'tortilla', unitGrams: 45, preparation: 'cocido' },
  { matches: ['papa', 'papas'], nameEn: 'Potato', protein: 2, fat: 0.1, carbs: 20, sugar: 1, fiber: 2, calories: 87, measureType: 'gram', preparation: 'cocido' },
  { matches: ['camote', 'batata'], nameEn: 'Sweet Potato', protein: 1.6, fat: 0.1, carbs: 20, sugar: 6, fiber: 3, calories: 86, measureType: 'gram', preparation: 'cocido' },

  { matches: ['aceite de aguacate'], nameEn: 'Avocado Oil', protein: 0, fat: 100, carbs: 0, sugar: 0, fiber: 0, calories: 884, measureType: 'gram' },
  { matches: ['aceite de oliva'], nameEn: 'Olive Oil', protein: 0, fat: 100, carbs: 0, sugar: 0, fiber: 0, calories: 884, measureType: 'gram' },
  { matches: ['aceite de coco'], nameEn: 'Coconut Oil', protein: 0, fat: 100, carbs: 0, sugar: 0, fiber: 0, calories: 884, measureType: 'gram' },
  { matches: ['chia'], nameEn: 'Chia', protein: 17, fat: 31, carbs: 42, sugar: 0, fiber: 34, calories: 486, measureType: 'gram' },
  { matches: ['linaza'], nameEn: 'Flaxseed', protein: 18, fat: 42, carbs: 29, sugar: 0, fiber: 27, calories: 534, measureType: 'gram' },
  { matches: ['ghee'], nameEn: 'Ghee', protein: 0, fat: 99, carbs: 0, sugar: 0, fiber: 0, calories: 876, measureType: 'gram' },
  { matches: ['sesamo', 'ajonjolí'], nameEn: 'Sesame', protein: 18, fat: 50, carbs: 23, sugar: 0.5, fiber: 12, calories: 573, measureType: 'gram' },
  { matches: ['manteca de cerdo'], nameEn: 'Lard', protein: 0, fat: 100, carbs: 0, sugar: 0, fiber: 0, calories: 902, measureType: 'gram' },
  { matches: ['queso de cabra'], nameEn: 'Goat Cheese', protein: 21, fat: 30, carbs: 0, sugar: 0, fiber: 0, calories: 364, measureType: 'gram' },
  { matches: ['queso mozarella', 'mozarella'], nameEn: 'Mozzarella', protein: 22, fat: 22, carbs: 2.2, sugar: 1, fiber: 0, calories: 300, measureType: 'gram' },

  { matches: ['platano macho', 'plátano macho', 'platano'], nameEn: 'Plantain', protein: 1.1, fat: 0.3, carbs: 23, sugar: 12, fiber: 2.6, calories: 96, measureType: 'gram' },
  { matches: ['aguacate'], nameEn: 'Avocado', protein: 2, fat: 15, carbs: 9, sugar: 0.7, fiber: 6.7, calories: 160, measureType: 'gram' },
  { matches: ['mango'], nameEn: 'Mango', protein: 0.8, fat: 0.4, carbs: 15, sugar: 14, fiber: 1.6, calories: 60, measureType: 'gram' },
  { matches: ['papaya'], nameEn: 'Papaya', protein: 0.5, fat: 0.1, carbs: 11, sugar: 8, fiber: 1.7, calories: 43, measureType: 'gram' },
  { matches: ['frutos rojos', 'berries'], nameEn: 'Berries', protein: 0.7, fat: 0.3, carbs: 12, sugar: 5, fiber: 3, calories: 53, measureType: 'gram' },
  { matches: ['manzana verde'], nameEn: 'Green Apple', protein: 0.3, fat: 0.2, carbs: 14, sugar: 10, fiber: 2.5, calories: 58, measureType: 'gram' },
  { matches: ['piña'], nameEn: 'Pineapple', protein: 0.5, fat: 0.1, carbs: 13, sugar: 10, fiber: 1.4, calories: 50, measureType: 'gram' },
  { matches: ['sandia', 'sandía'], nameEn: 'Watermelon', protein: 0.6, fat: 0.2, carbs: 8, sugar: 6, fiber: 0.4, calories: 30, measureType: 'gram' },

  { matches: ['brocoli', 'brócoli'], nameEn: 'Broccoli', protein: 2.8, fat: 0.4, carbs: 7, sugar: 1.7, fiber: 2.6, calories: 34, measureType: 'gram' },
  { matches: ['coliflor'], nameEn: 'Cauliflower', protein: 1.9, fat: 0.3, carbs: 5, sugar: 2, fiber: 2, calories: 25, measureType: 'gram' },
  { matches: ['kale'], nameEn: 'Kale', protein: 4.3, fat: 0.9, carbs: 9, sugar: 0.9, fiber: 3.6, calories: 49, measureType: 'gram' },
  { matches: ['arugula', 'rúcula'], nameEn: 'Arugula', protein: 2.6, fat: 0.7, carbs: 3.7, sugar: 1, fiber: 1.5, calories: 25, measureType: 'gram' },
  { matches: ['pepino'], nameEn: 'Cucumber', protein: 0.7, fat: 0.1, carbs: 3.6, sugar: 1.7, fiber: 0.5, calories: 15, measureType: 'gram' },
  { matches: ['cilantro', 'cilantr'], nameEn: 'Cilantro', protein: 2.1, fat: 0.5, carbs: 3.7, sugar: 0.9, fiber: 2.8, calories: 23, measureType: 'gram' },
  { matches: ['champiñon', 'champiñones', 'hongo'], nameEn: 'Mushroom', protein: 3.1, fat: 0.3, carbs: 3.3, sugar: 1.7, fiber: 1, calories: 22, measureType: 'gram' },
  { matches: ['tomate', 'jitomate'], nameEn: 'Tomato', protein: 0.9, fat: 0.2, carbs: 3.9, sugar: 2.6, fiber: 1.2, calories: 18, measureType: 'gram' },
  { matches: ['zanahoria'], nameEn: 'Carrot', protein: 0.9, fat: 0.2, carbs: 10, sugar: 4.7, fiber: 2.8, calories: 41, measureType: 'gram' },
  { matches: ['ajo'], nameEn: 'Garlic', protein: 6.4, fat: 0.5, carbs: 33, sugar: 1, fiber: 2.1, calories: 149, measureType: 'gram' },
  { matches: ['cebolla'], nameEn: 'Onion', protein: 1.1, fat: 0.1, carbs: 9, sugar: 4, fiber: 1.7, calories: 40, measureType: 'gram' },
  { matches: ['pimiento', 'pimiento morron'], nameEn: 'Bell Pepper', protein: 1, fat: 0.3, carbs: 6, sugar: 2.5, fiber: 2, calories: 26, measureType: 'gram' },
  { matches: ['chiles', 'chile'], nameEn: 'Chili', protein: 1.9, fat: 0.4, carbs: 4.6, sugar: 2.5, fiber: 1.5, calories: 20, measureType: 'gram' },
  { matches: ['calabaza'], nameEn: 'Squash', protein: 1.1, fat: 0.1, carbs: 7, sugar: 3, fiber: 1, calories: 26, measureType: 'gram' },
  { matches: ['repollo', 'col'], nameEn: 'Cabbage', protein: 1.3, fat: 0.1, carbs: 6, sugar: 3, fiber: 2.5, calories: 25, measureType: 'gram' },
  { matches: ['esparrago', 'espárrago'], nameEn: 'Asparagus', protein: 2.2, fat: 0.2, carbs: 4, sugar: 2, fiber: 2, calories: 20, measureType: 'gram' },
  { matches: ['tomatillo'], nameEn: 'Tomatillo', protein: 0.9, fat: 0.3, carbs: 6, sugar: 3, fiber: 1.5, calories: 32, measureType: 'gram' },
  { matches: ['cebollin', 'cebollín'], nameEn: 'Chives', protein: 3.3, fat: 0.7, carbs: 7, sugar: 1.5, fiber: 2.6, calories: 30, measureType: 'gram' },
  { matches: ['puerro'], nameEn: 'Leek', protein: 1.5, fat: 0.3, carbs: 14, sugar: 3, fiber: 1.8, calories: 61, measureType: 'gram' },

  { matches: ['curcuma', 'cúrcuma'], nameEn: 'Turmeric', protein: 8, fat: 10, carbs: 65, sugar: 3, fiber: 21, calories: 354, measureType: 'gram' },
  { matches: ['jengibre'], nameEn: 'Ginger', protein: 1.8, fat: 0.8, carbs: 18, sugar: 1.7, fiber: 2, calories: 80, measureType: 'gram' },
  { matches: ['canela'], nameEn: 'Cinnamon', protein: 4, fat: 1.2, carbs: 80, sugar: 2, fiber: 53, calories: 247, measureType: 'gram' },
  { matches: ['ajo en polvo'], nameEn: 'Garlic Powder', protein: 16, fat: 0.7, carbs: 73, sugar: 2, fiber: 7, calories: 331, measureType: 'gram' },
  { matches: ['cebolla en polvo'], nameEn: 'Onion Powder', protein: 10, fat: 0.7, carbs: 79, sugar: 8, fiber: 11, calories: 341, measureType: 'gram' },
  { matches: ['oregano', 'orégano'], nameEn: 'Oregano', protein: 9, fat: 4.3, carbs: 69, sugar: 4, fiber: 38, calories: 265, measureType: 'gram' },
  { matches: ['sal de mar', 'sal'], nameEn: 'Salt', protein: 0, fat: 0, carbs: 0, sugar: 0, fiber: 0, calories: 0, measureType: 'gram' },
  { matches: ['limón en polvo'], nameEn: 'Lemon Powder', protein: 0, fat: 0, carbs: 0, sugar: 0, fiber: 0, calories: 0, measureType: 'gram' },
  { matches: ['clavo de olor'], nameEn: 'Clove', protein: 6, fat: 20, carbs: 66, sugar: 2, fiber: 32, calories: 323, measureType: 'gram' },
  { matches: ['romero'], nameEn: 'Rosemary', protein: 3.3, fat: 5.9, carbs: 64, sugar: 0, fiber: 0, calories: 131, measureType: 'gram' },
  { matches: ['tomillo'], nameEn: 'Thyme', protein: 5.6, fat: 1.7, carbs: 65, sugar: 0, fiber: 0, calories: 276, measureType: 'gram' },
  { matches: ['comino'], nameEn: 'Cumin', protein: 18, fat: 22, carbs: 44, sugar: 0, fiber: 10, calories: 375, measureType: 'gram' },
  { matches: ['paprika'], nameEn: 'Paprika', protein: 14, fat: 13, carbs: 54, sugar: 0, fiber: 0, calories: 282, measureType: 'gram' },
  { matches: ['laurel'], nameEn: 'Bay Leaf', protein: 7.6, fat: 8.4, carbs: 75, sugar: 0, fiber: 0, calories: 313, measureType: 'gram' },
  { matches: ['cacao'], nameEn: 'Cacao', protein: 20, fat: 23, carbs: 58, sugar: 1, fiber: 30, calories: 504, measureType: 'gram' },
  { matches: ['levadura nutricional'], nameEn: 'Nutritional Yeast', protein: 50, fat: 5, carbs: 35, sugar: 0, fiber: 0, calories: 400, measureType: 'gram' },
  { matches: ['extracto de vainilla'], nameEn: 'Vanilla Extract', protein: 0, fat: 0, carbs: 0, sugar: 0, fiber: 0, calories: 0, measureType: 'gram' },
  { matches: ['psyllum husk', 'psyllium'], nameEn: 'Psyllium Husk', protein: 0, fat: 0, carbs: 80, sugar: 0, fiber: 70, calories: 200, measureType: 'gram' },
  { matches: ['eritritol'], nameEn: 'Erythritol', protein: 0, fat: 0, carbs: 0, sugar: 0, fiber: 0, calories: 0, measureType: 'gram' },

  { matches: ['glicinato de magnesio', 'magnesio'], nameEn: 'Magnesium Glycinate', protein: 0, fat: 0, carbs: 0, sugar: 0, fiber: 0, calories: 0, measureType: 'unit', unitName: 'cápsula', unitGrams: 0 },
  { matches: ['vitamina d3', 'vitamina d', 'd3+k2'], nameEn: 'Vitamin D3', protein: 0, fat: 0, carbs: 0, sugar: 0, fiber: 0, calories: 0, measureType: 'unit', unitName: 'gota', unitGrams: 0 },
  { matches: ['omega 3'], nameEn: 'Omega 3', protein: 0, fat: 0, carbs: 0, sugar: 0, fiber: 0, calories: 0, measureType: 'unit', unitName: 'cápsula', unitGrams: 0 },
  { matches: ['l-leanina', 'l teanina'], nameEn: 'L-Theanine', protein: 0, fat: 0, carbs: 0, sugar: 0, fiber: 0, calories: 0, measureType: 'unit', unitName: 'cápsula', unitGrams: 0 },
  { matches: ['ashwagandha'], nameEn: 'Ashwagandha', protein: 0, fat: 0, carbs: 0, sugar: 0, fiber: 0, calories: 0, measureType: 'unit', unitName: 'cápsula', unitGrams: 0 },
  { matches: ['probioticos', 'probióticos'], nameEn: 'Probiotics', protein: 0, fat: 0, carbs: 0, sugar: 0, fiber: 0, calories: 0, measureType: 'unit', unitName: 'cápsula', unitGrams: 0 },
  { matches: ['vitamina c'], nameEn: 'Vitamin C', protein: 0, fat: 0, carbs: 0, sugar: 0, fiber: 0, calories: 0, measureType: 'unit', unitName: 'tableta', unitGrams: 0 },
]
