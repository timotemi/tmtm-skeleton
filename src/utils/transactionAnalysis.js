export function analyzeTransactions(transactions = []) {
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const incomeTransactions = safeTransactions.filter(
    (transaction) => transaction.type === 'income',
  );

  const expenseTransactions = safeTransactions.filter(
    (transaction) => transaction.type === 'expense',
  );

  const totalIncome = incomeTransactions.reduce(
    (sum, transaction) => sum + Number(transaction.amount || 0),
    0,
  );

  const totalExpense = expenseTransactions.reduce(
    (sum, transaction) => sum + Number(transaction.amount || 0),
    0,
  );

  const netProfit = totalIncome - totalExpense;

  const expenseByCategory = {};
  expenseTransactions.forEach((transaction) => {
    const category = transaction.category || '기타';
    expenseByCategory[category] =
      (expenseByCategory[category] || 0) + Number(transaction.amount || 0);
  });

  const incomeByCategory = {};
  incomeTransactions.forEach((transaction) => {
    const category = transaction.category || '기타';
    incomeByCategory[category] =
      (incomeByCategory[category] || 0) + Number(transaction.amount || 0);
  });

  const expenseRatioByCategory = {};
  Object.keys(expenseByCategory).forEach((category) => {
    expenseRatioByCategory[category] =
      totalExpense === 0
        ? 0
        : Number(
            ((expenseByCategory[category] / totalExpense) * 100).toFixed(1),
          );
  });

  const topExpenseCategoryEntry = Object.entries(expenseByCategory).sort(
    (a, b) => b[1] - a[1],
  )[0];

  const topExpenseCategory = topExpenseCategoryEntry
    ? topExpenseCategoryEntry[0]
    : '없음';

  const topExpenseAmount = topExpenseCategoryEntry
    ? topExpenseCategoryEntry[1]
    : 0;

  const expenseCount = expenseTransactions.length;
  const incomeCount = incomeTransactions.length;

  const averageExpense =
    expenseCount === 0 ? 0 : Math.round(totalExpense / expenseCount);

  const averageIncome =
    incomeCount === 0 ? 0 : Math.round(totalIncome / incomeCount);

  const expenseRateComparedToIncome =
    totalIncome === 0
      ? 0
      : Number(((totalExpense / totalIncome) * 100).toFixed(1));

  const sortedExpenseCategories = Object.entries(expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => ({
      category,
      amount,
      ratio: expenseRatioByCategory[category],
    }));

  return {
    totalIncome,
    totalExpense,
    netProfit,
    expenseByCategory,
    incomeByCategory,
    expenseRatioByCategory,
    topExpenseCategory,
    topExpenseAmount,
    averageExpense,
    averageIncome,
    expenseRateComparedToIncome,
    sortedExpenseCategories,
    transactionCount: safeTransactions.length,
    expenseCount,
    incomeCount,
  };
}

export function formatMoney(value) {
  return Number(value || 0).toLocaleString('ko-KR');
}
