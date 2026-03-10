# 📈 Fintrack — Personal Finance & Cash Flow Analyzer

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white)

**Fintrack** is a high-utility financial management tool designed for private, robust monitoring of personal cash flow. It provides a centralized dashboard to track both income and expenses, offering deep data visualization and automated reporting without requiring a cloud account or third-party bank synchronization.

---

## 🛠️ Core Functionality

### **Dual-Stream Transaction Management**
Unlike basic spending trackers, Fintrack supports both **Income** and **Expense** entries. This allows the system to calculate your actual **Net Balance** and **Savings Rate** rather than just cumulative spending.



### **Data Persistence & Privacy**
The application is **offline-first**. It utilizes browser `localStorage` to save your financial history. Your sensitive data never leaves your device, providing a layer of privacy that cloud-based apps cannot offer.

### **Automated Financial Math**
The system instantly recalculates three primary metrics upon every entry:
* **Total Balance:** Your current net worth within the application.
* **Total Income:** Cumulative earnings from all tracked sources (formatted in ₹).
* **Total Expenses:** Cumulative spending across all categories (formatted in ₹).

---

## 📊 Analytical Features

* **Category-Wise Breakdown:** A doughnut chart identifies which sectors (Food, Transport, Utilities, etc.) are consuming the highest percentage of your capital.
* **Monthly Comparison:** A grouped bar chart stacks monthly income against monthly expenses to visualize wealth-building trends over time.



* **Logic-Based Insights:** The system runs algorithms on your raw data to highlight:
    * **Savings Rate Percentage:** A direct indicator of financial health.
    * **Expense Driver Detection:** Automatically identifies your most expensive habit.
    * **Largest Outflow Detection:** Flags your single highest transaction for review.

---

## 📑 Technical Specifications

* **Desktop-First Optimization:** The UI is constrained to a 960px max-width to ensure a professional, "app-like" feel on widescreen monitors, preventing stretched or bloated input boxes.
* **PDF Reporting Engine:** Built-in support for generating professionally formatted PDF ledgers using `jsPDF`. Useful for tax documentation, accounting reviews, or personal backups.
* **Dynamic Data Engine:**
    * **Search:** Locate specific transactions by description instantly.
    * **Filter:** Isolate specific categories to analyze targeted spending.
    * **Sort:** Organize the ledger by date (Chronological) or value (Quantitative).



---

## 🚀 Installation & Usage

1.  **Clone the Repo:**
    ```bash
    git clone [https://github.com/YOUR-USERNAME/fintrack.git](https://github.com/sk72775/fintrack.git)
    ```
2.  **Run:** Open `index.html` in any modern web browser.
3.  **Deployment:** This project is ready for **GitHub Pages**. Simply enable Pages in your repository settings to host it as a live website.

---

## 📝 Technologies Used

* **Language:** Vanilla JavaScript (ES6+)
* **Styling:** CSS3 (Custom Grid & Flexbox)
* **Charts:** Chart.js
* **Document Generation:** jsPDF & AutoTable

---
