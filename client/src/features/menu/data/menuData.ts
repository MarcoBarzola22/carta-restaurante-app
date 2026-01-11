import foodBurger from "@/assets/food-burger.jpg";
import foodRisotto from "@/assets/food-risotto.jpg";
import foodSalad from "@/assets/food-salad.jpg";
import foodDessert from "@/assets/food-dessert.jpg";
import foodSalmon from "@/assets/food-salmon.jpg";
import foodPizza from "@/assets/food-pizza.jpg";

export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  ingredients: string[];
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSoldOut?: boolean;
  isChefRecommended?: boolean;
  isDailySpecial?: boolean; // <--- AGREGADO: Nueva propiedad para el carrusel
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export const categories: Category[] = [
  { id: "all", name: "Todos", emoji: "🍽️" },
  { id: "entradas", name: "Entradas", emoji: "🥗" },
  { id: "principales", name: "Principales", emoji: "🍖" },
  { id: "pizzas", name: "Pizzas", emoji: "🍕" },
  { id: "postres", name: "Postres", emoji: "🍰" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Burger Gourmet",
    description: "Carne angus, queso cheddar, cebolla caramelizada",
    fullDescription: "Nuestra icónica hamburguesa preparada con 200g de carne angus premium, queso cheddar derretido, cebolla caramelizada en mantequilla, lechuga fresca y nuestra salsa secreta, todo en un pan brioche artesanal tostado.",
    ingredients: ["Carne angus 200g", "Queso cheddar", "Cebolla caramelizada", "Lechuga", "Tomate", "Pan brioche", "Salsa secreta"],
    price: 18.90,
    image: foodBurger,
    category: "principales",
    isNew: true,
    isChefRecommended: true,
    isDailySpecial: true, // <--- MODIFICADO: Plato del día
  },
  {
    id: "2",
    name: "Risotto Parmesano",
    description: "Arroz arborio, parmesano 24 meses, trufa negra",
    fullDescription: "Risotto cremoso preparado al momento con arroz arborio italiano, mantecado con mantequilla y queso parmesano reggiano de 24 meses de maduración. Finalizado con ralladura de trufa negra fresca.",
    ingredients: ["Arroz arborio", "Parmesano reggiano 24 meses", "Caldo de vegetales", "Vino blanco", "Mantequilla", "Trufa negra", "Hierbas frescas"],
    price: 24.50,
    image: foodRisotto,
    category: "principales",
    isChefRecommended: true,
    isDailySpecial: true, // <--- MODIFICADO: Plato del día
  },
  {
    id: "3",
    name: "Ensalada César",
    description: "Pollo grillado, crutones caseros, parmesano",
    fullDescription: "Clásica ensalada César con pechuga de pollo a la parrilla, lechuga romana crujiente, crutones caseros de pan sourdough, láminas de parmesano y aderezo César tradicional preparado al momento.",
    ingredients: ["Pechuga de pollo", "Lechuga romana", "Crutones artesanales", "Parmesano", "Aderezo César", "Anchoas", "Limón"],
    price: 14.90,
    image: foodSalad,
    category: "entradas",
  },
  {
    id: "4",
    name: "Volcán de Chocolate",
    description: "Centro fundido, helado de vainilla, coulis de frambuesa",
    fullDescription: "Irresistible bizcocho de chocolate negro 70% con centro líquido fundido, acompañado de helado artesanal de vainilla bourbon y decorado con coulis de frambuesa fresca y polvo de cacao.",
    ingredients: ["Chocolate negro 70%", "Huevos", "Mantequilla", "Helado de vainilla", "Frambuesas", "Azúcar glass"],
    price: 9.90,
    image: foodDessert,
    category: "postres",
    isNew: true,
    isChefRecommended: true,
  },
  {
    id: "5",
    name: "Salmón a la Parrilla",
    description: "Filete de salmón, limón, hierbas mediterráneas",
    fullDescription: "Generoso filete de salmón noruego de 250g, grillado a la perfección con hierbas mediterráneas frescas. Servido con rodajas de limón y un toque de aceite de oliva virgen extra.",
    ingredients: ["Salmón noruego 250g", "Limón", "Romero", "Tomillo", "Aceite de oliva", "Ajo", "Sal marina"],
    price: 26.90,
    image: foodSalmon,
    category: "principales",
    isSoldOut: true,
  },
  {
    id: "6",
    name: "Pizza Margherita",
    description: "Mozzarella fresca, tomate San Marzano, albahaca",
    fullDescription: "Pizza tradicional napolitana con masa fermentada 72 horas, salsa de tomate San Marzano DOP, mozzarella fior di latte fresca y hojas de albahaca. Horneada en nuestro horno de leña a 450°C.",
    ingredients: ["Masa madre 72h", "Tomate San Marzano DOP", "Mozzarella fior di latte", "Albahaca fresca", "Aceite de oliva", "Sal"],
    price: 16.50,
    image: foodPizza,
    category: "pizzas",
  },
  {
    id: "7",
    name: "Tacos al Pastor",
    description: "Cerdo marinado, piña, cilantro, salsa verde",
    fullDescription: "Tres tacos servidos en tortilla de maíz nixtamalizada, con cerdo marinado en achiote y especias por 24 horas, asado al trompo. Acompañados de piña asada, cilantro, cebolla picada y nuestra salsa verde de aguacate.",
    ingredients: ["Tortilla de maíz", "Cerdo marinado", "Piña", "Cilantro", "Cebolla", "Salsa verde"],
    price: 12.50,
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80",
    category: "principales",
    isDailySpecial: true,
  },
  {
    id: "8",
    name: "Cheesecake NY",
    description: "Frutos rojos, base de galleta, menta",
    fullDescription: "Auténtico estilo New York, denso y cremoso. Base de galleta de vainilla molida, horneado lentamente a baño maría y cubierto con una reducción casera de frutos del bosque y hojas de menta fresca.",
    ingredients: ["Queso crema", "Galleta vainilla", "Frutos rojos", "Azúcar", "Huevos", "Menta"],
    price: 8.90,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    category: "postres",
    isDailySpecial: true,
  },
  {
    id: "9",
    name: "Limonada Rosa",
    description: "Limón, frutilla, menta, hielo picado",
    fullDescription: "Refrescante limonada preparada al momento con limones sutiles, macerado de frutillas naturales y un toque de almíbar de romero. Servida con mucho hielo picado.",
    ingredients: ["Limón sutil", "Frutillas", "Almíbar", "Romero", "Agua con gas", "Hielo"],
    price: 4.50,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    category: "bebidas",
    isDailySpecial: true,
  },
  {
    id: "10",
    name: "Pasta Carbonara",
    description: "Guanciale, pecorino, yema, pimienta",
    fullDescription: "La verdadera receta romana. Sin crema. Solo yemas de huevo de campo, queso Pecorino Romano DOP, guanciale crujiente y mucha pimienta negra recién molida sobre spaghetti al dente.",
    ingredients: ["Spaghetti", "Yema de huevo", "Pecorino Romano", "Guanciale", "Pimienta negra"],
    price: 19.90,
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80",
    category: "principales",
    isDailySpecial: true,
  },
  {
    id: "11",
    name: "Brownie Vegano",
    description: "Nueces, cacao 80%, helado de coco",
    fullDescription: "Húmedo y denso, hecho con cacao amargo al 80%, aceite de coco y nueces mariposa. Servido tibio con una bola de helado de leche de coco artesanal.",
    ingredients: ["Cacao 80%", "Harina de almendras", "Nueces", "Aceite de coco", "Azúcar de coco"],
    price: 7.50,
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80",
    category: "postres",
    isDailySpecial: true,
  },
  {
    id: "12",
    name: "Mojito Clásico",
    description: "Ron blanco, menta, lima, soda",
    fullDescription: "El clásico cubano. Ron blanco añejo, hojas de menta fresca machacadas suavemente con azúcar y gajos de lima para liberar sus aceites, completado con soda y hielo.",
    ingredients: ["Ron blanco", "Menta fresca", "Lima", "Azúcar", "Soda", "Hielo"],
    price: 9.00,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    category: "bebidas",
    isDailySpecial: true,
  },
];

// Helper modificado para usar la nueva propiedad
export const getChefRecommendations = () => products.filter(p => p.isDailySpecial);

export const getProductsByCategory = (categoryId: string) => 
  categoryId === "all" ? products : products.filter(p => p.category === categoryId);