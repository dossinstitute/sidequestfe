// const questManagerContractAddress = "0xa16D8f09c4BFf7Ef8B17bbAE534F1b524160C911";
const questManagerContractAddress = "0x36b079165906f092b9EF79Ee837073843c51DFc3";
const eventManagerContractAddress = "0x3a1f8375b05Ed3f8c892526c3E5e97976deA7754";

async function fetchquestABI() {
    let response = await fetch('QuestManager.json');
    const data = await response.json();
    return data.abi; // Assuming the ABI is stored under the key 'abi'
}
async function fetcheventABI() {
    let response = await fetch('EventManager.json');
    const data = await response.json();
    return data.abi; // Assuming the ABI is stored under the key 'abi'
}

let questManagerABI;
let eventManagerABI;

async function initializeQuestContract() {
    questManagerABI = await fetchquestABI(); // Fetch and assign the ABI
    const questManagerContract = new ethers.Contract(questManagerContractAddress, questManagerABI, signer);
    return questManagerContract;
}

async function initializeEventContract() {
    eventManagerABI = await fetcheventABI(); // Fetch and assign the ABI
    const eventManagerContract = new ethers.Contract(eventManagerContractAddress, eventManagerABI, signer);
    return eventManagerContract;
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
        const questManagerContract = await initializeQuestContract(); // Ensure contract is initialized before calling methods
        const questEventId = 1; // Change this to the actual eventId you want to retrieve
        const quest = await questManagerContract.getQuest(questEventId);
        console.log(quest);
    } catch (error) {
        console.error("Failed to load quests:", error.message);
    }
}

async function loadAvailableEvents() {
    try {
        await connectWallet(); // Ensure wallet is connected before proceeding
        const eventManagerContract = await initializeEventContract(); // Ensure contract is initialized before calling methods
        const eventEventId = 1; // Change this to the actual eventId you want to retrieve
        const events = await eventManagerContract.listEvents();
        console.log(events);
    } catch (error) {
        console.error("Failed to load events:", error.message);
    }
}

// Call the function when the page loads
window.addEventListener('load', async () => {
    await loadAvailableQuests();
    await loadAvailableEvents();
});
