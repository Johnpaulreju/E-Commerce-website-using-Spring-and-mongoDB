// Fetch the logged-in user's details from the backend
function fetchUserProfile() {
    fetch('/api/user-profile', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            let user = localStorage.getItem('username');
            console.log("Username:", user);
            document.getElementById('profileName').innerHTML = `Welcome, <strong>${data.username}</strong>`;
        } else {
            alert('Failed to fetch user profile');
        }
    })
    .catch(error => console.error('Error fetching profile:', error));
}



// Fetch the list of products from the backend
function fetchProducts() {
    fetch('/api/products', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(products => {
        const productList = document.getElementById('product-list');
        productList.innerHTML = ''; // Clear any existing content

        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Price: $${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-product-id="${product.productId}">Add to Cart</button>
            `;
            productList.appendChild(productItem);

            // Add event listener for Add to Cart button
            const addToCartButton = productItem.querySelector('.add-to-cart');
            let quantity = 1; // Initialize quantity to 1

            // Event listener for Add to Cart button
            addToCartButton.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                const userId = localStorage.getItem('userId'); // Get userId from local storage

                // Send the product and quantity to the backend to add to the user's cart
                fetch('/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, productId, quantity })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Product added to cart successfully!');
                        addToCartButton.classList.add('hidden'); // Hide "Add to Cart" button

                        // Create and show the quantity controls dynamically
                        const quantityControls = document.createElement('div');
                        quantityControls.className = 'quantity-controls';

                        const minusButton = document.createElement('button');
                        minusButton.className = 'quantity-minus';
                        minusButton.innerHTML = '-';

                        const quantityDisplay = document.createElement('span');
                        quantityDisplay.className = 'quantity-display';
                        quantityDisplay.textContent = quantity;

                        const plusButton = document.createElement('button');
                        plusButton.className = 'quantity-plus';
                        plusButton.innerHTML = '+';

                        quantityControls.appendChild(minusButton);
                        quantityControls.appendChild(quantityDisplay);
                        quantityControls.appendChild(plusButton);

                        // Append quantity controls to the product item
                        productItem.appendChild(quantityControls);

                        // Event listener for Minus button
                        minusButton.addEventListener('click', () => {
                            if (quantity > 1) {
                                quantity--;
                                quantityDisplay.textContent = quantity;

                                // Update the quantity in the backend
                                updateCartQuantity(productId, quantity);
                            }
                        });

                        // Event listener for Plus button
                        plusButton.addEventListener('click', () => {
                            quantity++;
                            quantityDisplay.textContent = quantity;

                            // Update the quantity in the backend
                            updateCartQuantity(productId, quantity);
                        });
                    } else {
                        alert('Failed to add product to cart.');
                    }
                })
                .catch(error => console.error('Error:', error));
            });
        });
    })
    .catch(error => console.error('Error fetching products:', error));
}

// Function to update the quantity in the backend
function updateCartQuantity(productId, quantity) {
    const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage

    console.log(userId,productId,quantity);
    fetch('/api/cart/update-quantity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            alert('Failed to update cart quantity.');
        }
    })
    .catch(error => console.error('Error updating quantity:', error));
}




// Function to fetch cart items (for the cart page)
// function fetchCartItems() {
//     const userId = localStorage.getItem('userId'); // Retrieve the userId from localStorage

//     if (!userId) {
//         alert("User not logged in. Please login first.");
//         window.location.href = '/login.html';
//         return;
//     }

//     fetch(`/api/cart?userId=${userId}`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' }
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.cartItems && data.cartItems.length > 0) {
//             const cartList = document.getElementById('cart-list');
//             cartList.innerHTML = ''; // Clear the cart items container

//             let totalPrice = 0;

//             // Loop through each cart item and display it in a card
//             data.cartItems.forEach(cartItem => {
//                 const cartItemDiv = document.createElement('div');
//                 cartItemDiv.className = 'cart-item';
//                 const itemTotalPrice = cartItem.price * cartItem.quantity;

//                 cartItemDiv.innerHTML = `
//                     <h3>${cartItem.name}</h3>
//                     <p>Price: $${cartItem.price.toFixed(2)}</p>
//                     <p>Quantity: ${cartItem.quantity}</p>
//                     <p>Item Total: $${itemTotalPrice.toFixed(2)}</p>
//                     <button class="remove-item" data-product-id="${cartItem.productId}">Remove</button>
//                 `;

//                 cartList.appendChild(cartItemDiv);

//                 // Calculate the total price
//                 totalPrice += itemTotalPrice;

//                 // Attach event listener for "Remove" button
//                 const removeButton = cartItemDiv.querySelector('.remove-item');
//                 removeButton.addEventListener('click', function() {
//                     const productId = this.getAttribute('data-product-id');
//                     removeCartItem(userId, productId, cartItemDiv);
//                 });
//             });

//             // Display the total price in the cart
//             const totalDiv = document.getElementById('cart-total');
//             totalDiv.textContent = `Total: $${totalPrice.toFixed(2)}`;
//         } else {
//             // If the cart is empty, display a message
//             document.getElementById('cart-list').innerHTML = '<p>Your cart is empty.</p>';
//             document.getElementById('cart-total').textContent = '';
//         }
//     })
//     .catch(error => console.error('Error fetching cart items:', error));
// }
function fetchCartItems() {
    const userId = localStorage.getItem('userId'); // Retrieve the userId from localStorage

    if (!userId) {
        alert("User not logged in. Please login first.");
        window.location.href = '/login.html';
        return;
    }

    fetch(`/api/cart?userId=${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.cartItems && data.cartItems.length > 0) {
            const cartList = document.getElementById('cart-list');
            cartList.innerHTML = ''; // Clear the cart items container
            let totalPrice = 0;
            const cartItems = [];

            // Loop through each cart item and display it
            data.cartItems.forEach(cartItem => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.className = 'cart-item';
                const itemTotalPrice = cartItem.price * cartItem.quantity;

                cartItemDiv.innerHTML = `
                    <h3>${cartItem.name}</h3>
                    <p>Price: $${cartItem.price.toFixed(2)}</p>
                    <p>Quantity: ${cartItem.quantity}</p>
                    <p>Item Total: $${itemTotalPrice.toFixed(2)}</p>
                    <button class="remove-item" data-product-id="${cartItem.productId}">Remove</button>

                `;

                cartList.appendChild(cartItemDiv);

                // Store the item in localStorage
                cartItems.push(cartItem);

                // Calculate the total price
                totalPrice += itemTotalPrice;
                const removeButton = cartItemDiv.querySelector('.remove-item');
                removeButton.addEventListener('click', function() {
                    const productId = this.getAttribute('data-product-id');
                    removeCartItem(userId, productId, cartItemDiv);
                });
            });

            // Store cart items in localStorage for later use during checkout
            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            // Display the total price in the cart
            const totalDiv = document.getElementById('cart-total');
            totalDiv.textContent = `Total: $${totalPrice.toFixed(2)}`;
        } else {
            // If cart is empty, display a message
            document.getElementById('cart-list').innerHTML = '<p>Your cart is empty.</p>';
            document.getElementById('cart-total').textContent = '';
        }
    })
    .catch(error => console.error('Error fetching cart items:', error));
}

// function handleCheckout() {
//     const userId = localStorage.getItem('userId');
//     console.log("Userid",userId);
//     if (!userId) {
//         alert("User not logged in. Please login first.");
//         window.location.href = '/login.html';
//         return;
//     }

//     // Send a POST request to checkout
//     fetch('/api/cart/checkout', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId }) // Send userId
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             alert('Checkout successful!');
//             // Redirect to checkout confirmation page
//             window.location.href = '/checkout.html';
//         } else {
//             alert('Checkout failed: ' + data.message);
//         }
//     })
//     .catch(error => console.error('Error during checkout:', error));
// }


// Function to remove a cart item

function handleCheckout() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert("User not logged in. Please login first.");
        window.location.href = '/login.html';
        return;
    }

    // Fetch cart items and store them in localStorage before checkout
    fetch(`/api/cart?userId=${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.cartItems && data.cartItems.length > 0) {
            // Store cart items in localStorage for displaying on checkout page
            localStorage.setItem('checkoutItems', JSON.stringify(data.cartItems));
            localStorage.setItem('totalPrice', data.totalPrice); // Store total price

            // Now proceed to checkout
            fetch('/api/cart/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Checkout successful!');
                    window.location.href = '/checkout.html'; // Redirect to checkout page
                } else {
                    alert('Checkout failed: ' + data.message);
                }
            })
            .catch(error => console.error('Error during checkout:', error));
        } else {
            alert('Your cart is empty. Please add items before checkout.');
        }
    })
    .catch(error => console.error('Error fetching cart items:', error));
}



function removeCartItem(userId, productId, cartItemDiv) {
    fetch(`/api/cart/remove-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Item removed from cart');
            cartItemDiv.remove(); // Remove the item from the UI
            fetchCartItems(); // Recalculate total price
        } else {
            alert('Failed to remove item from cart');
        }
    })
    .catch(error => console.error('Error removing item:', error));
}



function fetchPurchasedItems() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        alert("User not logged in. Please login first.");
        window.location.href = '/login.html';
        return;
    }

    fetch(`/api/purchased-items?userId=${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No purchased items found');
        }
        return response.json();
    })
    .then(data => {
        if (data.purchasedItems && data.purchasedItems.length > 0) {
            const checkoutItemsContainer = document.getElementById('checkout-items');
            checkoutItemsContainer.innerHTML = ''; // Clear any existing content

            let totalAmount = 0;

            // Loop through each purchased item and display it in a card
            data.purchasedItems.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item';
                const itemTotal = item.price * item.quantity;

                itemDiv.innerHTML = `
                    <h4>${item.name}</h4>
                    <p>Price: $${item.price.toFixed(2)}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Total: $${itemTotal.toFixed(2)}</p>
                `;

                checkoutItemsContainer.appendChild(itemDiv);

                // Calculate the total amount
                totalAmount += itemTotal;
            });

            // Show the total amount
            const totalDiv = document.createElement('div');
            totalDiv.className = 'item';
            totalDiv.innerHTML = `<h3>Total Amount: $${totalAmount.toFixed(2)}</h3>`;
            checkoutItemsContainer.appendChild(totalDiv);
        } else {
            // If no purchased items, display a message
            document.getElementById('checkout-items').innerHTML = '<p>No items to display.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching purchased items:', error);
        document.getElementById('checkout-items').innerHTML = '<p>No items to display.</p>';
    });
}



document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');

    const currentPage = window.location.pathname;
    console.log('Current page:', currentPage);
    // If the user is on the cart page, fetch the cart items
    if (currentPage === '/cart.html') {
        fetchCartItems();
    } else {
        // If on another page (e.g., product page), fetch products
        fetchProducts();
    }

    // Fetch the user profile and update the name in the header
    const loggedInUserName = localStorage.getItem('username');
    if (loggedInUserName) {
        document.getElementById('profileName').innerHTML = `Welcome, <strong>${loggedInUserName}</strong>`;
    } else {
        window.location.href = '/login.html'; // Redirect to login if user is not logged in
    }


    
    

    // Handle login form submission
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("button clicked");
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Send login request to the backend
            fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('userId', data.userid);
                    localStorage.setItem('username', data.username);
                    window.location.href = '/dashboard.html'; // Redirect to dashboard
                } else {
                    alert('Login failed. Please check your credentials.');
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // Handle register form submission
    if (document.getElementById('registerForm')) {
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Send register request to the backend via POST
            fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('User added successfully!');
                    window.location.href = '/login.html'; // Redirect to login page
                } else {
                    alert('Registration failed. Please try again.');
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }
});



document.getElementById('checkout-button').addEventListener('click', function() {
    // const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    // localStorage.setItem('checkoutItems', JSON.stringify(cartItems));
    // window.location.href = '/checkout.html';
    handleCheckout();
});
