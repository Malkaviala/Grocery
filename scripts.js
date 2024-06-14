document.addEventListener('DOMContentLoaded', function() {
    const budgetForm = document.getElementById('budgetForm');
    const budgetInput = document.getElementById('budget');
    const taxRateInput = document.getElementById('taxRate');
    const productNameInput = document.getElementById('productName');
    const pricePerUnitInput = document.getElementById('pricePerUnit');
    const quantityInput = document.getElementById('quantity');
    const totalCostBeforeTaxSpan = document.getElementById('totalCostBeforeTax');
    const totalCostAfterTaxSpan = document.getElementById('totalCostAfterTax');
    const remainingBudgetSpan = document.getElementById('remainingBudget');
    const productTableBody = document.getElementById('productTableBody');
    const resetButton = document.getElementById('resetButton');

    let budget = 0;
    let taxRate = 0.025; // Default tax rate as decimal (2.5%)
    let products = [];

    // Function to update budget details
    function updateBudgetDetails() {
        // Calculate total cost before tax
        const pricePerUnit = parseFloat(pricePerUnitInput.value) || 0;
        const quantity = parseInt(quantityInput.value) || 0;
        const totalCostBeforeTax = pricePerUnit * quantity;

        // Calculate total cost after tax
        const totalCostAfterTax = totalCostBeforeTax * (1 + taxRate);

        // Update remaining budget
        budget -= totalCostAfterTax;

        // Update UI with calculated values and currency format
        totalCostBeforeTaxSpan.textContent = '$' + totalCostBeforeTax.toFixed(2);
        totalCostAfterTaxSpan.textContent = '$' + totalCostAfterTax.toFixed(2);
        remainingBudgetSpan.textContent = '$' + budget.toFixed(2);

        // Disable submit button if budget is exceeded
        const addButton = document.querySelector('button[type="submit"]');
        addButton.disabled = budget < 0;

        // Add product to products array
        products.push({
            id: generateUniqueId(), // Generate a unique ID for each product
            productName: productNameInput.value,
            pricePerUnit: pricePerUnit.toFixed(2),
            quantity: quantity,
            totalCost: totalCostAfterTax.toFixed(2)
        });

        // Update product table
        updateProductTable();

        // Reset form inputs
        productNameInput.value = '';
        pricePerUnitInput.value = '';
        quantityInput.value = '';
    }

    // Function to update product table
    function updateProductTable() {
        // Clear previous table rows
        productTableBody.innerHTML = '';

        // Add products to table
        products.forEach(function(product) {
            const row = document.createElement('tr');
            row.setAttribute('data-id', product.id); // Set data-id attribute to identify each product
            row.innerHTML = `
                <td>${product.productName}</td>
                <td>$${product.pricePerUnit}</td>
                <td>${product.quantity}</td>
                <td>$${product.totalCost}</td>
                <td>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </td>
            `;
            productTableBody.appendChild(row);

            // Attach event listeners for edit and delete buttons
            const editButton = row.querySelector('.edit-btn');
            editButton.addEventListener('click', function() {
                editProduct(product.id);
            });

            const deleteButton = row.querySelector('.delete-btn');
            deleteButton.addEventListener('click', function() {
                deleteProduct(product.id);
            });
        });
    }

    // Function to edit a product
    function editProduct(productId) {
        // Find the product in the array
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            // Set form inputs with product details for editing
            const product = products[productIndex];
            productNameInput.value = product.productName;
            pricePerUnitInput.value = product.pricePerUnit;
            quantityInput.value = product.quantity;

            // Remove the product from the array and update UI
            products.splice(productIndex, 1);
            updateProductTable();

            // Adjust budget and totals for the removed product
            budget += parseFloat(product.totalCost);
            totalCostBeforeTaxSpan.textContent = '$0.00';
            totalCostAfterTaxSpan.textContent = '$0.00';
            remainingBudgetSpan.textContent = '$' + budget.toFixed(2);
        }
    }

    // Function to delete a product
    function deleteProduct(productId) {
        // Find the product in the array
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            // Remove the product from the array and update UI
            products.splice(productIndex, 1);
            updateProductTable();

            // If no products left, reset budget details
            if (products.length === 0) {
                budget = 0;
                totalCostBeforeTaxSpan.textContent = '$0.00';
                totalCostAfterTaxSpan.textContent = '$0.00';
                remainingBudgetSpan.textContent = '$0.00';
            } else {
                // Adjust budget and totals for the removed product
                budget += parseFloat(products[productIndex].totalCost);
                totalCostBeforeTaxSpan.textContent = '$0.00';
                totalCostAfterTaxSpan.textContent = '$0.00';
                remainingBudgetSpan.textContent = '$' + budget.toFixed(2);
            }
        }
    }

    // Event listener for budget form submission
    budgetForm.addEventListener('submit', function(event) {
        event.preventDefault();
        updateBudgetDetails();
    });

    // Event listener for reset button
    resetButton.addEventListener('click', function(event) {
        event.preventDefault();

        // Reset all variables and UI
        budget = 0;
        taxRate = 0.025;
        products = [];
        totalCostBeforeTaxSpan.textContent = '$0.00';
        totalCostAfterTaxSpan.textContent = '$0.00';
        remainingBudgetSpan.textContent = '$0.00';
        productTableBody.innerHTML = '';

        // Enable submit button
        const addButton = document.querySelector('button[type="submit"]');
        addButton.disabled = false;
    });

    // Initialize tax rate input
    taxRateInput.addEventListener('input', function() {
        taxRate = parseFloat(taxRateInput.value) / 100 || 0; // Convert percentage to decimal
    });

    // Initialize budget input
    budgetInput.addEventListener('input', function() {
        budget = parseFloat(budgetInput.value) || 0;
        remainingBudgetSpan.textContent = '$' + budget.toFixed(2);
    });

    // Function to generate unique ID for products
    function generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
});
