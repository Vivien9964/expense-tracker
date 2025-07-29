import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';

function EditExpensePage() {

    // Get expenses array and editExpense function from context
    const { expenses, editExpense } = useExpenses();
    const navigate = useNavigate();
    // New! -> Reading dynamic parameters from URL
    const { id } = useParams();  // string -> need to convert it to number

    // Same states as in AddExpensePage
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [countDown, setCountDown] = useState(0);


    // Get expense and show a pre-populated form with the current input 
    useEffect(() => {
        const expenseToEdit = expenses.find(expense => expense.id === parseInt(id));

        if(expenseToEdit) {
            // Expense exists -> show automatically data for user
            setTitle(expenseToEdit.title);
            setAmount(expenseToEdit.amount);
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
            amount: parseFloat(amount).toFixed(2)
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



    return (

        <div className="main-edit-container">

            {success ? (
                // Update was successful
                <div className="update-success-container">
                    <h2>Expense updated successfully!</h2>
                    <p>Redirecting to your expenses list in {countDown}...</p>
                    <button onClick={() => navigate('/expenses')}>Go to your expenses</button>
                </div>
            ) : (
                // Update wasn't successful
                <div className="update-error-container">
                    <h1>Add New Expense</h1>
    
                    <form onSubmit={handleSubmit}>
                    
                    <div className="edit-title-container">
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
                    
                    <div className="edit-amount-container">
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

                    <button className="edit-expense-btn" type="submit">Edit Expense</button>

                    </form>

                </div>

            )}





        </div>
    );

}





export default EditExpensePage;