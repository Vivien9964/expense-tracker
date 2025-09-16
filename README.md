
# Personal Expense Tracker


## Getting started:

1. Clone the repository: 

git clone https://github.com/Vivien9964/FinanceTracker.git
```

2. Navigate to the project directory:

```bash
cd FinanceTracker
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Technologies: 

- React (Create React App)
- JavaScript (ES6+)
- React Router DOM
- React Context API
- Chart.js & react-chartjs-2
- CSS Modules

---

## Project Overview

This application was built to manage and visualize personal finances on a basic level.
In this project users can add their expenses, edit them, search for them by category, amount, title and date. Each expense can be edited and deleted.
Spendings for current month are shown in the Home page, where users can see how much they spent on each category.

Important to note, that this project was built for learning purposes, using AI guidence when I got stuck, to practice advanced React concepts.

Some design inspiration (color palette, font styles) and occasional coding guidance came from AI suggestions.

---

## Concepts practiced: 

- State management with useState and Context API
- Controlled inputs and form handling
- Data manipulation with: filter(), reduce(), slice(), sort()
- Working with Date object
- Conditional rendering
- Navigation between pages
- Integrating Chart.js for data visualization
- Css modules for styling 

---

## Features:

 * Navigation between multiple pages
 * View: 
    - recent expenses, total expenses for the current month
    - Visual representation of spendings by category (Chart.js)

 * Add expenses:
    - Controlled inputs
    - Assign a category
    - Add date automatically

 * Edit and delete expenses

 * Filtering:
    - By date
    - By amount
    - By category
    - Search by title

 * Data manipulation: filter(), reduce(), slice(), sort()

---

## Future plans: 

- Add authentication so each user can have their own expense data.
- Store expenses in a database instead of local storage.
