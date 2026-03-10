// Data State
let transactions = JSON.parse(localStorage.getItem('fintrack_data')) || [];

// DOM Elements
const navBtns = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view');
const expenseForm = document.getElementById('expenseForm');
const transactionsBody = document.getElementById('transactionsBody');
const totalBalance = document.getElementById('totalBalance');
const totalIncome = document.getElementById('totalIncome');
const totalExpenses = document.getElementById('totalExpenses');

// Filter & Sort
const searchInput = document.getElementById('searchInput');
const filterCategory = document.getElementById('filterCategory');
const sortSelect = document.getElementById('sortSelect');
const exportPdfBtn = document.getElementById('exportPdfBtn');

// Charts
let categoryChartInstance = null;
let monthlyChartInstance = null;

function init() {
    updateDashboard();
    renderTransactions();
    setupEventListeners();
}

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const target = btn.getAttribute('data-target');
        views.forEach(view => view.classList.remove('active-view'));
        document.getElementById(target).classList.add('active-view');

        if(target === 'analytics') {
            renderCharts();
            generateInsights();
        }
    });
});

function setupEventListeners() {
    expenseForm.addEventListener('submit', addTransaction);
    searchInput.addEventListener('input', renderTransactions);
    filterCategory.addEventListener('change', renderTransactions);
    sortSelect.addEventListener('change', renderTransactions);
    exportPdfBtn.addEventListener('click', generatePDF);
}

function addTransaction(e) {
    e.preventDefault();
    const type = document.getElementById('typeInput').value;
    const desc = document.getElementById('descInput').value;
    const amount = parseFloat(document.getElementById('amountInput').value);
    const date = document.getElementById('dateInput').value;
    const category = document.getElementById('categoryInput').value;

    const transaction = { id: Date.now(), type, desc, amount, date, category };
    transactions.push(transaction);
    saveData();
    expenseForm.reset();
    
    // Default back to expense
    document.getElementById('typeInput').value = 'expense';
    
    updateDashboard();
    renderTransactions();
}

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveData();
    updateDashboard();
    renderTransactions();
    
    if(document.getElementById('analytics').classList.contains('active-view')){
        renderCharts();
        generateInsights();
    }
}

function saveData() {
    localStorage.setItem('fintrack_data', JSON.stringify(transactions));
}

function updateDashboard() {
    const inc = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const exp = transactions.filter(t => t.type !== 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const bal = inc - exp;

    totalIncome.innerText = `+₹${inc.toFixed(2)}`;
    totalExpenses.innerText = `-₹${exp.toFixed(2)}`;
    totalBalance.innerText = `₹${bal.toFixed(2)}`; 
}

function renderTransactions() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterCat = filterCategory.value;
    const sortVal = sortSelect.value;

    let filtered = transactions.filter(t => {
        const matchesSearch = t.desc.toLowerCase().includes(searchTerm);
        const matchesCat = filterCat === 'All' || t.category === filterCat;
        return matchesSearch && matchesCat;
    });

    filtered.sort((a, b) => {
        if (sortVal === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sortVal === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sortVal === 'amount-desc') return b.amount - a.amount;
        if (sortVal === 'amount-asc') return a.amount - b.amount;
    });

    transactionsBody.innerHTML = '';
    filtered.forEach(t => {
        const row = document.createElement('tr');
        const isIncome = t.type === 'income';
        const amountClass = isIncome ? 'text-income' : 'text-expense';
        // Updated to Rupee Symbol
        const displayAmount = isIncome ? `+₹${t.amount.toFixed(2)}` : `-₹${t.amount.toFixed(2)}`;

        row.innerHTML = `
            <td>${t.date}</td>
            <td>${t.desc}</td>
            <td>${t.category}</td>
            <td class="${amountClass}">${displayAmount}</td>
            <td>
                <button class="delete-btn" onclick="deleteTransaction(${t.id})">Delete</button>
            </td>
        `;
        transactionsBody.appendChild(row);
    });
}

function renderCharts() {
    Chart.defaults.color = 'rgba(255, 255, 255, 0.7)';

    // 1. Pie Chart
    const expensesOnly = transactions.filter(t => t.type !== 'income');
    const categoryData = {};
    expensesOnly.forEach(exp => {
        categoryData[exp.category] = (categoryData[exp.category] || 0) + exp.amount;
    });

    if(categoryChartInstance) categoryChartInstance.destroy();
    const ctxCat = document.getElementById('categoryChart').getContext('2d');
    categoryChartInstance = new Chart(ctxCat, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData),
                backgroundColor: ['#ff6b6b', '#feca57', '#ff9f43', '#ee5253', '#1dd1a1', '#fff'],
                borderWidth: 0
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // 2. Bar Chart
    const monthlyData = {};
    transactions.forEach(t => {
        const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        if(!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
        
        if(t.type === 'income') {
            monthlyData[month].income += t.amount;
        } else {
            monthlyData[month].expense += t.amount;
        }
    });

    const labels = Object.keys(monthlyData);
    const incData = labels.map(m => monthlyData[m].income);
    const expData = labels.map(m => monthlyData[m].expense);

    if(monthlyChartInstance) monthlyChartInstance.destroy();
    const ctxMonth = document.getElementById('monthlyChart').getContext('2d');
    monthlyChartInstance = new Chart(ctxMonth, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Income (₹)', // Updated to Rupee Symbol
                    data: incData,
                    backgroundColor: 'rgba(56, 239, 125, 0.8)',
                    borderRadius: 4
                },
                {
                    label: 'Expense (₹)', // Updated to Rupee Symbol
                    data: expData,
                    backgroundColor: 'rgba(255, 8, 68, 0.8)',
                    borderRadius: 4
                }
            ]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            scales: {
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                x: { grid: { display: false } }
            }
        }
    });
}

function generateInsights() {
    const insightsFeed = document.getElementById('insightsFeed');
    insightsFeed.innerHTML = ''; 

    if (transactions.length === 0) {
        insightsFeed.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6);">Add some transactions to generate insights!</p>';
        return;
    }

    const insights = [];
    const inc = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const exp = transactions.filter(t => t.type !== 'income').reduce((acc, curr) => acc + curr.amount, 0);

    // 1. Savings Rate
    if (inc > 0) {
        const saved = inc - exp;
        const rate = ((saved / inc) * 100).toFixed(1);
        if (saved > 0) {
            insights.push(`Great job! You have saved <strong>₹${saved.toFixed(2)}</strong> so far, which is a savings rate of <strong>${rate}%</strong>.`);
        } else {
            insights.push(`You are currently spending <strong>₹${Math.abs(saved).toFixed(2)}</strong> more than you are making.`);
        }
    }

    // 2. Top Spending Category
    const expensesOnly = transactions.filter(t => t.type !== 'income');
    if (expensesOnly.length > 0) {
        const categoryTotals = {};
        expensesOnly.forEach(e => categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount);
        const topCategory = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b);
        insights.push(`Your highest spending category is <strong>${topCategory}</strong> at <strong>₹${categoryTotals[topCategory].toFixed(2)}</strong>.`);
        
        // 3. Largest Expense
        const largest = expensesOnly.reduce((max, e) => e.amount > max.amount ? e : max, expensesOnly[0]);
        insights.push(`Your largest single expense was <strong>₹${largest.amount.toFixed(2)}</strong> for "${largest.desc}".`);
    }

    insights.forEach((text, index) => {
        const card = document.createElement('div');
        card.className = 'insight-card glass';
        card.innerHTML = `<h4>Insight #${index + 1}</h4><p>${text}</p>`;
        insightsFeed.appendChild(card);
    });
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Financial Report", 14, 20);
    
    // Using Rs. here because the default PDF font doesn't render the ₹ symbol correctly!
    const tableColumn = ["Date", "Type", "Description", "Category", "Amount (Rs.)"];
    const tableRows = [];

    transactions.forEach(t => {
        tableRows.push([t.date, t.type.toUpperCase(), t.desc, t.category, t.amount.toFixed(2)]);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: 'grid',
        headStyles: { fillColor: [118, 75, 162] } 
    });

    const dateStr = new Date().toISOString().split('T')[0];
    doc.save(`Financial_Report_${dateStr}.pdf`);
}

init();