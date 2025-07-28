import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ExpenseProvider } from './context/ExpenseContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AddExpensePage from './pages/AddExpensePage';
import ExpensesListPage from './pages/ExpensesListPage';

function App() {
  return (
    <div className="App">
      <ExpenseProvider>

        <Router>

          <Navbar />

          <Routes>
          
            <Route path="/" element={<HomePage />} />
          
            <Route path="/add" element={<AddExpensePage />} />
          
            <Route path="/expenses" element={<ExpensesListPage />} />

          </Routes>
        
        </Router>

      </ExpenseProvider>
      
    </div>
  );
}

export default App; 