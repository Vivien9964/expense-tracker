import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import styles from './EditExpensePage.module.css';

function EditExpensePage() {

    // Get expenses array and editExpense function from context
    const { expenses, editExpense } = useExpenses();
    const navigate = useNavigate();
    // New! -> Reading dynamic parameters from URL
    const { id } = useParams();  // string -> need to convert it to number

    // Same states as in AddExpensePage
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food & Dining');
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [countDown, setCountDown] = useState(0);

    // Predefined category options
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


    // Get expense and show a pre-populated form with the current input 
    useEffect(() => {
        const expenseToEdit = expenses.find(expense => expense.id === parseInt(id));

        if(expenseToEdit) {
            // Expense exists -> show automatically data for user
            setTitle(expenseToEdit.title);
            setAmount(expenseToEdit.amount);
            setCategory(expenseToEdit.category || 'Food & Dining'); // Default if no category
        } else {
            // No matching expense -> redirect back 
            // -> expense was deleted or user entered the wrong URL
            navigate('/expenses'); 

        }
    }, [id, expenses, navigate])


    // Handle submit function from AddExpensePage 
    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Same validation as in AddExpensePage
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

        // New, edited data
        const updatedData = {
            title: title.trim(),
            amount: parseFloat(amount).toFixed(2),
            category: category
        };


        editExpense(parseInt(id), updatedData);

        setTitle('');
        setAmount('');
        setSuccess(true);
        setCountDown(3);

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


    // Same as in AddExpensePage
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        if(errors.title) {
          setErrors(prev => ({
            ...prev,
            title: ''
          }));
        }
      }


      // Same as in AddExpensePage
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
                // Update was successful
                <div className={`card ${styles.successContainer}`}>
                    <div className={styles.successIcon}>✅</div>
                    <h2 className={styles.successTitle}>Expense updated successfully!</h2>
                    <p className={styles.successMessage}>Redirecting to your expenses list in <span className={styles.countdown}>{countDown}</span>...</p>
                </div>
            ) : (
                // Update wasn't successful
                <div className={styles.errorContainer}>
                    <h1 className={styles.pageTitle}>Edit Expense</h1>
    
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
                        <button type="button" onClick={() => navigate('/expenses')} className="btn-outline">Cancel</button>
                        <button type="submit" className="btn-primary">Update Expense</button>
                    </div>

                    </form>

                </div>

            )}

            </div>



        </div>
    );

}





export default EditExpensePage;