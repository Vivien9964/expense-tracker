import React, {useState} from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { useNavigate } from 'react-router-dom';
import styles from './ExpensesListPage.module.css';


function ExpensesListPage() {

  // Get necessary functions, state from ExpenseContext.js
  const { expenses, deleteExpense } = useExpenses();
  
  const navigate = useNavigate();


  // Search states
  const [searchTitle, setSearchTitle] = useState('');
  const [searchDate, setSearchDate] = useState('all');
  const [searchAmount, setSearchAmount] = useState('all');
  const [searchCategory, setSearchCategory] = useState('all');

  
  // Search by date -> all, prev. week, prev. month
  const filterByDate = (expense) => {
    if(searchDate === 'all') return true;

    const expenseDate = new Date(expense.date);
    const today = new Date();

    if(searchDate === 'week') {
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return expenseDate >= lastWeek;
    }

    if(searchDate === 'month') {
      const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      return expenseDate >= lastMonth;
    }

    return true;

  };

  // Search by amount range
  const filterByAmount = (expense) => {
    if(searchAmount === 'all') return true;

    const amount = parseFloat(expense.amount);

    if(searchAmount === 'under50') return amount < 50;
    if(searchAmount === '50to100') return amount >= 50 && amount <= 100;
    if(searchAmount === 'over100') return amount > 100;

    return true;
  };


  // Searches combined 
  const filteredExpenses = expenses.filter(expense => {
    const matchTitle = expense.title.toLowerCase().includes(searchTitle.toLowerCase());
    const matchDate = filterByDate(expense);
    const matchAmount = filterByAmount(expense);
    const matchCategory = searchCategory === 'all' || expense.category === searchCategory;

    return matchTitle && matchDate && matchAmount && matchCategory;

  });

  // Get unique categories from expenses for filter dropdown
  const availableCategories = [...new Set(expenses.map(expense => expense.category).filter(Boolean))];

   // Calculate total costs from expenses data
   const totalCosts = filteredExpenses.reduce((total, expense) => {
    return total + parseFloat(expense.amount);
  }, 0);

  
  
  return (

    <div className="container">

      <h1 className={styles.pageTitle}>Your Expenses</h1>
      
      {expenses.length === 0 ? (
        // No registered expenses
        <div className={`card ${styles.emptyState}`}>
          <h3 className={styles.emptyTitle}>No expenses yet!</h3>
          <p className={styles.emptyMessage}>Start by adding your first expense.</p>
          <button onClick={() => navigate('/add')} className="btn-primary"> Add Expense now!</button>
        </div>

      ) : (
        
        // With registered expenses
        <div>

          <div className={`card ${styles.filterCard}`}>
            <h3 className={styles.filterTitle}>
              🔍 Filter Expenses
            </h3>
            <div className={styles.filterGrid}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  Search by title:
                </label>
                <input 
                  type="text" 
                  placeholder="Search expenses..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className={styles.filterInput}
                />
              </div>
              
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  Filter by Date:
                </label>
                <select 
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">All</option>
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  Filter by Amount:
                </label>
                <select
                  value={searchAmount}
                  onChange={(e) => setSearchAmount(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">All</option>
                  <option value="under50">Under 50</option>
                  <option value="50to100">50 - 100</option>
                  <option value="over100">Over 100</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  Filter by Category:
                </label>
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">All Categories</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
         

          <p className={styles.resultsInfo}>Total expenses: {filteredExpenses.length}</p>

          <div className={styles.expensesList}>
            {filteredExpenses.map((expense) => (
              <div key={expense.id} className={`card ${styles.expenseItem}`}>
                <div className={styles.expenseDetails}>
                  <h4 className={styles.expenseTitle}>{expense.title}</h4>
                  <p className={styles.expenseInfo}>
                    📅 {expense.date} • 🏷️ {expense.category || 'Uncategorized'}
                  </p>
                </div>
                <div className={styles.expenseActions}>
                  <h3 className={styles.expenseAmount}>${expense.amount}</h3>
                  <div className={styles.actionButtons}>
                    <button className="btn-outline" onClick={() => navigate(`/edit/${expense.id}`)}>Edit</button>
                    <button className="btn-danger" onClick={() => deleteExpense(expense.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={`card ${styles.summaryCard}`}>
            <h4 className={styles.summaryTitle}>Summary</h4>
            <div className={styles.summaryStats}>
              <p>Total Expenses: {filteredExpenses.length}</p>
              <p className={styles.summaryAmount}><strong>Total Amount: ${totalCosts.toFixed(2)}</strong></p>
            </div>
          </div>

          <div className={styles.navigationButtons}>
            <button className="btn-primary" onClick={() => navigate('/add')}>Add Expense</button>
            <button className="btn-secondary" onClick={() => navigate('/')}>See Stats</button>
          </div>

        </div>

      )}

    </div>
  );
}

export default ExpensesListPage; 