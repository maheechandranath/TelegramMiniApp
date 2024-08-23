// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;

// Sample PDF data (replace with actual data from your backend)
const pdfs = [
    { id: 1, title: 'Sample PDF 1', author: 'Author 1', price: 10, description: 'Description 1' },
    { id: 2, title: 'Sample PDF 2', author: 'Author 2', price: 15, description: 'Description 2' },
    // Add more PDFs here
];

// Current page state
let currentPage = 'home';

// Cart items
let cart = [];

// Function to switch between pages
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
    currentPage = pageId;
}

// Function to render PDF grid
function renderPDFGrid() {
    const grid = document.getElementById('pdf-grid');
    grid.innerHTML = '';
    pdfs.forEach(pdf => {
        const pdfElement = document.createElement('div');
        pdfElement.className = 'pdf-item';
        pdfElement.innerHTML = `
            <h3>${pdf.title}</h3>
            <p>${pdf.author}</p>
            <p>${pdf.price} TON</p>
            <button onclick="showPDFDetails(${pdf.id})">View Details</button>
        `;
        grid.appendChild(pdfElement);
    });
}

// Function to show PDF details
function showPDFDetails(pdfId) {
    const pdf = pdfs.find(p => p.id === pdfId);
    document.getElementById('pdf-thumbnail').src = `path/to/${pdf.id}-thumbnail.jpg`;
    document.getElementById('pdf-title').textContent = pdf.title;
    document.getElementById('pdf-author').textContent = pdf.author;
    document.getElementById('pdf-description').textContent = pdf.description;
    document.getElementById('pdf-price').textContent = `${pdf.price} TON`;
    document.getElementById('buy-button').onclick = () => addToCart(pdf);
    showPage('pdf-details');
}

// Function to add PDF to cart
function addToCart(pdf) {
    cart.push(pdf);
    updateCart();
    showPage('cart');
}

// Function to update cart
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(pdf => {
        const li = document.createElement('li');
        li.textContent = `${pdf.title} - ${pdf.price} TON`;
        cartItems.appendChild(li);
        total += pdf.price;
    });
    cartTotal.textContent = total;
    document.getElementById('payment-total').textContent = total;
}

// Function to simulate TON wallet connection
function connectWallet() {
    // In a real app, you would integrate with TON Connect here
    alert('Connecting to TON wallet...');
    document.getElementById('connect-wallet').style.display = 'none';
    document.getElementById('confirm-payment').style.display = 'block';
}

// Function to simulate payment confirmation
function confirmPayment() {
    // In a real app, you would handle the actual payment here
    alert('Payment confirmed! Generating download links...');
    cart.forEach(pdf => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#" onclick="alert('Downloading ${pdf.title}...')">Download ${pdf.title}</a>`;
        document.getElementById('purchased-pdfs').appendChild(li);
    });
    cart = [];
    updateCart();
    showPage('account');
}

// Event listeners
document.getElementById('nav-home').addEventListener('click', () => showPage('home'));
document.getElementById('nav-cart').addEventListener('click', () => showPage('cart'));
document.getElementById('nav-account').addEventListener('click', () => showPage('account'));
document.getElementById('checkout-button').addEventListener('click', () => showPage('payment'));
document.getElementById('connect-wallet').addEventListener('click', connectWallet);
document.getElementById('confirm-payment').addEventListener('click', confirmPayment);

// Initialize the app
renderPDFGrid();
showPage('home');

// Set Telegram WebApp ready
tg.ready();
