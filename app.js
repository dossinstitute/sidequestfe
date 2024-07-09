// const questManagerContractAddress = "0xfcA9573FB8f7a1B936Db7dbe54bAB3f56aFac2f9";
const eventManagerContractAddress = "0xA30cE21f1Ad6205947816bFc3C027F6f981Afd7a";
const userManagerContractAddress = "0x19A20676F0D55542c5394a618C27f7346318715D";


const eventQuestManagerContractAddress = "0xad9b202e48e1bCbafaa8cDCc7A136CD7c1E04C52";
const newUsersContractAddress = "0xF9F98Ee5e4fa000E6Bada4cA6F7fC97Cc2b9301e";
  const userQuestEventsContractAddress = "0xce6fcee19eA91fab8Db884D3f3F7dC05b70E4f84";
  const usersContractAddress = "0xF9F98Ee5e4fa000E6Bada4cA6F7fC97Cc2b9301e";
  const questEventsContractAddress = "0xeb6EEbb7bA7C56Cc76F0a84BE166Ff2148450266";
  const eventsContractAddress = "0x164155E567ee016DEe8F2c26785003c578eA919E";
  const questsContractAddress = "0xcbf7b6da410b8d3f77f9ba600eD9ED689C058a0e";


// npx hardhat run --network rskTestnet scripts/deploy_event_questmanager.ts 
// Compiled 2 Solidity files successfully (evm target: paris).
// Deploying contracts with the account: 0xA9574989663f48C010c87C638e94eF737c3Af3C0
// Events contract deployed to: 0x164155E567ee016DEe8F2c26785003c578eA919E
// Quests contract deployed to: 0xcbf7b6da410b8d3f77f9ba600eD9ED689C058a0e
// Users contract deployed to: 0xF9F98Ee5e4fa000E6Bada4cA6F7fC97Cc2b9301e
// Sponsors contract deployed to: 0xa70228113b6402b72af5e7b92529D70f4855b20e
// QuestEvents contract deployed to: 0xeb6EEbb7bA7C56Cc76F0a84BE166Ff2148450266
// UserQuestEvents contract deployed to: 0xce6fcee19eA91fab8Db884D3f3F7dC05b70E4f84
// Rewards contract deployed to: 0x2393d0e23A53b2dc51C9C19Cc72102856206F1be
// RewardPools contract deployed to: 0xa52c03a93837BE756c417E866dDFe4321Cbd44ed
// EventQuestManagement contract deployed to: 0x254E4DC8326f7096e08aBD302F978287092EDcBa

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
		console.log("app fetchnewUsersABI");
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
    console.log("app initializeUserContract");
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
    console.log("app initializeNewUsersContract");
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
			console.log("app loadAvailableUsersFromNewContract");
        await connectWallet(); // Ensure wallet is connected before proceeding
        const newUsersContract = await initializeNewUsersContract(); // Ensure contract is initialized before calling methods
        const userCountBN = await newUsersContract.getUserCount();
        const userCount = userCountBN.toNumber(); // Convert BigNumber to number

        console.log(`app loadAvailableUsersFromNewContract ${userCount}`);

        if (!Number.isInteger(userCount)) {
            console.error('getUserCount did not return an integer');
            return;
        }

        if (userCount === 0) {
            console.log('No users found.');
        } else {
            console.log(`Found ${userCount} users.`);

            for (let i = 0; i < userCount; i++) {
							console.log(`newUsersContract.getUserByIndex(i) i: ${i}`);
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
async function checkAndCreateUser() {
		console.log(`checkAndCreateUser`);
		await connectWallet();
		const usersContract = await initializeNewUsersContract();

		const userWallet = await signer.getAddress();
		try {
				const userId = await usersContract.getUserIdByWallet(userWallet);
				console.log(`User already exists with ID: ${userId} and address: ${userWallet}`);
		} catch (error) {
				console.log(`usersContract.getUserIdByWallet(userWallet) failed`);
				console.log(`error.data.message ${error.data.message}`);
				console.log(`error.data ${error.data}`);
				console.log(`error ${error}`);
				if (error.data.message && error.data.message.includes("User does not exist")) {
						console.log("User does not exist. Creating new user...");
						try {
								const txResponse = await usersContract.createUser(userWallet, "defaultRole");
								console.log(`User creation transaction hash: ${txResponse.hash}`);
								// need to wait for user to be created before moving forward
								await txResponse.wait();
								console.log('User created successfully');
								alert('User created successfully');
						} catch (createError) {
								console.error('Error creating user:', createError);
						}
				} else {
						console.error('Error checking user existence:', error);
				}
		}
}


// Call the function when the page loads
window.addEventListener('load', async () => {
    await checkAndCreateUser();
    // await loadAvailableQuests();
    await loadAvailableEvent();
    await loadAvailableUsers();
    await loadAvailableUsersFromNewContract();
    // await loadAvailableEventQuests();
    await loadAvailableEvents();
    await loadAvailableQuestsFromContract();
});

