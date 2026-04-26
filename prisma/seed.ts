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

  // Create user Iris
  const iris = await prisma.user.upsert({
    where: { email: 'iris@example.com' },
    update: {},
    create: {
      name: 'Iris',
      email: 'iris@example.com',
      password: 'password123',
    }
  });

  // Create an account for Iris
  const existingAccount = await prisma.account.findFirst({ where: { userId: iris.id } });
  let account = existingAccount;
  if (!account) {
    account = await prisma.account.create({
      data: {
        name: 'Main Bank',
        balance: 150000,
        currency: 'INR',
        userId: iris.id
      }
    });
  }

  console.log('User Iris created with account');

  // Check if transactions exist
  const existingTxs = await prisma.transaction.count({ where: { userId: iris.id } });
  if (existingTxs === 0) {
    const now = new Date();
    const txs = [];
    for (let i = 0; i < 50; i++) {
      // random date within last 5 months
      const date = new Date(now.getTime() - Math.floor(Math.random() * 5 * 30 * 24 * 60 * 60 * 1000));
      const isIncome = Math.random() > 0.8;
      const catName = isIncome ? 'Other Expenses' : categories[Math.floor(Math.random() * categories.length)].name;
      const amount = isIncome ? Math.floor(Math.random() * 50000) + 10000 : Math.floor(Math.random() * 5000) + 100;
      
      const cat = await prisma.category.findUnique({ where: { name: catName } });

      txs.push({
        amount: amount,
        description: isIncome ? 'Salary / Income' : 'Expense',
        type: isIncome ? 'INCOME' : 'EXPENSE',
        date: date,
        userId: iris.id,
        accountId: account.id,
        categoryId: cat.id
      });
    }

    await prisma.transaction.createMany({
      data: txs
    });
    console.log('Generated 5 months of transaction data for Iris');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
