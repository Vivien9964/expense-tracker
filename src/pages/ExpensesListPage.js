import React from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { useNavigate } from 'react-router-dom';


function ExpensesListPage() {

  // Get necessary functions, state from ExpenseContext.js
  const { expenses, editExpense, deleteExpense } = useExpenses();
  
  const navigate = useNavigate();

  // Calculate total costs from expenses data
  const totalCosts = expenses.reduce((total, expense) => {
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

          <p>Total expenses: {expenses.length}</p>

          <div className="expense-list-container">
            {expenses.map((expense) => (
              <div key={expense.id} >
                <div>
                  <h4>{expense.title}</h4>
                  <p>
                    Date: {expense.date}
                  </p>
                </div>
                <div>
                  <h3>${expense.amount}</h3>
                  <button onClick={() => navigate(`/edit/${expense.id}`)}>
                    Edit
                  </button>

                  <button onClick={() => deleteExpense(expense.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="summary-container">
            <h4>Summary:</h4>
            <p>Total Expenses: {expenses.length}</p>
            <p><strong>Total Amount: {totalCosts.toFixed(2)}$</strong></p>
          </div>


            <button onClick={() => navigate('/add')}>Add Expense</button>
            <button onClick={() => navigate('/')}>See Stats</button>

        </div>

      )}

    </div>
  );
}

export default ExpensesListPage; 