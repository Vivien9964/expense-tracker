import React from 'react';
import { useExpenses } from '../context/ExpenseContext';


function HomePage() {

  const { expenses } = useExpenses();
  
  return (
    <div className="container">
      <h1>Welcome to Expense Tracker!</h1>
      
      <p>This is a simple app to track your expenses.</p>
      
     
      <div>
        <h3>Quick Stats:</h3>
        <p>Total Expenses: {expenses.length}</p>
        
       
        {expenses.length === 0 ? (
          <p>No expenses yet. <strong>Add your first expense!</strong></p>
        ) : (
          <p>Great! You're tracking your expenses. 💰</p>
        )}
      </div>
      
      
    </div>
  );
}

export default HomePage; 