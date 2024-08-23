// Initialize TON Connect
let tonConnectUI;

// Function to initialize TON Connect
async function initTonConnect() {
    tonConnectUI = new TONConnect({
        manifestUrl: 'https://maheechandranath.github.io/TelegramMiniApp//tonconnect-manifest.json'
    });

    // Restore the connection on page load
    await tonConnectUI.restoreConnection();
    updateWalletButton();
}

// Function to connect TON wallet
async function connectWallet() {
    try {
        await tonConnectUI.connectWallet();
        updateWalletButton();
        showToast('Wallet connected successfully');
    } catch (error) {
        console.error('Failed to connect wallet:', error);
        showToast('Failed to connect wallet. Please try again.');
    }
}

// Function to update wallet connection button
function updateWalletButton() {
    const walletButton = document.getElementById('connect-wallet');
    if (tonConnectUI.connected) {
        walletButton.textContent = 'Wallet Connected';
        walletButton.disabled = true;
    } else {
        walletButton.textContent = 'Connect Wallet';
        walletButton.disabled = false;
    }
}

// Function to buy PDF
async function buyPDF(pdf) {
    if (!tonConnectUI.connected) {
        await connectWallet();
    }
    
    if (tonConnectUI.connected) {
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
            const result = await tonConnectUI.sendTransaction(transaction);
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
async function initApp() {
    await initTonConnect();
    renderPDFGrid();
    showPage('home');
    updateWalletButton();

    // Set Telegram WebApp ready
    tg.ready();
}

// Call initApp to start the application
initApp();

// Listen for wallet connection changes
tonConnectUI.onStatusChange(updateWalletButton);
```

Additionally, you need to create a TON Connect manifest file. Create a new file named `tonconnect-manifest.json` and host it at the URL you specified in the `manifestUrl` option when initializing TON Connect. Here's a basic example of what this file should contain:

```json
{
  "url": "https://your-app-domain.com",
  "name": "Your PDF Store",
  "iconUrl": "https://your-app-domain.com/app-icon.png",
  "termsOfUseUrl": "https://your-app-domain.com/terms",
  "privacyPolicyUrl": "https://your-app-domain.com/privacy"
}
