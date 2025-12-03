const connectBtn = document.getElementById("connectBtn");
const walletText = document.getElementById("wallet");
const balanceText = document.getElementById("balance");
const tokenBalanceText = document.getElementById("tokenBalance");

let provider, signer, userAddress;

// ERC-20 ABI for reading balances
const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
];

// USDT contract on Ethereum Mainnet
const TOKEN_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

async function connectWallet() {
    if (!window.ethereum) {
        alert("MetaMask not installed!");
        return;
    }

    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();

    walletText.innerText = "Wallet Address: " + userAddress;

    getEthBalance();
    getTokenBalance();
}

async function getEthBalance() {
    const balance = await provider.getBalance(userAddress);
    const etherBalance = ethers.utils.formatEther(balance);
    balanceText.innerText = "ETH Balance: " + etherBalance;
}

async function getTokenBalance() {
    const token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, provider);

    const rawBalance = await token.balanceOf(userAddress);
    const decimals = await token.decimals();
    const symbol = await token.symbol();

    const formatted = Number(rawBalance) / 10 ** decimals;

    tokenBalanceText.innerText = `${symbol} Balance: ${formatted}`;
}

connectBtn.addEventListener("click", connectWallet);
async function getNetwork() {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });

    let networkName = "Unknown";

    const networks = {
        "0x1": "Ethereum Mainnet",
        "0x5": "Goerli Testnet",
        "0xaa36a7": "Sepolia Testnet",
        "0x89": "Polygon Mainnet",
        "0x13881": "Polygon Mumbai",
        "0x38": "BSC Mainnet",
        "0x61": "BSC Testnet"
    };

    if (networks[chainId]) {
        networkName = networks[chainId];
    }

    document.getElementById("network").innerText = "Network: " + networkName;
}
getNetwork();
async function getGasPrice() {
    const gasHex = await window.ethereum.request({
        method: "eth_gasPrice"
    });

    const gasWei = parseInt(gasHex, 16);
    const gasGwei = gasWei / 1e9;

    document.getElementById("gas").innerText = 
        "Gas Price: " + gasGwei.toFixed(2) + " Gwei";
}

getGasPrice();
async function sendEth() {
    try {
        await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [{
                from: userAddress,
                to: userAddress,       // send to your own wallet (safe)
                value: "0x38d7ea4c68000" // 0.001 ETH
            }]
        });

        alert("Transaction Sent Successfully!");
    } catch (err) {
        alert("Transaction Failed: " + err.message);
    }
}

document.getElementById("sendEthBtn").onclick = sendEth;
