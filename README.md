# FinDash - Finance Dashboard UI

A clean, interactive, and fully responsive finance dashboard interface built to evaluate frontend development, UI/UX design, and state management skills.

## Features

- **Dashboard Overview**: Quickly view your Total Balance, Income, and Expenses. Visualizes data with an interactive Area Chart for balance trends and a Pie Chart for spending breakdown (powered by Recharts).
- **Transactions Management**: View a comprehensive list of transactions. Includes search, category/type filtering, and sorting (by date and amount).
- **Role-Based Access Control (RBAC)**: Switch between `Viewer` and `Admin` modes using the Topbar toggle. Admins can add, edit, and delete transactions. Viewers are restricted to read-only access.
- **Financial Insights**: Automatically generated smart insights, showing your highest spending category, monthly comparisons, and your largest single expense.
- **Theming & Responsiveness**: Fully responsive layout that adapts to mobile devices with an off-canvas sidebar. Features a sleek Light & Dark mode toggle built with CSS variables.
- **State Management**: Uses React's Context API to manage global state and persists data locally using `localStorage`, ensuring data and theme choices survive page reloads.

## Tech Stack

- **Framework**: React (Bootstrapped with Vite)
- **Styling**: Vanilla CSS with CSS Variables for extreme flexibility and zero reliance on heavy utility libraries.
- **Charts**: Recharts
- **Icons**: Lucide-React
- **State/Persistence**: React Context API & `localStorage`

## Setup Instructions

1. **Clone or download the repository**.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
4. **View the app**: Open `http://localhost:5173` in your browser.

## Approach & Design Decisions

- **Why Vanilla CSS?** To demonstrate mastery over fundamental styling concepts (Grid/Flexbox, Custom Properties, Media Queries) while maintaining a lightweight footprint. The aesthetic focuses on modern minimal design with a glassmorphic feel and subtle shadows.
- **State Architecture**: Opted for Context API over Redux. Given the scope of this dashboard, Context is perfectly suited to pass down `transactions`, `role`, and `theme` state without introducing unnecessary boilerplate. LocalStorage was wired right into the Context provider to ensure instant hydration.
- **Mock Data Generation**: Transactions are pre-populated with realistic varied mock data so the dashboard immediately looks "lived-in," ensuring all charts and insights have meaningful visual outputs instantly.

Enjoy testing the dashboard!
