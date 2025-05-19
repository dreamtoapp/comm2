import { getExpenses } from './action/expenseActions';
import ExpenseListClient from './component/ExpenseListClient';

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp?.page || '1', 10);
  const rowsPerPage = 20;
  const search = sp?.search || '';
  const category = sp?.category || '';
  const { expenses, total } = await getExpenses({
    search,
    category,
    skip: (page - 1) * rowsPerPage,
    take: rowsPerPage,
  });
  return (
    <ExpenseListClient
      expenses={expenses}
      total={total}
      page={page}
      rowsPerPage={rowsPerPage}
      search={search}
      category={category}
    />
  );
}
