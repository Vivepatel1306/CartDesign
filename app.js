document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const productCards = document.querySelectorAll('.product-card');
    const selectedProductsContainer = document.querySelector('.selected-products');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const discountAmount = document.querySelector('.discount-amount');
    const subtotalElement = document.querySelector('.subtotal');
    const addToCartBtn = document.querySelector('.add-to-cart');
    
    // Bundle state
    const bundle = {
        items: [],
        itemPrice: 150.00,
        discountThreshold: 3,
        discountRate: 0.3
    };
    
    // Initialize the bundle
    function initBundle() {
        bundle.items = [];
        updateBundleUI();
    }
    
    // Add product to bundle or increase quantity
    function addToBundle(productId, productName, productImage) {
        // Check if product is already in bundle
        const existingItemIndex = bundle.items.findIndex(item => item.id === productId);
        
        if (existingItemIndex >= 0) {
            // Increase quantity if already in bundle
            bundle.items[existingItemIndex].quantity += 1;
        } else {
            // Add new item to bundle
            bundle.items.push({
                id: productId,
                name: productName,
                image: productImage,
                quantity: 1
            });
        }
        
        updateBundleUI();
    }
    
    // Update quantity of an item in the bundle
    function updateQuantity(productId, newQuantity) {
        const itemIndex = bundle.items.findIndex(item => item.id === productId);
        
        if (itemIndex >= 0) {
            if (newQuantity <= 0) {
                // Remove item if quantity is 0 or less
                bundle.items.splice(itemIndex, 1);
            } else {
                // Update quantity
                bundle.items[itemIndex].quantity = newQuantity;
            }
            
            updateBundleUI();
        }
    }
    
    // Calculate total quantity of items in bundle
    function getTotalQuantity() {
        return bundle.items.reduce((total, item) => total + item.quantity, 0);
    }
    
    // Update the bundle UI
    function updateBundleUI() {
        const totalQuantity = getTotalQuantity();
        
        // Update progress bar
        const progressPercentage = (totalQuantity / bundle.discountThreshold) * 100;
        progressFill.style.width = `${Math.min(progressPercentage, 100)}%`;
        progressText.textContent = `${totalQuantity}/${bundle.discountThreshold} added`;
        
        // Update selected products list
        selectedProductsContainer.innerHTML = '';
        bundle.items.forEach(item => {
            const productElement = document.createElement('div');
            productElement.className = 'selected-item';
            productElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="selected-item-info">
                    <h4>${item.name}</h4>
                    <p>$${bundle.itemPrice.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="quantity-decrease" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-increase" data-id="${item.id}">+</button>
                    </div>
                </div>
            `;
            selectedProductsContainer.appendChild(productElement);
        });
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-decrease').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                const item = bundle.items.find(item => item.id === productId);
                if (item) {
                    updateQuantity(productId, item.quantity - 1);
                }
            });
        });
        
        document.querySelectorAll('.quantity-increase').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                const item = bundle.items.find(item => item.id === productId);
                if (item) {
                    updateQuantity(productId, item.quantity + 1);
                }
            });
        });
        
        // Calculate totals
        const subtotal = bundle.items.reduce((sum, item) => sum + (item.quantity * bundle.itemPrice), 0);
        let discount = 0;
        
        if (totalQuantity >= bundle.discountThreshold) {
            discount = subtotal * bundle.discountRate;
        }
        
        const total = subtotal - discount;
        
        // Update discount and total display
        discountAmount.textContent = `Discount: $${discount.toFixed(2)} (${bundle.discountRate * 100}%)`;
        subtotalElement.textContent = `Subtotal: $${total.toFixed(2)}`;
        
        // Update add to cart button state
        addToCartBtn.disabled = totalQuantity < bundle.discountThreshold;
        
        // Update product card buttons
        updateProductCardButtons();
    }
    
    // Update the state of product card buttons
    function updateProductCardButtons() {
        productCards.forEach(card => {
            const productId = card.getAttribute('data-id');
            const button = card.querySelector('.add-to-bundle');
            const isInBundle = bundle.items.some(item => item.id === productId);
            
            if (isInBundle) {
                button.textContent = 'Added ✓';
                button.classList.add('added');
            } else {
                button.textContent = 'Add to Bundle';
                button.classList.remove('added');
            }
        });
    }
    
    // Handle add to bundle button clicks
    productCards.forEach(card => {
        const button = card.querySelector('.add-to-bundle');
        const productId = card.getAttribute('data-id');
        const productName = card.querySelector('h3').textContent;
        const productImage = card.querySelector('img').src;
        
        button.addEventListener('click', () => {
            addToBundle(productId, productName, productImage);
        });
    });
    
 // Update the add to cart button click handler
addToCartBtn.addEventListener('click', () => {
    const totalQuantity = getTotalQuantity();
    if (totalQuantity >= bundle.discountThreshold) {
        const subtotal = bundle.items.reduce((sum, item) => sum + (item.quantity * bundle.itemPrice), 0);
        const discount = subtotal * bundle.discountRate;
        const total = subtotal - discount;
        
        // Change button state
        addToCartBtn.classList.add('added');
        addToCartBtn.disabled = true;
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = `Bundle added to cart! Total: $${total.toFixed(2)}`;
        document.body.appendChild(successMsg);
        
        // Remove message after animation
        setTimeout(() => {
            successMsg.remove();
        }, 2300);
        
        // Reset button after delay (optional)
        setTimeout(() => {
            addToCartBtn.classList.remove('added');
            addToCartBtn.disabled = false;
        }, 3000);
    }
});
    
    // Initialize the bundle
    initBundle();
});