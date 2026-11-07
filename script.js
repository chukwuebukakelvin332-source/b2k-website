function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}
function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
    document.getElementById('cartOverlay').classList.toggle('open');
}

// Load cart from localStorage or start empty
let cart = JSON.parse(localStorage.getItem('b2kCart')) || [];

function updateCartBadge() {
    let totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    let badges = document.querySelectorAll('.cart-count');
    badges.forEach(badge => badge.innerText = totalItems);
}

function addToCart(name, price) {
    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.qty += 1; 
    } else {
        cart.push({ name: name, price: price, qty: 1 }); 
    }
    saveCart();
    if (!document.getElementById('cartSidebar').classList.contains('open')) {
        toggleCart();
    }
}

function updateQuantity(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

function saveCart() {
    localStorage.setItem('b2kCart', JSON.stringify(cart));
    updateCartUI();
    updateCartBadge();
}

function updateCartUI() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    if (!cartItemsDiv) return; // If not on a page with the cart sidebar

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align: center; color: #888; margin-top: 20px;">Your cart is empty.</p>';
        cartTotalPrice.innerText = 'N 0';
        return;
    }
    cartItemsDiv.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += (item.price * item.qty);
        cartItemsDiv.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>N ${item.price.toLocaleString()}</p>
                </div>
                <div style="display: flex; align-items: center;">
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                        <span class="qty-number">${item.qty}</span>
                        <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${index})" title="Remove item">&times;</button>
                </div>
            </div>
        `;
    });
    cartTotalPrice.innerText = `N ${total.toLocaleString()}`;
}

function checkoutWhatsApp() {
    if (cart.length === 0) { alert("Your cart is empty."); return; }
    let phoneNumber = "2347049913190"; 
    let message = "Hello B2K Electrical, I would like to place an order:\n\n";
    let total = 0;
    cart.forEach((item) => {
        let itemTotal = item.price * item.qty;
        message += `- ${item.name} (x${item.qty}): N${itemTotal.toLocaleString()}\n`;
        total += itemTotal;
    });
    message += `\n*Total: N${total.toLocaleString()}*\n\nPlease let me know how to proceed with payment and delivery.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
}

function submitReview(event) {
    event.preventDefault(); 
    const name = document.getElementById('revName').value;
    const product = document.getElementById('revProduct').value;
    const reviewText = document.getElementById('revText').value;
    const newReviewHTML = `
        <div class="review-card">
            <div class="review-header">
                <span class="reviewer-name">${name}</span>
                <span class="review-product">${product}</span>
            </div>
            <p class="review-text">${reviewText}</p>
        </div>
    `;
    document.getElementById('reviewList').insertAdjacentHTML('afterbegin', newReviewHTML);
    document.getElementById('reviewForm').reset();
    alert("Thank you. Your review has been added.");
}

// Initialize Cart on Page Load
document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    updateCartUI();
});