const questManagerContractAddress = "0xf0224509Eb8fBc7a73Dff3346FEcCf182C694cD5";
const eventManagerContractAddress = "0xA30cE21f1Ad6205947816bFc3C027F6f981Afd7a";
const userManagerContractAddress = "0x19A20676F0D55542c5394a618C27f7346318715D";
const eventQuestManagerContractAddress = "0xeeFd0E324B77C0F3f4C0ac1F00917A71933bD1B6";
const eventsContractAddress = "0x095258a94F7Bc463aD36AA84b1F7C4f7F41fb14b";

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

async function fetcheventquestABI() {
    let response = await fetch('EventQuestManagement.json');
    const data = await response.json();
    return data.abi; // Assuming the ABI is stored under the key 'abi'
}


async function fetcheventsABI() {
    let response = await fetch('Events.json');
    const data = await response.json();
    return data.abi; // Assuming the ABI is stored under the key 'abi'
}

let questManagerABI;
let eventManagerABI;
let userManagerABI;
let eventQuestManagerABI;
let eventsABI;

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

async function initializeEventQuestContract() {
    console.log("initializeEventQuestContract");
    eventQuestManagerABI = await fetcheventquestABI(); // Fetch and assign the ABI
    const eventQuestManagerContract = new ethers.Contract(eventQuestManagerContractAddress, eventQuestManagerABI, signer);
    return eventQuestManagerContract;
}
async function initializeEventsContract() {
    console.log("initializeEventsContract");
    eventsABI = await fetcheventsABI(); // Fetch and assign the ABI
    const eventsContract = new ethers.Contract(eventsContractAddress, eventsABI, signer);
    return eventsContract;
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

async function loadAvailableEvent() {
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

async function loadAvailableEventQuests() {
    try {
        await connectWallet(); // Ensure wallet is connected before proceeding
        const eventQuestManagerContract = await initializeEventQuestContract(); // Ensure contract is initialized before calling methods
        const eventEventId = 1; // Change this to the actual eventId you want to retrieve
        const events = await eventQuestManagerContract.readEvent(1);
        console.log(events);

        // Basic verification of listEvents call
        if (!Array.isArray(events)) {
            console.error('read event quest did not return an array');
            return;
        }

        if (events.length === 0) {
            console.log('No event quest found.');
        } else {
            console.log(`Found ${events.length} event quest.`);

            // Convert BigNumber to string for easier inspection
            const firstEventId = events[0].toString();
            console.log(`First event quest ID: ${firstEventId}`);
        }
    } catch (error) {
        console.error("Failed to load event quest:", error.message);
    }
}

async function loadAvailableEvents() {
    try {
        await connectWallet(); // Ensure wallet is connected before proceeding
            console.log('loadAvailableEvents.');
        const eventsContract = await initializeEventsContract(); // Ensure contract is initialized before calling methods
            console.log(eventsContract);
        const eventEventId = 1; // Change this to the actual eventId you want to retrieve
        const events = await eventsContract.listEvents();
        console.log(events);

        // Basic verification of listEvents call
        if (!Array.isArray(events)) {
            console.error('read event quest did not return an array');
            return;
        }

        if (events.length === 0) {
            console.log('No event quest found.');
        } else {
            console.log(`Found ${events.length} event quest.`);

            // Convert BigNumber to string for easier inspection
            const firstEventId = events[0].toString();
            console.log(`First event quest ID: ${firstEventId}`);
        }
    } catch (error) {
        console.error("Failed to load event quest:", error.message);
    }
}

// Call the function when the page loads
window.addEventListener('load', async () => {
    await loadAvailableQuests();
    await loadAvailableEvent();
    await loadAvailableUsers();
    // await loadAvailableEventQuests();
    await loadAvailableEvents();
});

