import React, {useState} from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { useNavigate } from 'react-router-dom';


function ExpensesListPage() {

  // Get necessary functions, state from ExpenseContext.js
  const { expenses, deleteExpense } = useExpenses();
  
  const navigate = useNavigate();


  // Search states
  const [searchTitle, setSearchTitle] = useState('');
  const [searchDate, setSearchDate] = useState('all');
  const [searchAmount, setSearchAmount] = useState('all');

  
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

    return matchTitle && matchDate && matchAmount;

  });

   // Calculate total costs from expenses data
   const totalCosts = filteredExpenses.reduce((total, expense) => {
    return total + parseFloat(expense.amount);
  }, 0);

  
  
  return (

    <div className="main-container">

      <h1>Your Expenses</h1>
      
      {expenses.length === 0 ? (
        // No registered expenses
        <div className="no-expense-container">
          <h3>No expenses yet!</h3>
          <p>Start by adding your first expense.</p>
          <button onClick={() => navigate('/add')}> Add Expense now!</button>
        </div>

      ) : (
        
        // With registered expenses
        <div className="expense-container">

          <div className="filter-container">
          <input 
            type="text" 
            placeholder="Search expenses..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />

          <select 
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          >
            <option value="all">All</option>
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
          </select>


          <select
            value={searchAmount}
            onChange={(e) => setSearchAmount(e.target.value)}
          >
            <option value="all">All</option>
            <option value="under50">Under 50</option>
            <option value="50to100">50 - 100</option>
            <option value="over100">Over 100</option>
          </select>


          </div>
         

          <p>Total expenses: {filteredExpenses.length}</p>

          <div className="expense-list-container">
            {filteredExpenses.map((expense) => (
              <div key={expense.id} >
                <div className="expense-details">
                  <h4>{expense.title}</h4>
                  <p>
                    Date: {expense.date}
                  </p>
                </div>
                <div>
                  <h3>${expense.amount}</h3>
                  <button className="edit-btn" onClick={() => navigate(`/edit/${expense.id}`)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteExpense(expense.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="summary-container">
            <h4>Summary:</h4>
            <p>Total Expenses: {filteredExpenses.length}</p>
            <p><strong>Total Amount: {totalCosts.toFixed(2)}$</strong></p>
          </div>

          <button className="add-expense-btn" onClick={() => navigate('/add')}>Add Expense</button>
          <button className="stats-btn" onClick={() => navigate('/')}>See Stats</button>

        </div>

      )}

    </div>
  );
}

export default ExpensesListPage; 