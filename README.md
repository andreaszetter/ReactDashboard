# **ReactDashboard**  

A dynamic and interactive React dashboard project designed to enhance UX/UI skills, leveraging modern UI frameworks like **Tailwind CSS**. The project integrates **React Router** for navigation and **Redux Toolkit** for state management, allowing users to track their finances, set savings goals, and organize expenses by category.  

## 🚀 **Features**  

- **Expense Tracking:** Log your income and expenses to monitor your financial habits.  
- **Savings Goals:** Set up savings goals for different time periods and track progress over time.  
- **Categorization:** Create and manage categories to group spending and gain better insights into your expenses.  
- **Modern UI Design:** Styled with **Tailwind CSS** for a sleek, responsive interface.  
- **State Management:** Powered by **Redux Toolkit** for efficient state handling.  
- **Navigation:** Seamless navigation with **React Router** for a smooth user experience.  

## 📂 **Installation**  

1. **Clone the Repository:**  
   ```bash  
   git clone https://github.com/Team-Umea/ReactDashboard.git  
   ```  

2. **Install Dependencies:**  
   ```bash  
   npm install  
   ```  

3. **Start the Development Server:**  
   ```bash  
   npm run dev  
   ```  

The app should now be running at `http://localhost:5173/`

## 🛠️ **Tech Stack**  

- **React** — Frontend framework  
- **Tailwind CSS** — Styling  
- **Redux Toolkit** — State management  
- **React Router** — Client-side routing  

## 📑 **Project Resources**  

- **Trello Board (Task Management):** [ReactDashboard Trello](https://trello.com/b/t6WihFUK/boilerroom-v9-11)  
- **Project requirements:** [Google Docs](https://docs.google.com/document/d/1H4eDuZfrzw68r0HXZTlOL5OC27io28WSMaKc7NazzCg/edit?tab=t.0)  

## 🎯 **Future Improvements**  

- **Charts & Analytics:** Visualize spending patterns with charts.  
- **Authentication:** Add user authentication for personalized dashboards.  
- **Export Data:** Enable CSV or PDF export of expense reports.    

## **Andreas Changes**

I added functionality to the overview page with Information about spending, a budget planner and a savings tracker. 
The information part of the overview page has some charts that visually represent your spendings in categories. It also has
a graph of how much has been spent per month. There is also a tab where you can allocate how much you want to budget for each
of the categories and how much of your total salary will be saved. 
I also changed the way that adding spendings works. Before you had to type the categories in each time, which was redundant
since we already had a page for adding categories. I just changed the input to be a choice between existing categories so that
it is easier for the user to document their spendings without having to type it each time.
Other than that I have made some small tweaks to the UI, for example an indication of which of the pages in the sidebar you 
are currently on, since before there was no such indicator which could be confusing for some users. 
