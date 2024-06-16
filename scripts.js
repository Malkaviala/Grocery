document.addEventListener("DOMContentLoaded", function () {
    const budgetInput = document.getElementById('budget');
    const taxRateInput = document.getElementById('taxRate');
    const productNameInput = document.getElementById('productName');
    const pricePerUnitInput = document.getElementById('pricePerUnit');
    const quantityInput = document.getElementById('quantity');
    const totalCostBeforeTaxElem = document.getElementById('totalCostBeforeTax');
    const totalCostAfterTaxElem = document.getElementById('totalCostAfterTax');
    const remainingBudgetElem = document.getElementById('remainingBudget');
    const productTableBody = document.getElementById('productTableBody');
    const resetButton = document.getElementById('resetButton');
    const budgetForm = document.getElementById('budgetForm');

    let products = [];
    let budget = 0;
    let taxRate = 0.025;

    function saveData() {
        localStorage.setItem('budget', budget.toString());
        localStorage.setItem('taxRate', taxRate.toString());
        localStorage.setItem('products', JSON.stringify(products));
    }

    function loadData() {
        const savedBudget = localStorage.getItem('budget');
        const savedTaxRate = localStorage.getItem('taxRate');
        const savedProducts = JSON.parse(localStorage.getItem('products'));

        if (savedBudget) budget = parseFloat(savedBudget);
        if (savedTaxRate) taxRate = parseFloat(savedTaxRate);
        if (savedProducts) products = savedProducts;

        budgetInput.value = budget ? budget.toFixed(2) : '';
        taxRateInput.value = (taxRate * 100).toFixed(2);
        renderProducts();
        updateSummary();
    }

    function renderProducts() {
        productTableBody.innerHTML = '';
        products.forEach((product, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${product.name}</td>
                <td>$${product.pricePerUnit.toFixed(2)}</td>
                <td>${product.quantity}</td>
                <td>$${(product.pricePerUnit * product.quantity).toFixed(2)}</td>
                <td>
                    <button class="editButton" data-index="${index}">Edit</button>
                    <button class="deleteButton" data-index="${index}">Delete</button>
                </td>
            `;

            productTableBody.appendChild(row);
        });
    }

    function updateSummary() {
        const totalCostBeforeTax = products.reduce((sum, product) => sum + product.pricePerUnit * product.quantity, 0);
        const totalCostAfterTax = totalCostBeforeTax * (1 + taxRate);
        const remainingBudget = budget - totalCostAfterTax;

        totalCostBeforeTaxElem.textContent = `$${totalCostBeforeTax.toFixed(2)}`;
        totalCostAfterTaxElem.textContent = `$${totalCostAfterTax.toFixed(2)}`;
        remainingBudgetElem.textContent = `$${remainingBudget.toFixed(2)}`;
    }

    function addProduct(event) {
        event.preventDefault();

        const name = productNameInput.value.trim();
        const pricePerUnit = parseFloat(pricePerUnitInput.value);
        const quantity = parseInt(quantityInput.value);

        if (name && pricePerUnit > 0 && quantity > 0) {
            products.push({ name, pricePerUnit, quantity });
            renderProducts();
            updateSummary();
            saveData();

            productNameInput.value = '';
            pricePerUnitInput.value = '';
            quantityInput.value = '';
        } else {
            alert('Please enter valid product details.');
        }
    }

    function editProduct(index) {
        const product = products[index];

        productNameInput.value = product.name;
        pricePerUnitInput.value = product.pricePerUnit;
        quantityInput.value = product.quantity;

        products.splice(index, 1);
        renderProducts();
        updateSummary();
        saveData();
    }

    function deleteProduct(index) {
        products.splice(index, 1);
        renderProducts();
        updateSummary();
        saveData();
    }

    function handleProductAction(event) {
        if (event.target.classList.contains('editButton')) {
            const index = event.target.getAttribute('data-index');
            editProduct(index);
        } else if (event.target.classList.contains('deleteButton')) {
            const index = event.target.getAttribute('data-index');
            deleteProduct(index);
        }
    }

    function resetData() {
        products = [];
        budget = 0;
        taxRate = 0.025;

        localStorage.clear();
        renderProducts();
        updateSummary();
        budgetForm.reset();
        taxRateInput.value = (taxRate * 100).toFixed(2);
    }

    budgetInput.addEventListener('input', function () {
        budget = parseFloat(budgetInput.value) || 0;
        saveData();
        updateSummary();
    });

    taxRateInput.addEventListener('input', function () {
        taxRate = parseFloat(taxRateInput.value) / 100 || 0.025;
        saveData();
        updateSummary();
    });

    budgetForm.addEventListener('submit', addProduct);
    resetButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission
        resetData();
    });
    productTableBody.addEventListener('click', handleProductAction);

    loadData();
});
