import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import styles from './HomePage.module.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


function HomePage() {

  // Get expenses list and navigatio
  const { expenses } = useExpenses();
  const navigate = useNavigate();

  // Get current month's expenses
  const getCurrentMonthExpenses = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
  }

  // Calculate category totals for chart
  const getCategoryData = () => {
    const currentMonthExpenses = getCurrentMonthExpenses();
    const categoryTotals = {};

    currentMonthExpenses.forEach(expense => {
      const category = expense.category || 'Uncategorized';
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += parseFloat(expense.amount);
    });

    return categoryTotals;
  };

  // Total amount of expenses this month
  const currentMonthExpenses = getCurrentMonthExpenses();
  const currentMonthTotal = currentMonthExpenses.reduce((total, expense) => {
      return total + parseFloat(expense.amount);
  }, 0);

  // Get recent expenses (last 3)
  const getRecentExpenses = () => {
    return expenses
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  };

  // Calculate insights
  const getInsights = () => {
    if (currentMonthExpenses.length === 0) return null;

    // Average daily spending this month
    const daysInMonth = new Date().getDate();
    const avgDaily = currentMonthTotal / daysInMonth;

    // Highest single expense this month
    const highestExpense = currentMonthExpenses.reduce((max, expense) => 
      parseFloat(expense.amount) > parseFloat(max.amount) ? expense : max
    );

    // Most frequent category
    const categoryCount = {};
    currentMonthExpenses.forEach(expense => {
      const category = expense.category || 'Uncategorized';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    const mostFrequentCategory = Object.keys(categoryCount).length > 0 
      ? Object.keys(categoryCount).reduce((a, b) => 
          categoryCount[a] > categoryCount[b] ? a : b
        )
      : 'No data';

    // Last month comparison (if we have data)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === lastMonth.getMonth() && 
             expenseDate.getFullYear() === lastMonth.getFullYear();
    });
    const lastMonthTotal = lastMonthExpenses.reduce((total, expense) => 
      total + parseFloat(expense.amount), 0
    );

    return {
      avgDaily,
      highestExpense,
      mostFrequentCategory,
      lastMonthTotal,
      comparison: lastMonthTotal > 0 ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal * 100) : null
    };
  };

  const recentExpenses = getRecentExpenses();
  const insights = getInsights();

  // Prepare chart data
  const categoryData = getCategoryData();
  
  const autumnColors = [
    'rgba(212, 165, 116, 0.8)', 
    'rgba(232, 180, 166, 0.8)',
    'rgba(168, 149, 107, 0.8)', 
    'rgba(230, 192, 120, 0.8)',
    'rgba(155, 182, 138, 0.8)', 
    'rgba(212, 145, 122, 0.8)', 
  ];
  
  const autumnBorders = [
    'rgba(212, 165, 116, 1)',
    'rgba(232, 180, 166, 1)',
    'rgba(168, 149, 107, 1)',
    'rgba(230, 192, 120, 1)',
    'rgba(155, 182, 138, 1)',
    'rgba(212, 145, 122, 1)',
  ];
  
  const chartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: 'Amount Spent ($)',
        data: Object.values(categoryData),
        backgroundColor: autumnColors,
        borderColor: autumnBorders,
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          font: {
            family: 'Montserrat',
            size: 12,
          },
          color: '#5a4a3a',
        },
      },
      title: {
        display: true,
        text: '🍂 Spending by Category This Month',
        font: {
          family: 'Crimson Text',
          size: 16,
          weight: '600',
        },
        color: '#5a4a3a',
        padding: 20,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(212, 165, 116, 0.1)',
        },
        ticks: {
          color: '#7d6b5a',
          font: {
            family: 'Montserrat',
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#7d6b5a',
          font: {
            family: 'Montserrat',
          },
        },
      },
    },
  };
  
  return (

    <div className="container">

      <h1 className={styles.welcomeTitle}>Welcome to Expense Tracker!</h1>
          
      {/* Stats Card */}
      <div className={`card ${styles.statsCard}`}>
        <h3 className={styles.statsTitle}>This Month's Overview</h3>
        <p className={styles.statsText}><strong>Total Spent: ${currentMonthTotal.toFixed(2)}</strong></p>
        <p className={styles.statsText}>Number of Expenses: {currentMonthExpenses.length}</p>
        
        {expenses.length === 0 ? (
          <p className={`${styles.motivationalMessage} ${styles.noExpenses}`}>
            No expenses yet. <strong>Add your first expense to get started!</strong>
          </p>
        ) : (
          <p className={`${styles.motivationalMessage} ${styles.hasExpenses}`}>
            Great! You're tracking your expenses. 💰
          </p>
        )}
      </div>

      {/* Recent Expenses Preview */}
      {recentExpenses.length > 0 && (
        <div className={`card ${styles.recentExpensesSection}`}>
          <h3 className={styles.sectionTitle}>
            🕐 Recent Expenses
          </h3>
          <div className={styles.recentExpensesList}>
            {recentExpenses.map((expense, index) => (
              <div key={expense.id} className={styles.recentExpenseItem}>
                <div className={styles.recentExpenseDetails}>
                  <div className={styles.recentExpenseTitle}>
                    {expense.title}
                  </div>
                  <div className={styles.recentExpenseInfo}>
                    {expense.date} • {expense.category || 'General'}
                  </div>
                </div>
                <div className={styles.recentExpenseAmount}>
                  ${parseFloat(expense.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate('/expenses')}
            className={styles.viewAllButton}
          >
            View All Expenses →
          </button>
        </div>
      )}

      {/* Smart Insights */}
      {insights && (
        <div className={`card ${styles.insightsCard}`}>
          <h3 className={styles.sectionTitle}>
            🧠 Smart Insights
          </h3>
          <div className={styles.insightsGrid}>
            <div className={styles.insightItem}>
              <div className={styles.insightValue}>
                ${insights.avgDaily.toFixed(2)}
              </div>
              <div className={styles.insightLabel}>
                Average Daily Spending
              </div>
            </div>
            
            <div className={styles.insightItem}>
              <div className={styles.insightValue}>
                ${parseFloat(insights.highestExpense.amount).toFixed(2)}
              </div>
              <div className={styles.insightLabel}>
                Highest Single Expense
              </div>
              <div className={styles.insightSubtext}>
                ({insights.highestExpense.title})
              </div>
            </div>

            <div className={styles.insightItem}>
              <div className={styles.insightValue}>
                {insights.mostFrequentCategory}
              </div>
              <div className={styles.insightLabel}>
                Top Category
              </div>
            </div>

            {insights.comparison !== null && (
              <div className={styles.insightItem}>
                <div className={`${styles.insightValue} ${insights.comparison > 0 ? styles.comparisonPositive : styles.comparisonNegative}`}>
                  {insights.comparison > 0 ? '+' : ''}{insights.comparison.toFixed(1)}%
                </div>
                <div className={styles.insightLabel}>
                  vs Last Month
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chart */}
      {currentMonthExpenses.length > 0 ? (
        <div className="card">
          <Bar data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className={`card ${styles.emptyChart}`}>
          <p>📊 No expenses this month to show in chart.</p>
          <p>Add some expenses to see your spending visualization!</p>
        </div>
      )}

      {/* Quick Tips */}
      <div className={`card ${styles.tipsCard}`}>
        <h3 className={styles.tipsTitle}>
          💡 Financial Tip
        </h3>
        <p className={styles.tipsText}>
          {expenses.length === 0 
            ? "Start tracking your expenses today! Even small purchases add up over time. Awareness is the first step to better financial health. 🌱"
            : currentMonthTotal > 0 
              ? `Great job tracking your expenses! Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings. You're spending $${insights?.avgDaily.toFixed(2)} daily this month. 💪`
              : "Consistency is key! Try to log expenses as soon as you make them. This builds a healthy habit and gives you real-time awareness of your spending. 🎯"
          }
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className={styles.navigationButtons}>
        <button onClick={() => navigate('/add')} className="btn-primary">
          ➕ Add New Expense
        </button>
        
        <button onClick={() => navigate('/expenses')} className="btn-secondary">
          📊 View All Expenses
        </button>
      </div>
      
    </div>
  );
}

export default HomePage; 