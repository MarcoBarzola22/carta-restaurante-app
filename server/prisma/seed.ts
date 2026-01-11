import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Crear Admin
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: '123' },
  })

  // 2. Crear Categorías Básicas
  const categories = [
    { name: "Entradas", emoji: "🥗" },
    { name: "Platos Principales", emoji: "🍖" },
    { name: "Hamburguesas", emoji: "🍔" },
    { name: "Postres", emoji: "🍰" },
    { name: "Bebidas", emoji: "🥤" }
  ]

  for (const cat of categories) {
    // Usamos upsert para no duplicar si ya existen (buscamos por nombre si es único, o creamos)
    // Nota: Como tu schema quiza no tiene nombre unico, usamos createMany o un loop simple con findFirst
    const exists = await prisma.category.findFirst({ where: { name: cat.name } })
    if (!exists) {
        await prisma.category.create({ data: { name: cat.name } }) // Quitamos emoji si no está en tu schema
    }
  }

  console.log('✅ Admin y Categorías creados')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })