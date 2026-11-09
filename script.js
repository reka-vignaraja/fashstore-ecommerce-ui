
"use strict";

// =======================================
// 1. MOBILE NAVBAR
// =======================================

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {

    menuBtn.addEventListener("click", () => {

        mobileMenu.classList.toggle("hidden");
        mobileMenu.classList.toggle("flex");

        const isOpen = !mobileMenu.classList.contains("hidden");

        menuBtn.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    });

    // Close menu after clicking navigation links
    const mobileLinks = mobileMenu.querySelectorAll("a");

    mobileLinks.forEach((link) => {

        link.addEventListener("click", () => {

            mobileMenu.classList.add("hidden");
            mobileMenu.classList.remove("flex");

            menuBtn.setAttribute("aria-expanded", "false");
        });
    });
}


// =======================================
// 2. PRODUCT DATA
// =======================================

const products = [
    {
        id: 1,
        name: "Snapback Cap",
        price: 20,
        image: "./assets/cap.jpg",
        badge: "SALE"
    },
    {
        id: 2,
        name: "Grey Shoes",
        price: 55,
        image: "./assets/shoes.jpg",
        badge: ""
    },
    {
        id: 3,
        name: "Black T-Shirt",
        price: 30,
        image: "./assets/tshirt.jpg",
        badge: "NEW"
    },
    {
        id: 4,
        name: "Retro Sunglasses",
        price: 15,
        image: "./assets/glass.jpg",
        badge: ""
    }
];


// =======================================
// 3. DISPLAY PRODUCT CARDS
// =======================================

const productGrid = document.getElementById("productGrid");

function displayProducts() {

    if (!productGrid) return;

    // index is used for animation delay
    productGrid.innerHTML = products.map((product, index) => `

        <div
            class="group rounded-lg bg-white
                   transition-all duration-300
                   hover:-translate-y-2 hover:shadow-xl"
            data-aos="fade-up"
            data-aos-delay="${index * 150}">

            <!-- Product Image Container -->
            <div class="relative overflow-hidden
                        rounded-lg bg-gray-100">

                ${product.badge ? `
                    <span
                        class="absolute left-3 top-3 z-10
                               bg-red-500 px-2 py-1
                               text-xs font-bold text-white">
                        ${product.badge}
                    </span>
                ` : ""}

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                    class="h-44 w-full object-contain p-4
                           transition-transform duration-500
                           group-hover:scale-110 md:h-60">
            </div>

            <!-- Product Details -->
            <div class="px-2 pb-4 pt-4">

                <!-- Rating -->
                <p class="text-sm text-orange-400">
                    ★★★★★
                </p>

                <!-- Product Name -->
                <h3 class="mt-1 font-semibold text-gray-900">
                    ${product.name}
                </h3>

                <!-- Price -->
                <p class="mt-1 text-sm text-gray-600">
                    $${product.price.toFixed(2)}
                </p>

                <!-- Add to Cart Button -->
                <button
                    type="button"
                    class="add-to-cart mt-4 bg-red-500
                           px-5 py-3 text-xs font-bold
                           text-white transition-all
                           duration-300
                           hover:scale-105 hover:bg-red-600
                           active:scale-95"
                    data-id="${product.id}">

                    ADD TO CART

                </button>

            </div>

        </div>

    `).join("");
}

// Generate the product cards
displayProducts();


// =======================================
// 4. SHOPPING CART STORAGE
// =======================================

const CART_KEY = "fashStoreCart";

let cart = [];

try {
    const savedCart = JSON.parse(
        localStorage.getItem(CART_KEY)
    );

    if (Array.isArray(savedCart)) {
        cart = savedCart;
    }

} catch (error) {
    console.warn("Could not load saved cart:", error);
    cart = [];
}

// Ensure saved items have valid product data
cart = cart
    .filter(item =>
        item &&
        products.some(product => product.id === item.id) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    )
    .map(item => {

        const product = products.find(
            product => product.id === item.id
        );

        return {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: item.quantity
        };
    });


// =======================================
// 5. GET CART ELEMENTS
// =======================================

const openCartBtn = document.getElementById("openCart");
const closeCartBtn = document.getElementById("closeCart");

const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

const clearCartBtn = document.getElementById("clearCart");

const continueShopping = document.getElementById(
    "continueShopping"
);


// =======================================
// 6. SAVE CART
// =======================================

function saveCart() {

    try {
        localStorage.setItem(
            CART_KEY,
            JSON.stringify(cart)
        );

    } catch (error) {
        console.warn("Could not save cart:", error);
    }
}


// =======================================
// 7. OPEN AND CLOSE CART
// =======================================

function showCart() {

    if (!cartSidebar || !cartOverlay) return;

    cartSidebar.classList.remove("translate-x-full");
    cartOverlay.classList.remove("hidden");

    if (openCartBtn) {
        openCartBtn.setAttribute("aria-expanded", "true");
    }

    document.body.style.overflow = "hidden";
}

function hideCart() {

    if (!cartSidebar || !cartOverlay) return;

    cartSidebar.classList.add("translate-x-full");
    cartOverlay.classList.add("hidden");

    if (openCartBtn) {
        openCartBtn.setAttribute("aria-expanded", "false");
    }

    document.body.style.overflow = "";
}


// Cart button events
if (openCartBtn) {
    openCartBtn.addEventListener("click", showCart);
}

if (closeCartBtn) {
    closeCartBtn.addEventListener("click", hideCart);
}

if (cartOverlay) {
    cartOverlay.addEventListener("click", hideCart);
}

if (continueShopping) {
    continueShopping.addEventListener("click", hideCart);
}

// Close cart using Escape key
document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        hideCart();
    }
});


// =======================================
// 8. ADD PRODUCT TO CART
// =======================================

function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    renderCart();
    showCart();
}


// =======================================
// 9. PRODUCT BUTTON CLICK
// =======================================

// Event delegation works for dynamically
// generated product cards.

if (productGrid) {

    productGrid.addEventListener("click", (event) => {

        const button = event.target.closest(".add-to-cart");

        if (!button) return;

        const productId = Number(button.dataset.id);

        addToCart(productId);
    });
}


// =======================================
// 10. UPDATE PRODUCT QUANTITY
// =======================================

function updateQuantity(productId, change) {

    const item = cart.find(
        product => product.id === productId
    );

    if (!item) return;

    item.quantity += change;

    // Remove product when quantity reaches zero
    if (item.quantity <= 0) {

        cart = cart.filter(
            product => product.id !== productId
        );
    }

    saveCart();
    renderCart();
}


// =======================================
// 11. REMOVE PRODUCT
// =======================================

function removeFromCart(productId) {

    cart = cart.filter(
        product => product.id !== productId
    );

    saveCart();
    renderCart();
}


// =======================================
// 12. DISPLAY SHOPPING CART
// =======================================

function renderCart() {

    // Calculate total quantity
    const totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    // Update cart badge
    if (cartCount) {
        cartCount.textContent = totalQuantity;
    }

    if (!cartItems || !cartTotal) return;

    // Empty cart message
    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="py-16 text-center">

                <p class="text-lg font-semibold">
                    Your cart is empty
                </p>

                <p class="mt-2 text-sm text-gray-500">
                    Add some products to get started.
                </p>

            </div>
        `;

        cartTotal.textContent = "$0.00";

        return;
    }

    // Generate cart products
    cartItems.innerHTML = cart.map(item => `

        <div class="flex gap-4 border-b py-5">

            <!-- Product Image -->
            <img
                src="${item.image}"
                alt="${item.name}"
                class="h-24 w-24 rounded bg-gray-100
                       object-contain p-2">

            <!-- Product Details -->
            <div class="flex-1">

                <h3 class="font-semibold">
                    ${item.name}
                </h3>

                <p class="mt-1 text-sm text-gray-600">
                    $${item.price.toFixed(2)}
                </p>

                <!-- Quantity -->
                <div class="mt-3 flex items-center gap-3">

                    <!-- Decrease -->
                    <button
                        type="button"
                        class="cart-action rounded border
                               px-3 py-1 hover:bg-gray-100"
                        data-action="decrease"
                        data-id="${item.id}">
                        −
                    </button>

                    <span class="font-semibold">
                        ${item.quantity}
                    </span>

                    <!-- Increase -->
                    <button
                        type="button"
                        class="cart-action rounded border
                               px-3 py-1 hover:bg-gray-100"
                        data-action="increase"
                        data-id="${item.id}">
                        +
                    </button>

                </div>

                <!-- Item Total -->
                <p class="mt-3 text-sm font-bold">
                    $${(item.price * item.quantity).toFixed(2)}
                </p>

                <!-- Remove -->
                <button
                    type="button"
                    class="cart-action mt-2 text-sm
                           text-red-500 hover:underline"
                    data-action="remove"
                    data-id="${item.id}">
                    Remove
                </button>

            </div>

        </div>

    `).join("");

    // Calculate subtotal
    const total = cart.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );

    cartTotal.textContent = `$${total.toFixed(2)}`;
}


// =======================================
// 13. CART BUTTON EVENTS
// =======================================

if (cartItems) {

    cartItems.addEventListener("click", (event) => {

        const button = event.target.closest(".cart-action");

        if (!button) return;

        const productId = Number(button.dataset.id);
        const action = button.dataset.action;

        if (action === "increase") {
            updateQuantity(productId, 1);
        }

        if (action === "decrease") {
            updateQuantity(productId, -1);
        }

        if (action === "remove") {
            removeFromCart(productId);
        }
    });
}


// =======================================
// 14. CLEAR CART
// =======================================

if (clearCartBtn) {

    clearCartBtn.addEventListener("click", () => {

        cart = [];

        saveCart();
        renderCart();
    });
}


// =======================================
// 15. INITIALIZE CART AND ANIMATIONS
// =======================================

// Display saved cart on page load
renderCart();

// Initialize AOS when available.
// This also detects dynamically generated cards.
function initializeAnimations() {

    if (typeof AOS === "undefined") return;

    AOS.init({
        duration: 1000,
        easing: "ease-in-out",
        once: true,
        offset: 100
    });

    AOS.refreshHard();
}

if (document.readyState === "complete") {

    initializeAnimations();

} else {

    window.addEventListener(
        "load",
        initializeAnimations,
        { once: true }
    );
}
