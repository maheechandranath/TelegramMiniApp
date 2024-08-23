// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;

// Initialize TON Connect
const tonConnect = new TONConnect();

// Mock database for PDF links
const pdfDatabase = [
    { id: 1, title: 'Introduction to JavaScript', author: 'John Doe', price: 10, description: 'Learn the basics of JavaScript programming.', link: 'https://example.com/js-intro.pdf' },
    { id: 2, title: 'Advanced Python Techniques', author: 'Jane Smith', price: 15, description: 'Master advanced Python programming concepts.', link: 'https://example.com/adv-python.pdf' },
    { id: 3, title: 'Web Design Fundamentals', author: 'Alice Johnson', price: 12, description: 'Understand the core principles of web design.', link: 'https://example.com/web-design.pdf' },
    // Add more PDFs here
];

let currentPage = 'home';
let cart = [];
let searchTimeout;

// Function to switch between pages
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
    currentPage = pageId;
}

// Function to render PDF grid
function renderPDFGrid(pdfs = pdfDatabase) {
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
    const pdf = pdfDatabase.find(p => p.id === pdfId);
    document.getElementById('pdf-thumbnail').src = `https://via.placeholder.com/150?text=${encodeURIComponent(pdf.title)}`;
    document.getElementById('pdf-title').textContent = pdf.title;
    document.getElementById('pdf-author').textContent = pdf.author;
    document.getElementById('pdf-description').textContent = pdf.description;
    document.getElementById('pdf-price').textContent = `${pdf.price} TON`;
    document.getElementById('add-to-cart').onclick = () => addToCart(pdf);
    document.getElementById('buy-now').onclick = () => buyPDF(pdf);
    showPage('pdf-details');
}

// Function to add PDF to cart
function addToCart(pdf) {
    cart.push(pdf);
    updateCart();
    showToast(`Added "${pdf.title}" to cart`);
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
    document.getElementById('nav-cart').textContent = `Cart (${cart.length})`;
}

// Function to buy PDF
async function buyPDF(pdf) {
    if (!tonConnect.connected) {
        await connectWallet();
    }
    
    if (tonConnect.connected) {
        const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 60 * 20, // Valid for 20 minutes
            messages: [
                {
                    address: 'YOUR_STORE_WALLET_ADDRESS',
                    amount: (pdf.price * 1000000000).toString(), // Convert TON to nanoTON
                    payload: `Buy PDF: ${pdf.id}`,
                }
            ]
        };

        try {
            const result = await tonConnect.sendTransaction(transaction);
            console.log('Transaction sent:', result);
            showToast(`Payment for "${pdf.title}" is being processed. You'll receive your download link shortly.`);
            // Here you would typically notify your backend about the transaction
            // and generate a download link for the user
            setTimeout(() => {
                // Simulate backend processing
                showToast(`Download link for "${pdf.title}": ${pdf.link}`);
            }, 3000);
        } catch (error) {
            console.error('Transaction failed:', error);
            showToast('Payment failed. Please try again.');
        }
    } else {
        showToast('Please connect your wallet to make a purchase.');
    }
}

// Function to connect TON wallet
async function connectWallet() {
    try {
        const walletConnectionSource = {
            jsBridgeKey: 'tonkeeper'
        };
        await tonConnect.connect(walletConnectionSource);
        updateWalletButton();
    } catch (error) {
        console.error('Failed to connect wallet:', error);
        showToast('Failed to connect wallet. Please try again.');
    }
}

// Function to update wallet connection button
function updateWalletButton() {
    const walletButton = document.getElementById('connect-wallet');
    if (tonConnect.connected) {
        walletButton.textContent = 'Wallet Connected';
        walletButton.disabled = true;
    } else {
        walletButton.textContent = 'Connect Wallet';
        walletButton.disabled = false;
    }
}

// Function to show toast message
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Function to handle search
function handleSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const searchTerm = document.getElementById('search').value.toLowerCase();
        const filteredPDFs = pdfDatabase.filter(pdf =>
            pdf.title.toLowerCase().includes(searchTerm) ||
            pdf.author.toLowerCase().includes(searchTerm) ||
            pdf.description.toLowerCase().includes(searchTerm)
        );
        renderPDFGrid(filteredPDFs);
    }, 300);
}

// Event listeners
document.getElementById('nav-home').addEventListener('click', () => showPage('home'));
document.getElementById('nav-cart').addEventListener('click', () => showPage('cart'));
document.getElementById('connect-wallet').addEventListener('click', connectWallet);
document.getElementById('checkout').addEventListener('click', () => {
    // Implement checkout logic here
    showToast('Checkout not implemented in this demo');
});
document.getElementById('search').addEventListener('input', handleSearch);

// Initialize the app
renderPDFGrid();
showPage('home');
updateWalletButton();

// Set Telegram WebApp ready
tg.ready();

// Listen for wallet connection changes
tonConnect.onStatusChange(updateWalletButton);
