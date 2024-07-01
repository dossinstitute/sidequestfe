// const questManagerContractAddress = "0xfcA9573FB8f7a1B936Db7dbe54bAB3f56aFac2f9";
const eventManagerContractAddress = "0xA30cE21f1Ad6205947816bFc3C027F6f981Afd7a";
const userManagerContractAddress = "0x19A20676F0D55542c5394a618C27f7346318715D";
const eventQuestManagerContractAddress = "0xeeFd0E324B77C0F3f4C0ac1F00917A71933bD1B6";
const newUsersContractAddress = "0xDf6a06153173bF16a3100C700652BB4927A6A738";

  const userQuestEventsContractAddress = "0x9596640e54d4382717dB30946f22152cfA5673fE";
  const usersContractAddress = "0x03DFc1e09395d5875eCF4DF432307BBE62b145bd";
  const questEventsContractAddress = "0xb20a8C14d4ade65338b468B794f5261D472c2402";
  const eventsContractAddress = "0x9725CD79109Ee4F956ec9Fa6dCb22BF623c18BF8";
  const questsContractAddress = "0x113632694bF0E7F1f447046403784d3220C29580";

// async function fetchquestABI() {
//     let response = await fetch('QuestManager.json');
//     const data = await response.json();
//     return data.abi; // Assuming the ABI is stored under the key 'abi'
// }

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

async function fetchquestsABI() {
    let response = await fetch('Quests.json');
    const data = await response.json();
    console.log(`data.abi ${data.abi}`);
    return data.abi; // Assuming the ABI is stored under the key 'abi'
}

async function fetchnewUsersABI() {
    let response = await fetch('Users.json');
    const data = await response.json();
    return data.abi; // Assuming the ABI is stored under the key 'abi'
}

// let questManagerABI;
let eventManagerABI;
let userManagerABI;
let eventQuestManagerABI;
let eventsABI;
let questsABI;
let newUsersABI;

// async function initializeQuestContract() {
//     console.log("initializeQuestContract");
//     questManagerABI = await fetchquestABI(); // Fetch and assign the ABI
//     const questManagerContract = new ethers.Contract(questManagerContractAddress, questManagerABI, signer);
//     return questManagerContract;
// }

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

async function initializeQuestsContract() {
    console.log("initializeQuestsContract");
    questsABI = await fetchquestsABI(); // Fetch and assign the ABI
    console.log("after fetchquestsABI");
    const questsContract = new ethers.Contract(questsContractAddress, questsABI, signer);
    return questsContract;
}

async function initializeNewUsersContract() {
    console.log("initializeNewUsersContract");
    newUsersABI = await fetchnewUsersABI(); // Fetch and assign the ABI
    const newUsersContract = new ethers.Contract(newUsersContractAddress, newUsersABI, signer);
    return newUsersContract;
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

// async function loadAvailableQuests() {
//     try {
//         console.log('appjs loadAvailableQuests.');
//         await connectWallet(); // Ensure wallet is connected before proceeding
//         const questManagerContract = await initializeQuestContract(); // Ensure contract is initialized before calling methods
//         const questEventId = 1; // Change this to the actual eventId you want to retrieve
//         const quest = await questManagerContract.getQuest(questEventId);
//         console.log(quest);
//     } catch (error) {
//         console.error("Failed to load quests:", error.message);
//     }
// }

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

async function loadAvailableUsersFromNewContract() {
    try {
			console.log("loadAvailableUsersFromNewContract");
        await connectWallet(); // Ensure wallet is connected before proceeding
        const newUsersContract = await initializeNewUsersContract(); // Ensure contract is initialized before calling methods
        const userCountBN = await newUsersContract.getUserCount();
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
                const user = await newUsersContract.getUserByIndex(i);
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

async function loadAvailableQuestsFromContract() {
  try {
    await connectWallet(); // Ensure wallet is connected before proceeding
    console.log('Loading available quests from contract...');
    const questsContract = await initializeQuestsContract(); // Ensure contract is initialized before calling methods
      console.log("after initialize");
    if (!questsContract) {
      console.error("Quests Contract is not initialized");
      return;
    }
    console.log("Available Contract Functions:", questsContract.functions); // Log available functions

    const questCount = await questsContract.getQuestCount();
    console.log(`Total quests: ${questCount.toNumber()}`);

    for (let i = 0; i < questCount; i++) {
      const quest = await questsContract.getQuestByIndex(i);
      console.log(`Quest ${i}:`, quest);
    }
  } catch (error) {
    console.error("Failed to load quests:", error.message);
  }
}

// Call the function when the page loads
window.addEventListener('load', async () => {
    // await loadAvailableQuests();
    await loadAvailableEvent();
    await loadAvailableUsers();
    await loadAvailableUsersFromNewContract();
    // await loadAvailableEventQuests();
    await loadAvailableEvents();
    await loadAvailableQuestsFromContract();
});

