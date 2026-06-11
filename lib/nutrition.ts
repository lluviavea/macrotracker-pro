export interface NutritionEntry {
  matches: string[]
  protein: number
  fat: number
  carbs: number
  calories: number
  measureType: 'gram' | 'unit'
  unitName?: string
  unitGrams?: number
  preparation?: 'crudo' | 'cocido'
}

export const NUTRITION_DATA: NutritionEntry[] = [
  { matches: ['huevo', 'huevos'], protein: 13, fat: 11, carbs: 1.1, calories: 155, measureType: 'unit', unitName: 'huevo', unitGrams: 60, preparation: 'crudo' },
  { matches: ['atun', 'atún'], protein: 26, fat: 1, carbs: 0, calories: 116, measureType: 'gram', preparation: 'crudo' },
  { matches: ['queso', 'quesos'], protein: 25, fat: 33, carbs: 1.3, calories: 402, measureType: 'gram', preparation: 'crudo' },
  { matches: ['cerdo'], protein: 21, fat: 10, carbs: 0, calories: 180, measureType: 'gram', preparation: 'crudo' },
  { matches: ['res', 'carne de res', 'molida de res'], protein: 26, fat: 15, carbs: 0, calories: 242, measureType: 'gram', preparation: 'crudo' },
  { matches: ['yogurt griego', 'yogur griego'], protein: 10, fat: 3, carbs: 4, calories: 97, measureType: 'gram', preparation: 'crudo' },
  { matches: ['soya texturizada'], protein: 52, fat: 1, carbs: 33, calories: 290, measureType: 'gram', preparation: 'crudo' },
  { matches: ['tofu'], protein: 8, fat: 4, carbs: 2, calories: 76, measureType: 'gram', preparation: 'crudo' },
  { matches: ['pollo', 'pechuga'], protein: 31, fat: 3.6, carbs: 0, calories: 165, measureType: 'gram', preparation: 'crudo' },

  { matches: ['frijol', 'frijoles'], protein: 21, fat: 1.2, carbs: 63, calories: 347, measureType: 'gram', preparation: 'cocido' },
  { matches: ['lentejas'], protein: 25, fat: 1.1, carbs: 60, calories: 353, measureType: 'gram', preparation: 'cocido' },
  { matches: ['garbanzo'], protein: 19, fat: 6, carbs: 61, calories: 364, measureType: 'gram', preparation: 'cocido' },
  { matches: ['quinoa'], protein: 14, fat: 6, carbs: 64, calories: 368, measureType: 'gram', preparation: 'cocido' },
  { matches: ['edamames', 'edamame'], protein: 12, fat: 5, carbs: 9, calories: 121, measureType: 'gram', preparation: 'cocido' },
  { matches: ['cacahuate'], protein: 26, fat: 49, carbs: 16, calories: 567, measureType: 'gram', preparation: 'cocido' },
  { matches: ['arroz integral', 'arroz jazmin', 'arroz'], protein: 2.6, fat: 0.3, carbs: 28, calories: 130, measureType: 'gram', preparation: 'cocido' },
  { matches: ['avena integral', 'avena'], protein: 13.5, fat: 6.5, carbs: 66, calories: 379, measureType: 'gram', preparation: 'cocido' },
  { matches: ['tortilla de nopal'], protein: 2, fat: 1, carbs: 15, calories: 80, measureType: 'unit', unitName: 'tortilla', unitGrams: 40, preparation: 'cocido' },
  { matches: ['tortilla de nixtamal'], protein: 2.5, fat: 0.5, carbs: 22, calories: 105, measureType: 'unit', unitName: 'tortilla', unitGrams: 45, preparation: 'cocido' },
  { matches: ['papa', 'papas'], protein: 2, fat: 0.1, carbs: 20, calories: 87, measureType: 'gram', preparation: 'cocido' },
  { matches: ['camote', 'batata'], protein: 1.6, fat: 0.1, carbs: 20, calories: 86, measureType: 'gram', preparation: 'cocido' },

  { matches: ['aceite de aguacate'], protein: 0, fat: 100, carbs: 0, calories: 884, measureType: 'gram' },
  { matches: ['aceite de oliva'], protein: 0, fat: 100, carbs: 0, calories: 884, measureType: 'gram' },
  { matches: ['aceite de coco'], protein: 0, fat: 100, carbs: 0, calories: 884, measureType: 'gram' },
  { matches: ['chia'], protein: 17, fat: 31, carbs: 42, calories: 486, measureType: 'gram' },
  { matches: ['linaza'], protein: 18, fat: 42, carbs: 29, calories: 534, measureType: 'gram' },
  { matches: ['ghee'], protein: 0, fat: 99, carbs: 0, calories: 876, measureType: 'gram' },
  { matches: ['sesamo', 'ajonjolí'], protein: 18, fat: 50, carbs: 23, calories: 573, measureType: 'gram' },
  { matches: ['manteca de cerdo'], protein: 0, fat: 100, carbs: 0, calories: 902, measureType: 'gram' },
  { matches: ['queso de cabra'], protein: 21, fat: 30, carbs: 0, calories: 364, measureType: 'gram' },
  { matches: ['queso mozarella', 'mozarella'], protein: 22, fat: 22, carbs: 2.2, calories: 300, measureType: 'gram' },

  { matches: ['platano macho', 'plátano macho', 'platano'], protein: 1.1, fat: 0.3, carbs: 23, calories: 96, measureType: 'gram' },
  { matches: ['aguacate'], protein: 2, fat: 15, carbs: 9, calories: 160, measureType: 'gram' },
  { matches: ['mango'], protein: 0.8, fat: 0.4, carbs: 15, calories: 60, measureType: 'gram' },
  { matches: ['papaya'], protein: 0.5, fat: 0.1, carbs: 11, calories: 43, measureType: 'gram' },
  { matches: ['frutos rojos', 'berries'], protein: 0.7, fat: 0.3, carbs: 12, calories: 53, measureType: 'gram' },
  { matches: ['manzana verde'], protein: 0.3, fat: 0.2, carbs: 14, calories: 58, measureType: 'gram' },
  { matches: ['piña'], protein: 0.5, fat: 0.1, carbs: 13, calories: 50, measureType: 'gram' },
  { matches: ['sandia', 'sandía'], protein: 0.6, fat: 0.2, carbs: 8, calories: 30, measureType: 'gram' },

  { matches: ['brocoli', 'brócoli'], protein: 2.8, fat: 0.4, carbs: 7, calories: 34, measureType: 'gram' },
  { matches: ['coliflor'], protein: 1.9, fat: 0.3, carbs: 5, calories: 25, measureType: 'gram' },
  { matches: ['kale'], protein: 4.3, fat: 0.9, carbs: 9, calories: 49, measureType: 'gram' },
  { matches: ['arugula', 'rúcula'], protein: 2.6, fat: 0.7, carbs: 3.7, calories: 25, measureType: 'gram' },
  { matches: ['pepino'], protein: 0.7, fat: 0.1, carbs: 3.6, calories: 15, measureType: 'gram' },
  { matches: ['cilantro', 'cilantr'], protein: 2.1, fat: 0.5, carbs: 3.7, calories: 23, measureType: 'gram' },
  { matches: ['champiñon', 'champiñones', 'hongo'], protein: 3.1, fat: 0.3, carbs: 3.3, calories: 22, measureType: 'gram' },
  { matches: ['tomate', 'jitomate'], protein: 0.9, fat: 0.2, carbs: 3.9, calories: 18, measureType: 'gram' },
  { matches: ['zanahoria'], protein: 0.9, fat: 0.2, carbs: 10, calories: 41, measureType: 'gram' },
  { matches: ['ajo'], protein: 6.4, fat: 0.5, carbs: 33, calories: 149, measureType: 'gram' },
  { matches: ['cebolla'], protein: 1.1, fat: 0.1, carbs: 9, calories: 40, measureType: 'gram' },
  { matches: ['pimiento', 'pimiento morron'], protein: 1, fat: 0.3, carbs: 6, calories: 26, measureType: 'gram' },
  { matches: ['chiles', 'chile'], protein: 1.9, fat: 0.4, carbs: 4.6, calories: 20, measureType: 'gram' },
  { matches: ['calabaza'], protein: 1.1, fat: 0.1, carbs: 7, calories: 26, measureType: 'gram' },
  { matches: ['repollo', 'col'], protein: 1.3, fat: 0.1, carbs: 6, calories: 25, measureType: 'gram' },
  { matches: ['esparrago', 'espárrago'], protein: 2.2, fat: 0.2, carbs: 4, calories: 20, measureType: 'gram' },
  { matches: ['tomatillo'], protein: 0.9, fat: 0.3, carbs: 6, calories: 32, measureType: 'gram' },
  { matches: ['cebollin', 'cebollín'], protein: 3.3, fat: 0.7, carbs: 7, calories: 30, measureType: 'gram' },
  { matches: ['puerro'], protein: 1.5, fat: 0.3, carbs: 14, calories: 61, measureType: 'gram' },

  { matches: ['curcuma', 'cúrcuma'], protein: 8, fat: 10, carbs: 65, calories: 354, measureType: 'gram' },
  { matches: ['jengibre'], protein: 1.8, fat: 0.8, carbs: 18, calories: 80, measureType: 'gram' },
  { matches: ['canela'], protein: 4, fat: 1.2, carbs: 80, calories: 247, measureType: 'gram' },
  { matches: ['ajo en polvo'], protein: 16, fat: 0.7, carbs: 73, calories: 331, measureType: 'gram' },
  { matches: ['cebolla en polvo'], protein: 10, fat: 0.7, carbs: 79, calories: 341, measureType: 'gram' },
  { matches: ['oregano', 'orégano'], protein: 9, fat: 4.3, carbs: 69, calories: 265, measureType: 'gram' },
  { matches: ['sal de mar', 'sal'], protein: 0, fat: 0, carbs: 0, calories: 0, measureType: 'gram' },
  { matches: ['limón en polvo'], protein: 0, fat: 0, carbs: 0, calories: 0, measureType: 'gram' },
  { matches: ['clavo de olor'], protein: 6, fat: 20, carbs: 66, calories: 323, measureType: 'gram' },
  { matches: ['romero'], protein: 3.3, fat: 5.9, carbs: 64, calories: 131, measureType: 'gram' },
  { matches: ['tomillo'], protein: 5.6, fat: 1.7, carbs: 65, calories: 276, measureType: 'gram' },
  { matches: ['comino'], protein: 18, fat: 22, carbs: 44, calories: 375, measureType: 'gram' },
  { matches: ['paprika'], protein: 14, fat: 13, carbs: 54, calories: 282, measureType: 'gram' },
  { matches: ['laurel'], protein: 7.6, fat: 8.4, carbs: 75, calories: 313, measureType: 'gram' },
  { matches: ['cacao'], protein: 20, fat: 23, carbs: 58, calories: 504, measureType: 'gram' },
  { matches: ['levadura nutricional'], protein: 50, fat: 5, carbs: 35, calories: 400, measureType: 'gram' },
  { matches: ['extracto de vainilla'], protein: 0, fat: 0, carbs: 0, calories: 0, measureType: 'gram' },
  { matches: ['psyllum husk', 'psyllium'], protein: 0, fat: 0, carbs: 80, calories: 200, measureType: 'gram' },
  { matches: ['eritritol'], protein: 0, fat: 0, carbs: 0, calories: 0, measureType: 'gram' },

  { matches: ['glicinato de magnesio', 'magnesio'], protein: 0, fat: 0, carbs: 0, calories: 0, measureType: 'unit', unitName: 'cápsula', unitGrams: 0 },
  { matches: ['vitamina d3', 'vitamina d', 'd3+k2'], protein: 0, fat: 0, carbs: 0, calories: 0, measureType: 'unit', unitName: 'gota', unitGrams: 0 },
  { matches: ['omega 3'], protein: 0, fat: 0, carbs: 0, calories: 0, measureType: 'unit', unitName: 'cápsula', unitGrams: 0 },
  { matches: ['l-leanina', 'l teanina'], protein: 0, fat: 0, carbs: 0, calories: 0, measureType: 'unit', unitName: 'cápsula', unitGrams: 0 },
  { matches: ['ashwagandha'], protein: 0, fat: 0, carbs: 0, calories: 0, measureType: 'unit', unitName: 'cápsula', unitGrams: 0 },
  { matches: ['probioticos', 'probióticos'], protein: 0, fat: 0, carbs: 0, calories: 0, measureType: 'unit', unitName: 'cápsula', unitGrams: 0 },
  { matches: ['vitamina c'], protein: 0, fat: 0, carbs: 0, calories: 0, measureType: 'unit', unitName: 'tableta', unitGrams: 0 },
]
