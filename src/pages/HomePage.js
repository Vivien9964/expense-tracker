import React from 'react';
import { useExpenses } from '../context/ExpenseContext';

/*
  HOME PAGE COMPONENT
  
  This is our welcome/landing page. It demonstrates:
  1. How to access Context data in a component
  2. Basic JSX structure
  3. Conditional rendering based on data
*/

function HomePage() {
  // ACCESSING CONTEXT DATA:
  // This hook gives us access to the shared expense data
  const { expenses } = useExpenses();
  
  return (
    <div className="container">
      <h1>Welcome to Expense Tracker!</h1>
      
      <p>This is a simple app to track your expenses.</p>
      
      {/* 
        EXAMPLE OF USING CONTEXT DATA:
        We can display information based on the shared state
      */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '5px' }}>
        <h3>Quick Stats:</h3>
        <p>Total Expenses: {expenses.length}</p>
        
        {/* TODO: You can add more stats here, like total amount */}
        
        {/* CONDITIONAL RENDERING EXAMPLE: */}
        {expenses.length === 0 ? (
          <p>No expenses yet. <strong>Add your first expense!</strong></p>
        ) : (
          <p>Great! You're tracking your expenses. 💰</p>
        )}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>How to use this app:</h3>
        <ol>
          <li>Click "Add Expense" to add a new expense</li>
          <li>Click "View Expenses" to see all your expenses</li>
          <li>Use the navigation bar to move between pages</li>
        </ol>
      </div>
    </div>
  );
}

export default HomePage; 