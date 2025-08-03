import React, { useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import styles from './AddExpensePage.module.css';


function AddExpensePage() {

  // Expense context -> Get addExpense function from context
  const { addExpense } = useExpenses();
  const navigate = useNavigate();
  
  // States to manage user input: validation, success and error messages
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [countdown, setCountDown] = useState(0);

  // Expense category options
  const categoryOptions = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Groceries',
    'Personal Care',
    'Home & Garden',
    'Gifts & Donations',
    'Other'
  ];

  
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
      amount: parseFloat(amount).toFixed(2),
      category: category
    }
   
    addExpense(expense);
    setTitle('');
    setAmount('');
    setCategory('Food & Dining');
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

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  }


  return (
    <div className="container">
      <div className="form-container">

      {success ? (

        <div className={`card ${styles.successContainer}`}>
          <div className={styles.successIcon}>✅</div>
          <h2 className={styles.successTitle}>Expense added successfully!</h2>
          <p className={styles.successMessage}>Redirecting to your expenses list in <span className={styles.countdown}>{countdown}</span>...</p>
          <button onClick={() => navigate('/expenses')} className={`btn-primary ${styles.viewNowButton}`}>View Expenses Now</button>
        </div>
      ) 
      : (

      <div className={styles.errorContainer}>

        <h1 className={styles.pageTitle}>Add New Expense</h1>
    
        <form onSubmit={handleSubmit} className={`card ${styles.formCard}`}>
        
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Expense Title:</label>
            <input
              type="text"
              className={styles.formInput}
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g., Lunch, Gas, Coffee..."
            />

            {errors.title && (
              <div className={styles.errorMessage}>{errors.title}</div>
            )}
          </div>
        
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Amount ($):</label>
            <input
              type="number"
              className={styles.formInput}
              value={amount}
              onChange={handleAmountChange}
              placeholder="e.g., 25.50"
              step="0.01"
              min="0"
            />
             {errors.amount && (
              <div className={styles.errorMessage}>{errors.amount}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Category:</label>
            <select
              value={category}
              onChange={handleCategoryChange}
              className={styles.formSelect}
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={() => {setTitle(''); setAmount(''); setCategory('Food & Dining');}} className="btn-outline">Reset</button>
            <button type="submit" className="btn-primary">Add Expense</button>
          </div>

        </form>
      </div>
    )}
      
      </div>
    </div>
  );
}

export default AddExpensePage; 