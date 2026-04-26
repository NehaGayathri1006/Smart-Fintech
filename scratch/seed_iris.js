require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'irisneha10@gmail.com';
  
  // Find or create user
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Iris Neha',
        email,
        password: 'password123', // Default password
      }
    });
    console.log(`Created user: ${email}`);
  }

  // Find or create account
  let account = await prisma.account.findFirst({ where: { userId: user.id } });
  if (!account) {
    account = await prisma.account.create({
      data: {
        name: 'Savings Bank',
        balance: 250000,
        currency: 'INR',
        userId: user.id
      }
    });
    console.log('Created account for user');
  }

  const categories = await prisma.category.findMany({ where: { type: 'EXPENSE' } });
  
  // Clear existing transactions for this user if any (to avoid duplicates for this seed)
  // await prisma.transaction.deleteMany({ where: { userId: user.id } });

  const txs = [];
  const now = new Date();
  
  // For the last 12 months
  for (let m = 0; m < 12; m++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - m, 1);
    
    // Add 10-15 transactions per month
    const count = 10 + Math.floor(Math.random() * 5);
    for (let i = 0; i < count; i++) {
      const day = 1 + Math.floor(Math.random() * 28);
      const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
      
      const isIncome = Math.random() > 0.85;
      const amount = isIncome 
        ? Math.floor(Math.random() * 40000) + 60000 
        : Math.floor(Math.random() * 4000) + 200;
      
      const category = isIncome 
        ? await prisma.category.findFirst({ where: { type: 'EXPENSE' } }) // Just pick one, or use a specific income cat if exists
        : categories[Math.floor(Math.random() * categories.length)];

      txs.push({
        amount,
        description: isIncome ? 'Salary Deposit' : `${category.name} Payment`,
        type: isIncome ? 'INCOME' : 'EXPENSE',
        date,
        userId: user.id,
        accountId: account.id,
        categoryId: category.id
      });
    }

    // Also seed some budgets for these months
    for (const cat of categories.slice(0, 5)) {
      await prisma.budget.upsert({
        where: {
          userId_categoryId_month_year: {
            userId: user.id,
            categoryId: cat.id,
            month: monthDate.getMonth() + 1,
            year: monthDate.getFullYear()
          }
        },
        update: {},
        create: {
          userId: user.id,
          categoryId: cat.id,
          month: monthDate.getMonth() + 1,
          year: monthDate.getFullYear(),
          limit: Math.floor(Math.random() * 5000) + 3000,
          spent: 0 // Will be updated by transactions in a real scenario, 
                  // but here we just seed the limit. 
                  // Actually, let's pre-calculate spent for the seeded data.
        }
      });
    }
  }

  // Calculate spent for budgets based on seeded transactions
  // This is a bit complex for a script, so we'll just run a cleanup pass
  
  await prisma.transaction.createMany({ data: txs });
  console.log(`Seeded ${txs.length} transactions over 12 months for ${email}`);

  // Update budget spent values
  for (let m = 0; m < 12; m++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const mNum = monthDate.getMonth() + 1;
    const yNum = monthDate.getFullYear();

    for (const cat of categories) {
      const spentSum = txs
        .filter(t => t.type === 'EXPENSE' && t.categoryId === cat.id && (t.date.getMonth() + 1) === mNum && t.date.getFullYear() === yNum)
        .reduce((sum, t) => sum + t.amount, 0);
      
      if (spentSum > 0) {
        await prisma.budget.updateMany({
          where: { userId: user.id, categoryId: cat.id, month: mNum, year: yNum },
          data: { spent: spentSum }
        });
      }
    }
  }
  
  console.log('Budget spent values synchronized');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
