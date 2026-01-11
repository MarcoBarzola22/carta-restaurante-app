import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// --- RUTA DE PRUEBA ---
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', server: 'Carta Digital API' });
});

// --- RUTA 1: LOGIN ---
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await prisma.admin.findUnique({ where: { username } });
    
    // Validación simple (en producción usa bcrypt)
    if (!admin || admin.password !== password) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }

    // Login exitoso
    res.json({ success: true, token: "admin-token-secreto-123", username: admin.username });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// --- RUTA 2: OBTENER PRODUCTOS ---
app.get("/api/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'desc' },
      include: { category: true }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo productos" });
  }
});

// --- RUTA 3: CREAR PRODUCTO ---
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
    console.error(error);
    res.status(500).json({ error: "No se pudo crear el producto" });
  }
});

// --- RUTA 4: ACTUALIZAR ESTADO (Switches) ---
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
    res.status(500).json({ error: "Error actualizando producto" });
  }
});

// --- RUTA 5: CATEGORIAS (ESTA ES LA QUE TE FALTABA) ---
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
        orderBy: { id: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo categorías" });
  }
});

app.post("/api/categories", async (req, res) => {
  const { name } = req.body;
  try {
    const category = await prisma.category.create({
      data: { name }
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "No se pudo crear la categoría" });
  }
});

// --- RUTA: ELIMINAR PRODUCTO ---
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

// --- RUTA: EDITAR PRODUCTO ---
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
    res.status(500).json({ error: "Error al editar producto" });
  }
});

// --- RUTA: ELIMINAR CATEGORÍA ---
app.delete("/api/categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Opcional: Podrías verificar si hay productos en esta categoría antes de borrar
    await prisma.category.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar categoría" });
  }
});

// --- RUTA: EDITAR CATEGORÍA ---
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
    res.status(500).json({ error: "Error al editar categoría" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});