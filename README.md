<<<<<<< HEAD
# 💰Finance Dashboard UI

A modern, interactive, and fully responsive **Finance Dashboard UI** built to demonstrate strong frontend development skills, UI/UX design thinking, and efficient state management.

This project focuses on delivering a clean, intuitive user experience while maintaining a scalable and well-structured codebase.

---

## 🚀 Features

### 📊 Dashboard Overview

* Displays key financial metrics:

  * Total Balance
  * Total Income
  * Total Expenses
* Interactive visualizations:

  * Area Chart for balance trends over time
  * Pie Chart for spending distribution by category

---

### 💳 Transactions Management

* View a structured list of transactions with:

  * Date
  * Amount
  * Category
  * Type (Income / Expense)
* Functionalities:

  * 🔍 Real-time search
  * 🎯 Filter by category/type
  * ↕️ Sorting (date & amount)
* Clean UI states including hover effects and empty states

---

### 🔐 Role-Based Access Control (RBAC - Simulated)

* Switch roles using a topbar toggle:

  * **Viewer** → Read-only access
  * **Admin** → Full access:

    * Add transactions
    * Edit transactions
    * Delete transactions
* UI dynamically updates based on selected role

---

### 📈 Financial Insights

* Automatically generated insights:

  * Highest spending category
  * Monthly spending comparison
  * Largest single expense
* Simple, human-readable insights for better understanding

---

### 🎨 UI / UX & Responsiveness

* Fully responsive across:

  * Mobile
  * Tablet
  * Desktop
* Off-canvas sidebar for smaller screens
* Clean, minimal fintech-inspired design
* Light & Dark mode toggle using CSS variables
* Smooth transitions and subtle animations

---

### 🧠 State Management & Persistence

* Global state managed using **React Context API**
* Handles:

  * Transactions
  * Filters
  * User role
  * Theme
* Data persistence using **localStorage**

  * Retains user data and preferences across sessions

---

## 🛠️ Tech Stack

* **Framework:** React (Vite)
* **Styling:** Vanilla CSS (Flexbox, Grid, CSS Variables)
* **Charts:** Recharts
* **Icons:** Lucide React
* **State Management:** Context API
* **Persistence:** localStorage

---

## ⚙️ Setup Instructions

1. Clone the repository:

   ```bash
   git clone <your-repo-link>
   cd findash
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open in browser:

   ```
[http://localhost:5173]
---

## 🧩 Approach & Design Decisions

### 🎯 Why Vanilla CSS?

This project uses Vanilla CSS to demonstrate strong fundamentals:

* Flexbox & Grid for layout
* CSS Variables for theming
* Media queries for responsiveness

This approach ensures:

* Lightweight performance
* Full styling control
* No dependency on heavy UI frameworks

---

### 🧠 State Architecture

* Used **React Context API** for simplicity and scalability
* Avoided Redux to reduce unnecessary complexity
* Integrated localStorage directly into Context for:

  * Instant state hydration
  * Persistent user experience

---

### 📊 Mock Data Strategy

* Preloaded realistic transaction data
* Ensures:

  * Meaningful chart visualizations
  * Immediate usability
  * Better demonstration of insights

---

## ✨ Highlights

* Clean and modern fintech UI
* Smooth user interactions
* Real-world feature simulation (RBAC)
* Thoughtful UX decisions
* Scalable and maintainable structure

---

## 📌 Future Improvements

* Backend integration (Node.js / Firebase)
* Authentication system
* Advanced analytics & filtering
* Export reports (CSV / PDF)
* API-based dynamic data

---


## 🌐 Live Demo

*https://zorvyn-varun-fintech.netlify.app/*

---

## 📄 License

This project is built for Zorvyn.

---

### 🙌 Final Note

This project is not about complexity, but about **clarity, usability, and thoughtful frontend engineering**.

Enjoy exploring FinDash 🚀
=======
# 💎 FinSight Hub – Premium Finance Dashboard

**Live Demo:** [https://finsight-hub.netlify.app](https://finsight-hub.netlify.app)

FinSight is a sophisticated, high-end finance management application designed for seamless tracking, categorization, and analysis of personal or business transactions. Built with a focus on modern UX/UI principles, it offers a "Premium Midnight & Frost" aesthetic that feels bespoke and professional.

---

## 🚀 Key Features

### 1. **Intelligent Dashboard**
- **Dynamic Visualizations:** Responsive charts tracking your balance trend and spending breakdown by category.
- **Real-time Stat Cards:** Instant visibility of Total Income, Total Expenses, and Net Savings.
- **Spending Goal Tracker:** Interactive circular progress indicator for your current monthly budget or financial goals.

### 2. **Advanced Transaction Management**
- **Dual-Layout Feed:** Smooth transition between a clean desktop table and an icon-driven mobile card list.
- **Smart Filters:** Powerful filtering by Type (Income/Expense), Category, and Date range, optimized for all screen sizes.
- **Admin Control:** Toggable Admin vs. Viewer roles. Admins have full CRUD (Create, Read, Update, Delete) capability with a dedicated Floating Action Button (FAB) on mobile.

### 3. **Manual Sync & Export (No Server Required)**
- **Cloud Sync (Manual):** Cross-device synchronization via JSON Import/Export. Move your data between your PC and phone with one click.
- **Format Options:** Export your transaction history in high-quality CSV (Spreadsheet) or JSON formats.
- **Persistent Storage:** All data is saved securely in your browser's local storage, ensuring your dashboard is yours alone.

### 4. **Professional UI/UX**
- **Responsive Navigation:** Sophisticated Sidebar for mobile/tablet with an integrated Role Switcher (Viewer/Admin) that intelligently hides on desktop to avoid redundancy.
- **Premium Aesthetics:** Vibrant gradients, glassmorphism effects, smooth Framer Motion animations, and curated typography (Inter).
- **Privacy Mode:** One-click "Eye" toggle to blur sensitive financial figures for use in public.
- **Dynamic Theming:** Seamless "Light" and "Dark" mode switching for day or night use.

### 5. **Ask FinSight AI**
- **Intelligent Assistant:** A built-in chatbot with a dedicated floating icon. 
- **Contextual Help:** Ask questions about your spending trends or get help navigating the features.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite
- **Styling:** Vanilla CSS3 (Custom Design System), Framer Motion (Animations)
- **Icons:** Lucide React
- **Hosting:** Netlify (Automated CI/CD)

---

## 📦 Getting Started

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Varun5632005/finsight-hub.git
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
4.  **Build for Production:**
    ```bash
    npm run build
    ```

---

*Designed and Built for Modern Financial Freedom.*
>>>>>>> 8ed4c34 (Final Polish: Responsive Filters, Mobile FAB, Sidebar Auth Switcher, and Updated README)
