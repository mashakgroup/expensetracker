document.addEventListener('DOMContentLoaded', function() {
    const transactionList = document.getElementById('transactionList');
    const transactionForm = document.getElementById('transactionForm');
    const textInput = document.getElementById('text');
    const amountInput = document.getElementById('amount');
    const totalIncome = document.getElementById('totalIncome');
    const totalExpenses = document.getElementById('totalExpenses');
    const balance = document.getElementById('balance');

    let transactions = [];

    // Add transaction
    transactionForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const text = textInput.value.trim();
        const amount = +amountInput.value;

        if (text === '' || isNaN(amount) || amount === 0) {
            alert('Please enter a valid description and amount.');
            return;
        }

        const transaction = {
            id: generateID(),
            text,
            amount
        };

        transactions.push(transaction);

        updateLocalStorage();
        updateTransactions();
        updateSummary();

        textInput.value = '';
        amountInput.value = '';
    });

    // Generate random ID
    function generateID() {
        return Math.floor(Math.random() * 100000000);
    }

    // Update transactions in DOM
    function updateTransactions() {
        transactionList.innerHTML = '';

        transactions.forEach(transaction => {
            const sign = transaction.amount < 0 ? '-' : '+';
            const transactionType = transaction.amount < 0 ? 'expense' : 'income';
            const item = document.createElement('li');

            item.classList.add(transactionType);
            item.innerHTML = `
                ${transaction.text} <span>${sign}$${Math.abs(transaction.amount)}</span>
                <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">x</button>
            `;

            transactionList.appendChild(item);
        });
    }

    // Delete transaction by ID
    function deleteTransaction(id) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        updateLocalStorage();
        updateTransactions();
        updateSummary();
    }

    // Update local storage transactions
    function updateLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    // Init app
    function init() {
        const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
        if (localStorageTransactions) {
            transactions = localStorageTransactions;
        }

        updateTransactions();
        updateSummary();
    }

    // Update summary
    function updateSummary() {
        const income = transactions
            .filter(transaction => transaction.amount > 0)
            .reduce((acc, transaction) => acc + transaction.amount, 0)
            .toFixed(2);

        const expenses = transactions
            .filter(transaction => transaction.amount < 0)
            .reduce((acc, transaction) => acc + transaction.amount, 0)
            .toFixed(2);

        const total = transactions
            .reduce((acc, transaction) => acc + transaction.amount, 0)
            .toFixed(2);

        totalIncome.textContent = `$${income}`;
        totalExpenses.textContent = `$${Math.abs(expenses)}`;
        balance.textContent = `$${total}`;
    }

    init();
});
