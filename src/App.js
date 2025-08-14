import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ExpenseProvider } from "./context/ExpenseContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AddExpensePage from "./pages/AddExpensePage";
import ExpensesListPage from "./pages/ExpensesListPage";
import EditExpensePage from "./pages/EditExpensePage";

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

            <Route path="/edit/:id" element={<EditExpensePage />} />
          </Routes>
        </Router>
      </ExpenseProvider>
    </div>
  );
}

export default App;
