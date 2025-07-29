import React, { useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';


function AddExpensePage() {

  // Expense context -> Get addExpense function from context
  const { addExpense } = useExpenses();
  const navigate = useNavigate();
  
  // States to manage user input: validation, success and error messages
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [countdown, setCountDown] = useState(0);

  
  // Function to manage form submission:
  // -> form validation : title (it is not empty, longer), amount (not null, not negative)
  // -> error handling : if validation fails in any field, they are saved in errors object
  // -> reset states, start countdown and navigate to ExpenseListPage.js
  // Reused in EditExpensePage 
  const handleSubmit = (e) => {
    e.preventDefault(); 

    setErrors({});

    const newErrors = {};

    if(!title.trim()) {
      newErrors.title = "Please, enter title!";
    } else if(title.trim().length < 3) {
      newErrors.title = "Title must be at least three characters!";
    }

    if(!amount) {
      newErrors.amount = "Please, enter valid amount!"
    } else if(parseFloat(amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0!"
    }

    if(Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const expense = {
      title: title.trim(),
      amount: parseFloat(amount).toFixed(2)
    }
   
    addExpense(expense);
    setTitle('');
    setAmount('');
    setSuccess(true);
    setCountDown(3)

    const countdownInterval = setInterval(() => {
      setCountDown(prev => {
        if(prev <= 1) {
          clearInterval(countdownInterval);
          navigate('/expenses');
          return 0;
        }
        return prev - 1;
      })
    }, 1000);

  };


  // Function to handle title changes, in case an error occoured
  // When users start typing, the error message disappears
  // -> sets new title 
  // -> hides error message
  // Used in EditExpensePage as well
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if(errors.title) {
      setErrors(prev => ({
        ...prev,
        title: ''
      }));
    }
  }


  // Function to handle amount changes, in case an error occured
  // When users start typing the error message disappears
  // -> sets new amount value
  // -> hides error message
  // Used in EditExpensePage as well
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    if(errors.amount) {
      setErrors(prev => ({
        ...prev,
        amount: ''
      }));
    }
  }


  return (
    <div className="add-expense-container">

      {success ? (

        <div className="add-success-container">
          <h2>Expense added successfully!</h2>
          <p>Redirecting to your expenses list in {countdown}...</p>
          <button onClick={() => navigate('/expenses')}>View Expenses Now</button>
        </div>
      ) 
      : (

      <div className="add-error-container">

        <h1>Add New Expense</h1>
    
        <form onSubmit={handleSubmit}>
        
          <div className="title-container">
            <label>Expense Title:</label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g., Lunch, Gas, Coffee..."
            />

            {errors.title && (
              <div className="error-statement"><p>{errors.title}</p></div>
            )}
          </div>
        
          <div className="amount-container">
            <label>Amount ($):</label>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="e.g., 25.50"
              step="0.01"
              min="0"
            />
             {errors.amount && (
              <div className="error-statement"><p>{errors.amount}</p></div>
            )}
          </div>

          <button className="add-expense-btn" type="submit">Add Expense</button>

        </form>
      </div>
    )}

  </div>
  );
}

export default AddExpensePage; 