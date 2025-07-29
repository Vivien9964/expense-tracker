import React, { createContext, useContext, useState, useEffect } from 'react';

const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {

  //Store expenses in an array
  const [expenses, setExpenses] = useState([]); 


  // Update local storage, whenver expenses array changes!
  useEffect(() => {
    if(expenses.length > 0) {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [expenses])


  // Load saved expenses when the app starts
  useEffect(() => {

    try {

      // Get saved data
      const savedExpenses = localStorage.getItem('expenses');

      // Check if data exists
      if(savedExpenses) {
        // Saved data exists
        const parsedExpenses = JSON.parse(savedExpenses);
        // Update expenses array
        setExpenses(parsedExpenses);
        console.log("Loaded expenses", parsedExpenses);
      } else {
        // No saved data yet
        console.log("No saved expenses found!");
      }
    } catch(error) {
      // Error in loading data
      console.error("Error loading expenses", error);
    }
  }, []);

  // Function to add a new expense to the array with:
  // -> unique ID
  // -> title
  // -> amount
  // -> date
  const addExpense = (expense) => {
    const today = new Date().toISOString().split('T')[0];

    // New object containing info all above
    const newExpense = {
      ...expense,
      id: Date.now(),
      date: today
    };

    setExpenses([...expenses, newExpense]);

  };
  

  // Function to delete a specific expense from the list
  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
    console.log("Deleted expense with ID:", id);
  }

  // Function to edit a given expense - with simple pop-up box for now
  const editExpense = (id, updatedData) => {
    setExpenses(expenses.map(expense => {

      if(expense.id === id) {
        return {...expense, ...updatedData};
      }

      return expense;
    }));
  }



  const contextValue = {
    // Data:
    expenses,          
    
    // Functions:
    addExpense,     

    deleteExpense,

    editExpense,
    
  };
  

  return (
    <ExpenseContext.Provider value={contextValue}>
      {children}
    </ExpenseContext.Provider>
  );
}

// Helper hook that imports useContext and ExpenseContext 
export function useExpenses() {

  const context = useContext(ExpenseContext);

  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  
  return context;
}
