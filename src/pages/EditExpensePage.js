import Reac, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';

function EditExpensePage() {

    const { expenses, editExpense } = useExpenses();
    const navigate = useNavigate();
    const { id } = useParams(); 

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [countDown, setCountDown] = useState(0);
    




    return (

        <div className="main-edit-container">





        </div>
    );

}





export default EditExpensePage;