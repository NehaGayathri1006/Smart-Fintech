require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Traveling', type: 'EXPENSE', icon: 'Plane' },
    { name: 'Transport', type: 'EXPENSE', icon: 'Car' },
    { name: 'Medical', type: 'EXPENSE', icon: 'Stethoscope' },
    { name: 'Food', type: 'EXPENSE', icon: 'Utensils' },
    { name: 'Grocery', type: 'EXPENSE', icon: 'ShoppingBasket' },
    { name: 'Insurance', type: 'EXPENSE', icon: 'ShieldCheck' },
    { name: 'Loans', type: 'EXPENSE', icon: 'Banknote' },
    { name: 'EMI', type: 'EXPENSE', icon: 'CreditCard' },
    { name: 'Other Expenses', type: 'EXPENSE', icon: 'MoreHorizontal' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('Categories seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
