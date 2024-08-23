// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;

// Initialize TON Connect
const tonConnect = new TONConnect();

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
    document.getElementById('buy-button').onclick = () => buyPDF(pdf);
    showPage('pdf-details');
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
            alert(`Payment for "${pdf.title}" is being processed. You'll receive your download link shortly.`);
            // Here you would typically notify your backend about the transaction
            // and generate a download link for the user
        } catch (error) {
            console.error('Transaction failed:', error);
            alert('Payment failed. Please try again.');
        }
    } else {
        alert('Please connect your wallet to make a purchase.');
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
        alert('Failed to connect wallet. Please try again.');
    }
}

// Function to update wallet connection button
function updateWalletButton() {
    const walletButton = document.getElementById('connect-wallet');
    if (tonConnect.connected) {
        walletButton.textContent = 'Wallet Connected';
        walletButton.disabled = true;
    } else {
        walletButton.textContent = 'Connect TON Wallet';
        walletButton.disabled = false;
    }
}

// Event listeners
document.getElementById('nav-home').addEventListener('click', () => showPage('home'));
document.getElementById('nav-cart').addEventListener('click', () => showPage('cart'));
document.getElementById('nav-account').addEventListener('click', () => showPage('account'));
document.getElementById('connect-wallet').addEventListener('click', connectWallet);

// Initialize the app
renderPDFGrid();
showPage('home');
updateWalletButton();

// Set Telegram WebApp ready
tg.ready();

// Listen for wallet connection changes
tonConnect.onStatusChange(updateWalletButton);
