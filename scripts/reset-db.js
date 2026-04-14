/**
 * Smart Fintech - Database Seed Script
 * Uses @neondatabase/serverless neon() HTTP client directly for reliability.
 */
const { neon } = require('@neondatabase/serverless');

const DB_URL = "postgresql://neondb_owner:npg_x34BYUVSWMRz@ep-flat-snow-a4j15zjs-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const sql = neon(DB_URL);

function cuid() {
  return 'c' + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
}

async function main() {
  console.log('🗑️  Clearing existing data...');

  // Clear in dependency order
  await sql`DELETE FROM "Transaction"`;
  await sql`DELETE FROM "Budget"`;
  await sql`DELETE FROM "SavingGoal"`;
  await sql`DELETE FROM "Notification"`;
  await sql`DELETE FROM "Account"`;
  await sql`DELETE FROM "Category"`;
  await sql`DELETE FROM "User"`;

  console.log('✅ All data cleared');
  console.log('🌱 Seeding demo user: irisneha10@gmail.com...');

  // 1. Create User
  const userId = cuid();
  await sql`
    INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
    VALUES (
      ${userId}, 'Iris Neha', 'irisneha10@gmail.com',
      'password123', 'USER', NOW(), NOW()
    )
  `;

  // 2. Create Categories
  const categories = [
    { name: 'Traveling', type: 'EXPENSE' },
    { name: 'Transport', type: 'EXPENSE' },
    { name: 'Medical', type: 'EXPENSE' },
    { name: 'Food', type: 'EXPENSE' },
    { name: 'Grocery', type: 'EXPENSE' },
    { name: 'Insurance', type: 'EXPENSE' },
    { name: 'Loans', type: 'EXPENSE' },
    { name: 'EMI', type: 'EXPENSE' },
    { name: 'Other Expenses', type: 'EXPENSE' },
    { name: 'Salary', type: 'INCOME' },
    { name: 'Investment', type: 'INCOME' },
  ];

  const catIds = {};
  for (const cat of categories) {
    const id = cuid();
    catIds[cat.name] = id;
    await sql`
      INSERT INTO "Category" (id, name, type)
      VALUES (${id}, ${cat.name}, ${cat.type})
      ON CONFLICT (name) DO UPDATE SET type = ${cat.type}
      RETURNING id
    `;
  }

  // Re-fetch actual IDs in case of conflict
  const rows = await sql`SELECT id, name FROM "Category"`;
  for (const r of rows) catIds[r.name] = r.id;

  // 3. Create Accounts
  const checkingId = cuid();
  const savingsId = cuid();
  const creditId = cuid();

  await sql`
    INSERT INTO "Account" (id, name, balance, currency, "userId")
    VALUES
      (${checkingId}, 'Main Checking', 5240.50, 'USD', ${userId}),
      (${savingsId},  'High Yield Savings', 12500.00, 'USD', ${userId}),
      (${creditId},   'Credit Card', -850.20, 'USD', ${userId})
  `;

  // 4. Create Saving Goal
  await sql`
    INSERT INTO "SavingGoal" (id, name, "targetAmount", "currentAmount", deadline, "userId")
    VALUES (${cuid()}, 'Emergency Fund', 15000, 12500, '2027-01-01', ${userId})
  `;

  // 5. Create Monthly Budgets
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const budgets = [
    { cat: 'Food',    limit: 600, spent: 450 },
    { cat: 'Grocery', limit: 400, spent: 320 },
    { cat: 'Transport', limit: 150, spent: 90 },
    { cat: 'Medical', limit: 200, spent: 0 },
    { cat: 'Traveling', limit: 300, spent: 120 },
  ];

  for (const b of budgets) {
    if (!catIds[b.cat]) continue;
    await sql`
      INSERT INTO "Budget" (id, "limit", spent, month, year, "userId", "categoryId")
      VALUES (${cuid()}, ${b.limit}, ${b.spent}, ${month}, ${year}, ${userId}, ${catIds[b.cat]})
      ON CONFLICT ("userId", "categoryId", month, year) DO UPDATE SET spent = ${b.spent}
    `;
  }

  // 6. Seed 30 days of transactions
  console.log('💳 Creating 30 days of transaction history...');
  const txs = [];

  // Salary at start of month
  txs.push({
    amount: 5000, desc: 'Monthly Salary', type: 'INCOME',
    cat: 'Salary', accountId: checkingId,
    date: new Date(year, month - 1, 1).toISOString()
  });

  // Investment return mid-month
  txs.push({
    amount: 320, desc: 'Stock Dividends', type: 'INCOME',
    cat: 'Investment', accountId: savingsId,
    date: new Date(year, month - 1, 14).toISOString()
  });

  const expenseTemplates = [
    { desc: 'Coffee & Breakfast', cat: 'Food', minAmt: 5, maxAmt: 25, accountId: checkingId },
    { desc: 'Uber Ride', cat: 'Transport', minAmt: 8, maxAmt: 30, accountId: checkingId },
    { desc: 'Supermarket', cat: 'Grocery', minAmt: 40, maxAmt: 120, accountId: creditId },
    { desc: 'Restaurant Dinner', cat: 'Food', minAmt: 20, maxAmt: 60, accountId: creditId },
    { desc: 'Monthly EMI', cat: 'EMI', minAmt: 250, maxAmt: 250, accountId: checkingId },
    { desc: 'Netflix Subscription', cat: 'Other Expenses', minAmt: 15.99, maxAmt: 15.99, accountId: creditId },
    { desc: 'Health Insurance', cat: 'Insurance', minAmt: 120, maxAmt: 120, accountId: checkingId },
    { desc: 'Weekend Brunch', cat: 'Food', minAmt: 15, maxAmt: 50, accountId: creditId },
    { desc: 'Bus Pass', cat: 'Transport', minAmt: 40, maxAmt: 40, accountId: checkingId },
    { desc: 'Doctor Visit', cat: 'Medical', minAmt: 50, maxAmt: 150, accountId: checkingId },
  ];

  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayDate = d.toISOString();

    // 1-3 expenses per day
    const count = 1 + Math.floor(Math.random() * 3);
    for (let j = 0; j < count; j++) {
      const tmpl = expenseTemplates[Math.floor(Math.random() * expenseTemplates.length)];
      const amt = tmpl.minAmt === tmpl.maxAmt
        ? tmpl.minAmt
        : tmpl.minAmt + Math.random() * (tmpl.maxAmt - tmpl.minAmt);
      txs.push({
        amount: parseFloat(amt.toFixed(2)),
        desc: tmpl.desc,
        type: 'EXPENSE',
        cat: tmpl.cat,
        accountId: tmpl.accountId,
        date: dayDate
      });
    }
  }

  for (const tx of txs) {
    const catId = catIds[tx.cat];
    if (!catId) { console.log(`  Skipping unknown category: ${tx.cat}`); continue; }
    await sql`
      INSERT INTO "Transaction" (id, amount, description, date, type, "userId", "accountId", "categoryId")
      VALUES (${cuid()}, ${tx.amount}, ${tx.desc}, ${tx.date}::timestamptz, ${tx.type}, ${userId}, ${tx.accountId}, ${catId})
    `;
  }

  console.log(`✅ Seeded ${txs.length} transactions`);
  console.log('');
  console.log('🎉 Seed complete!');
  console.log('   📧 Email:    irisneha10@gmail.com');
  console.log('   🔑 Password: password123');
  console.log('   🌐 App:      http://localhost:3000');
}

main().catch(e => { console.error('❌ Seed failed:', e.message); process.exit(1); });
