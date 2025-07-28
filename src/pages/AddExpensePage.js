import React, { useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';


function AddExpensePage() {

  // Expense context
  const { addExpense } = useExpenses();
  const navigate = useNavigate();
  
  // States to manage user input validation, success and error messages
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [countdown, setCountDown] = useState(0);

  
  // Function to manage form submission:
  // -> form validation : title (it is not empty, longer), amount (not null, not negative)
  // -> error handling : if validation fails in any field, they are saved in errors object
  // -> reset states, start countdown and navigate to ExpenseListPage.js

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
    <div className="container">

      {success ? (

        <div>
          <h2>Expense added successfully!</h2>
          <p>Redirecting to your expenses list in {countdown}...</p>
          <button onClick={() => navigate('/expenses')}>View Expenses Now</button>
        </div>
      ) 
      : (

      <div>

        <h1>Add New Expense</h1>
    
        <form onSubmit={handleSubmit}>
        
          <div>
            <label>Expense Title:</label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g., Lunch, Gas, Coffee..."
            />

            {errors.title && (
              <div><p>{errors.title}</p></div>
            )}
          </div>
        
          <div>
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
              <div><p>{errors.amount}</p></div>
            )}
          </div>

          <button type="submit">Add Expense</button>

        </form>
      </div>
    )}

  </div>
  );
}

export default AddExpensePage; 