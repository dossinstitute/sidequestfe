const questManagerContractAddress = "0x8c3a688a5aC9c0B0437507A94f02c2177D2Fe3C9";
const eventManagerContractAddress = "0xf7F2b14fD9Bb0311869eCB31d0b38f26a87081C1";
const userManagerContractAddress = "0x556F03ff65A48eb8BCE3221486C60Ee2715E04CA";

async function fetchquestABI() {
    let response = await fetch('QuestManager.json');
    const data = await response.json();
    return data.abi; // Assuming the ABI is stored under the key 'abi'
}

async function fetcheventABI() {
    let response = await fetch('EventsManager.json');
    const data = await response.json();
    return data.abi; // Assuming the ABI is stored under the key 'abi'
}

async function fetchuserABI() {
    let response = await fetch('UserManager.json');
    const data = await response.json();
    return data.abi; // Assuming the ABI is stored under the key 'abi'
}

let questManagerABI;
let eventManagerABI;
let userManagerABI;

async function initializeQuestContract() {
    console.log("initializeQuestContract");
    questManagerABI = await fetchquestABI(); // Fetch and assign the ABI
    const questManagerContract = new ethers.Contract(questManagerContractAddress, questManagerABI, signer);
    return questManagerContract;
}

async function initializeEventContract() {
    console.log("initializeEventContract");
    eventManagerABI = await fetcheventABI(); // Fetch and assign the ABI
    const eventManagerContract = new ethers.Contract(eventManagerContractAddress, eventManagerABI, signer);
    return eventManagerContract;
}

async function initializeUserContract() {
    console.log("initializeUserContract");
    userManagerABI = await fetchuserABI(); // Fetch and assign the ABI
    const userManagerContract = new ethers.Contract(userManagerContractAddress, userManagerABI, signer);
    return userManagerContract;
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

        // Basic verification of listEvents call
        if (!Array.isArray(events)) {
            console.error('listEvents did not return an array');
            return;
        }

        if (events.length === 0) {
            console.log('No events found.');
        } else {
            console.log(`Found ${events.length} events.`);

            // Convert BigNumber to string for easier inspection
            const firstEventId = events[0].toString();
            console.log(`First event ID: ${firstEventId}`);
        }
    } catch (error) {
        console.error("Failed to load events:", error.message);
    }
}

async function loadAvailableUsers() {
    try {
        await connectWallet(); // Ensure wallet is connected before proceeding
        const userManagerContract = await initializeUserContract(); // Ensure contract is initialized before calling methods
        const users = await userManagerContract.getUserCount();
        const userCountBN = await userManagerContract.getUserCount();
        const userCount = userCountBN.toNumber(); // Convert BigNumber to number

        console.log(userCount);

        if (!Number.isInteger(userCount)) {
            console.error('getUserCount did not return an integer');
            return;
        }

        if (userCount === 0) {
            console.log('No users found.');
        } else {
            console.log(`Found ${userCount} users.`);

            for (let i = 0; i < userCount; i++) {
                const user = await userManagerContract.getUserByIndex(i);
                console.log(user);
            }
        }
    } catch (error) {
        console.error("Failed to load users:", error.message);
    }
}

// Call the function when the page loads
window.addEventListener('load', async () => {
    await loadAvailableQuests();
    await loadAvailableEvents();
    await loadAvailableUsers();
});

