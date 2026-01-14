import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// --- RUTA DE PRUEBA ---
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', server: 'Carta Digital API' });
});

// --- RUTAS DE PRODUCTOS ---
app.get("/api/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'desc' },
      include: { category: true }
    });
    res.json(products);
  } catch (error) {
    console.error("❌ Error obteniendo productos:", error);
    res.status(500).json({ error: "Error obteniendo productos" });
  }
});

app.post("/api/products", async (req, res) => {
  const { name, price, description, image, ingredients, categoryId } = req.body;
  try {
    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        description,
        image,
        ingredients,
        categoryId: parseInt(categoryId),
        isAvailable: true
      }
    });
    res.json(product);
  } catch (error) {
    console.error("❌ Error creando producto:", error);
    res.status(500).json({ error: "No se pudo crear el producto" });
  }
});

app.patch("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: data
    });
    res.json(product);
  } catch (error) {
    console.error("❌ Error actualizando producto:", error);
    res.status(500).json({ error: "Error actualizando producto" });
  }
});

// --- RUTAS DE CATEGORÍAS (Aquí estaba tu problema principal) ---
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
        orderBy: { id: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    console.error("❌ Error obteniendo categorías:", error);
    res.status(500).json({ error: "Error obteniendo categorías" });
  }
});

app.post("/api/categories", async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) throw new Error("El nombre es obligatorio");
    
    const category = await prisma.category.create({
      data: { name }
    });
    res.json(category);
  } catch (error) {
    console.error("❌ Error creando categoría:", error);
    res.status(500).json({ error: "No se pudo crear la categoría" });
  }
});

// --- RESTO DE RUTAS (Eliminar, Editar, Pedidos) ---
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error eliminando producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, description, isAvailable, isDailySpecial, image, ingredients, categoryId } = req.body;
  try {
    const updated = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: parseFloat(price),
        description,
        image,
        isAvailable,
        isDailySpecial,
        ingredients,
        categoryId: parseInt(categoryId)
      }
    });
    res.json(updated);
  } catch (error) {
    console.error("❌ Error editando producto:", error);
    res.status(500).json({ error: "Error al editar producto" });
  }
});

app.delete("/api/categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const productsInCategory = await prisma.product.findMany({
      where: { categoryId: parseInt(id) },
      select: { name: true }
    });

    if (productsInCategory.length > 0) {
      return res.status(409).json({ 
        error: "Categoría con productos",
        products: productsInCategory.map(p => p.name)
      });
    }

    await prisma.category.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error eliminando categoría:", error);
    res.status(500).json({ error: "Error al eliminar categoría" });
  }
});

app.put("/api/categories/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updated = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name }
    });
    res.json(updated);
  } catch (error) {
    console.error("❌ Error editando categoría:", error);
    res.status(500).json({ error: "Error al editar categoría" });
  }
});

app.post("/api/orders", async (req, res) => {
  const { customer, address, type, total, details } = req.body;
  try {
    const order = await prisma.order.create({
      data: {
        customer,
        address,
        type,
        total: parseFloat(total),
        details
      }
    });
    res.json(order);
  } catch (error) {
    console.error("❌ Error creando pedido:", error);
    res.status(500).json({ error: "Error creando el pedido" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(orders);
  } catch (error) {
    console.error("❌ Error obteniendo pedidos:", error);
    res.status(500).json({ error: "Error obteniendo pedidos" });
  }
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  // Credenciales predeterminadas (puedes cambiarlas o usar variables de entorno)
  const VALID_USER = "admin";
  const VALID_PASS = "admin123";

  if (username === VALID_USER && password === VALID_PASS) {
    // Si coincide, enviamos éxito y un token simulado
    return res.json({ 
      success: true, 
      token: "demo-token-123", 
      user: { username: VALID_USER } 
    });
  }

  // Si no coincide, devolvemos error 401 (No autorizado)
  return res.status(401).json({ error: "Credenciales inválidas" });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});