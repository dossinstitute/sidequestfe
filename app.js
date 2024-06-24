const questManagerContractAddress = "0xa16D8f09c4BFf7Ef8B17bbAE534F1b524160C911";

async function fetchABI() {
    let response = await fetch('QuestManager.json');
    const data = await response.json();
    return data.abi; // Assuming the ABI is stored under the key 'abi'
}

let questManagerABI;

async function initializeContract() {
    questManagerABI = await fetchABI(); // Fetch and assign the ABI
    const questManagerContract = new ethers.Contract(questManagerContractAddress, questManagerABI, signer);
    return questManagerContract;
}

const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;

async function connectWallet() {
    try {
        // Request account access if not already connected
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Initialize signer after successful connection
        signer = provider.getSigner();
    } catch (error) {
        console.error("User rejected request to connect wallet:", error);
    }
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        console.log('Please connect to MetaMask.');
    } else {
        signer = provider.getSigner();
    }
}

window.ethereum.on('accountsChanged', handleAccountsChanged);

async function loadAvailableQuests() {
    try {
        await connectWallet(); // Ensure wallet is connected before proceeding
        const questManagerContract = await initializeContract(); // Ensure contract is initialized before calling methods
        const questEventId = 1; // Change this to the actual eventId you want to retrieve
        const quest = await questManagerContract.getQuest(questEventId);
        console.log(quest);
    } catch (error) {
        console.error("Failed to load quests:", error.message);
    }
}

// Call the function when the page loads
window.addEventListener('load', async () => {
    await loadAvailableQuests();
});
