import React from 'react';
import { Link } from 'react-router-dom';


function Navbar() {
  return (
    
    <nav className="navbar">
      
      <Link to="/">Home</Link>
    
      <Link to="/add">Add Expense</Link>
      
      <Link to="/expenses">View Expenses</Link>
    
    </nav>
  );
}

export default Navbar; 