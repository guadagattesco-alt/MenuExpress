// lib/recipes.ts
export type RecipeCategory = "saludable" | "economico" | "proteico"
export type RecipeType = "almuerzo" | "cena"

export interface Ingredient {
  item: string
  quantity: number
  unit: string
  durability: "fresco" | "almacen"
}

export interface Recipe {
  id: string
  name: string
  category: RecipeCategory
  type: RecipeType
  ingredients: Ingredient[]
}

export const CATEGORY_LABELS: Record<RecipeCategory, string> = {
  saludable: "🥗 Saludable",
  economico: "💰 Económico",
  proteico: "💪 Proteico",
}

export const RECIPES_DB: Recipe[] = [
  // SALUDABLE - ALMUERZO
  { id:"r01", name:"Ensalada de pollo y verduras", category:"saludable", type:"almuerzo", ingredients:[
    {item:"Pechuga de pollo", quantity:300, unit:"g", durability:"fresco"},
    {item:"Lechuga", quantity:100, unit:"g", durability:"fresco"},
    {item:"Tomate", quantity:2, unit:"u", durability:"fresco"},
    {item:"Zanahoria", quantity:1, unit:"u", durability:"fresco"},
    {item:"Aceite de oliva", quantity:20, unit:"ml", durability:"almacen"},
    {item:"Limón", quantity:1, unit:"u", durability:"fresco"},
  ]},
  { id:"r02", name:"Pollo al limón con batata", category:"saludable", type:"almuerzo", ingredients:[
    {item:"Muslo de pollo", quantity:400, unit:"g", durability:"fresco"},
    {item:"Batata", quantity:300, unit:"g", durability:"almacen"},
    {item:"Limón", quantity:2, unit:"u", durability:"fresco"},
    {item:"Ajo", quantity:3, unit:"u", durability:"almacen"},
    {item:"Aceite de oliva", quantity:30, unit:"ml", durability:"almacen"},
  ]},
  { id:"r03", name:"Bowl de quinoa con verduras", category:"saludable", type:"almuerzo", ingredients:[
    {item:"Quinoa", quantity:200, unit:"g", durability:"almacen"},
    {item:"Espinaca", quantity:100, unit:"g", durability:"fresco"},
    {item:"Tomate cherry", quantity:150, unit:"g", durability:"fresco"},
    {item:"Palta", quantity:1, unit:"u", durability:"fresco"},
    {item:"Aceite de oliva", quantity:20, unit:"ml", durability:"almacen"},
  ]},
  { id:"r04", name:"Wrap de pavo y verduras", category:"saludable", type:"almuerzo", ingredients:[
    {item:"Pechuga de pavo", quantity:200, unit:"g", durability:"fresco"},
    {item:"Tortilla de trigo", quantity:2, unit:"u", durability:"almacen"},
    {item:"Lechuga", quantity:80, unit:"g", durability:"fresco"},
    {item:"Tomate", quantity:1, unit:"u", durability:"fresco"},
    {item:"Queso cremoso", quantity:50, unit:"g", durability:"fresco"},
  ]},
  // SALUDABLE - CENA
  { id:"r05", name:"Salmón a la plancha con ensalada", category:"saludable", type:"cena", ingredients:[
    {item:"Salmón", quantity:300, unit:"g", durability:"fresco"},
    {item:"Lechuga", quantity:100, unit:"g", durability:"fresco"},
    {item:"Tomate", quantity:2, unit:"u", durability:"fresco"},
    {item:"Limón", quantity:1, unit:"u", durability:"fresco"},
    {item:"Aceite de oliva", quantity:20, unit:"ml", durability:"almacen"},
  ]},
  { id:"r06", name:"Wok de verduras con arroz integral", category:"saludable", type:"cena", ingredients:[
    {item:"Arroz integral", quantity:200, unit:"g", durability:"almacen"},
    {item:"Zanahoria", quantity:2, unit:"u", durability:"fresco"},
    {item:"Zapallito", quantity:2, unit:"u", durability:"fresco"},
    {item:"Morrón", quantity:1, unit:"u", durability:"fresco"},
    {item:"Aceite de oliva", quantity:25, unit:"ml", durability:"almacen"},
    {item:"Salsa de soja", quantity:30, unit:"ml", durability:"almacen"},
  ]},
  { id:"r07", name:"Cazuela de pollo y arroz", category:"saludable", type:"cena", ingredients:[
    {item:"Muslo de pollo", quantity:350, unit:"g", durability:"fresco"},
    {item:"Arroz", quantity:150, unit:"g", durability:"almacen"},
    {item:"Cebolla", quantity:1, unit:"u", durability:"almacen"},
    {item:"Zanahoria", quantity:1, unit:"u", durability:"fresco"},
    {item:"Caldo de pollo", quantity:500, unit:"ml", durability:"almacen"},
    {item:"Ajo", quantity:2, unit:"u", durability:"almacen"},
  ]},
  { id:"r08", name:"Merluza al horno con vegetales", category:"saludable", type:"cena", ingredients:[
    {item:"Merluza", quantity:400, unit:"g", durability:"fresco"},
    {item:"Papa", quantity:300, unit:"g", durability:"almacen"},
    {item:"Tomate", quantity:2, unit:"u", durability:"fresco"},
    {item:"Cebolla", quantity:1, unit:"u", durability:"almacen"},
    {item:"Aceite de oliva", quantity:30, unit:"ml", durability:"almacen"},
    {item:"Limón", quantity:1, unit:"u", durability:"fresco"},
  ]},
  // ECONOMICO - ALMUERZO
  { id:"r09", name:"Arroz con atún", category:"economico", type:"almuerzo", ingredients:[
    {item:"Arroz", quantity:200, unit:"g", durability:"almacen"},
    {item:"Atún en lata", quantity:1, unit:"u", durability:"almacen"},
    {item:"Cebolla", quantity:1, unit:"u", durability:"almacen"},
    {item:"Tomate", quantity:1, unit:"u", durability:"fresco"},
    {item:"Aceite", quantity:20, unit:"ml", durability:"almacen"},
  ]},
  { id:"r10", name:"Revuelto gramajo", category:"economico", type:"almuerzo", ingredients:[
    {item:"Huevo", quantity:4, unit:"u", durability:"fresco"},
    {item:"Jamón cocido", quantity:100, unit:"g", durability:"fresco"},
    {item:"Papa", quantity:300, unit:"g", durability:"almacen"},
    {item:"Aceite", quantity:30, unit:"ml", durability:"almacen"},
    {item:"Cebolla", quantity:1, unit:"u", durability:"almacen"},
  ]},
  { id:"r11", name:"Guiso de lentejas", category:"economico", type:"almuerzo", ingredients:[
    {item:"Lentejas", quantity:300, unit:"g", durability:"almacen"},
    {item:"Chorizo colorado", quantity:1, unit:"u", durability:"fresco"},
    {item:"Cebolla", quantity:1, unit:"u", durability:"almacen"},
    {item:"Papa", quantity:200, unit:"g", durability:"almacen"},
    {item:"Zanahoria", quantity:1, unit:"u", durability:"fresco"},
    {item:"Tomate triturado", quantity:200, unit:"g", durability:"almacen"},
  ]},
  { id:"r12", name:"Sopa de verduras con fideos", category:"economico", type:"almuerzo", ingredients:[
    {item:"Fideos", quantity:150, unit:"g", durability:"almacen"},
    {item:"Zanahoria", quantity:2, unit:"u", durability:"fresco"},
    {item:"Papa", quantity:200, unit:"g", durability:"almacen"},
    {item:"Cebolla", quantity:1, unit:"u", durability:"almacen"},
    {item:"Caldo de verduras", quantity:1, unit:"u", durability:"almacen"},
    {item:"Aceite", quantity:20, unit:"ml", durability:"almacen"},
  ]},
  // ECONOMICO - CENA
  { id:"r13", name:"Fideos con salsa de tomate", category:"economico", type:"cena", ingredients:[
    {item:"Fideos", quantity:250, unit:"g", durability:"almacen"},
    {item:"Tomate triturado", quantity:400, unit:"g", durability:"almacen"},
    {item:"Cebolla", quantity:1, unit:"u", durability:"almacen"},
    {item:"Ajo", quantity:2, unit:"u", durability:"almacen"},
    {item:"Aceite", quantity:20, unit:"ml", durability:"almacen"},
  ]},
  { id:"r14", name:"Tortilla de papa", category:"economico", type:"cena", ingredients:[
    {item:"Papa", quantity:400, unit:"g", durability:"almacen"},
    {item:"Huevo", quantity:4, unit:"u", durability:"fresco"},
    {item:"Cebolla", quantity:1, unit:"u", durability:"almacen"},
    {item:"Aceite", quantity:40, unit:"ml", durability:"almacen"},
  ]},
  { id:"r15", name:"Milanesas de soja con puré", category:"economico", type:"cena", ingredients:[
    {item:"Soja texturizada", quantity:200, unit:"g", durability:"almacen"},
    {item:"Papa", quantity:500, unit:"g", durability:"almacen"},
    {item:"Huevo", quantity:2, unit:"u", durability:"fresco"},
    {item:"Pan rallado", quantity:100, unit:"g", durability:"almacen"},
    {item:"Leche", quantity:100, unit:"ml", durability:"fresco"},
    {item:"Manteca", quantity:30, unit:"g", durability:"fresco"},
  ]},
  { id:"r16", name:"Arroz con huevo frito", category:"economico", type:"cena", ingredients:[
    {item:"Arroz", quantity:200, unit:"g", durability:"almacen"},
    {item:"Huevo", quantity:2, unit:"u", durability:"fresco"},
    {item:"Aceite", quantity:20, unit:"ml", durability:"almacen"},
    {item:"Ajo", quantity:2, unit:"u", durability:"almacen"},
    {item:"Salsa de soja", quantity:20, unit:"ml", durability:"almacen"},
  ]},
  // PROTEICO - ALMUERZO
  { id:"r17", name:"Milanesa de pollo al horno", category:"proteico", type:"almuerzo", ingredients:[
    {item:"Pechuga de pollo", quantity:400, unit:"g", durability:"fresco"},
    {item:"Huevo", quantity:2, unit:"u", durability:"fresco"},
    {item:"Pan rallado", quantity:100, unit:"g", durability:"almacen"},
    {item:"Limón", quantity:1, unit:"u", durability:"fresco"},
    {item:"Ajo", quantity:2, unit:"u", durability:"almacen"},
  ]},
  { id:"r18", name:"Omelette de espinaca y queso", category:"proteico", type:"almuerzo", ingredients:[
    {item:"Huevo", quantity:3, unit:"u", durability:"fresco"},
    {item:"Espinaca", quantity:100, unit:"g", durability:"fresco"},
    {item:"Queso cremoso", quantity:80, unit:"g", durability:"fresco"},
    {item:"Manteca", quantity:15, unit:"g", durability:"fresco"},
  ]},
  { id:"r19", name:"Pollo grillado con batata y brócoli", category:"proteico", type:"almuerzo", ingredients:[
    {item:"Pechuga de pollo", quantity:400, unit:"g", durability:"fresco"},
    {item:"Batata", quantity:250, unit:"g", durability:"almacen"},
    {item:"Brócoli", quantity:200, unit:"g", durability:"fresco"},
    {item:"Aceite de oliva", quantity:25, unit:"ml", durability:"almacen"},
    {item:"Ajo", quantity:2, unit:"u", durability:"almacen"},
  ]},
  { id:"r20", name:"Tarta de atún y verduras", category:"proteico", type:"almuerzo", ingredients:[
    {item:"Atún en lata", quantity:2, unit:"u", durability:"almacen"},
    {item:"Tapa de tarta", quantity:1, unit:"u", durability:"almacen"},
    {item:"Huevo", quantity:3, unit:"u", durability:"fresco"},
    {item:"Cebolla", quantity:1, unit:"u", durability:"almacen"},
    {item:"Morrón", quantity:1, unit:"u", durability:"fresco"},
    {item:"Queso feteado", quantity:80, unit:"g", durability:"fresco"},
  ]},
  // PROTEICO - CENA
  { id:"r21", name:"Hamburguesa casera con queso", category:"proteico", type:"cena", ingredients:[
    {item:"Carne picada", quantity:400, unit:"g", durability:"fresco"},
    {item:"Pan de hamburguesa", quantity:2, unit:"u", durability:"almacen"},
    {item:"Queso feteado", quantity:60, unit:"g", durability:"fresco"},
    {item:"Tomate", quantity:1, unit:"u", durability:"fresco"},
    {item:"Lechuga", quantity:50, unit:"g", durability:"fresco"},
  ]},
  { id:"r22", name:"Suprema a la napolitana", category:"proteico", type:"cena", ingredients:[
    {item:"Pechuga de pollo", quantity:400, unit:"g", durability:"fresco"},
    {item:"Tomate triturado", quantity:150, unit:"g", durability:"almacen"},
    {item:"Queso feteado", quantity:80, unit:"g", durability:"fresco"},
    {item:"Pan rallado", quantity:80, unit:"g", durability:"almacen"},
    {item:"Huevo", quantity:2, unit:"u", durability:"fresco"},
  ]},
  { id:"r23", name:"Pasta bolognesa", category:"proteico", type:"cena", ingredients:[
    {item:"Fideos", quantity:250, unit:"g", durability:"almacen"},
    {item:"Carne picada", quantity:300, unit:"g", durability:"fresco"},
    {item:"Tomate triturado", quantity:400, unit:"g", durability:"almacen"},
    {item:"Cebolla", quantity:1, unit:"u", durability:"almacen"},
    {item:"Ajo", quantity:2, unit:"u", durability:"almacen"},
    {item:"Aceite", quantity:20, unit:"ml", durability:"almacen"},
  ]},
  { id:"r24", name:"Bife de chorizo con papas", category:"proteico", type:"cena", ingredients:[
    {item:"Bife de chorizo", quantity:350, unit:"g", durability:"fresco"},
    {item:"Papa", quantity:400, unit:"g", durability:"almacen"},
    {item:"Aceite", quantity:30, unit:"ml", durability:"almacen"},
    {item:"Ajo", quantity:2, unit:"u", durability:"almacen"},
    {item:"Sal gruesa", quantity:10, unit:"g", durability:"almacen"},
  ]},
]

