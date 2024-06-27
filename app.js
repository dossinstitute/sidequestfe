const questManagerContractAddress = "0x7B4042A8D2F30Dee7ce3b5490C8088A9cbd8FE85";
const eventManagerContractAddress = "0x5d08d1f2B436Af26E121681b976a27869B100FC5";

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

let questManagerABI;
let eventManagerABI;

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
				// console.log(`initial quest: ${JSON.stringify(quest, null, 2)}`);
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
				// console.log(`initial events: ${JSON.stringify(events, null, 2)}`);
				// console.log(Object.keys(events[0])); // Log the keys of the first event object

        // Basic verification of listEvents call
        if (!Array.isArray(events)) {
            console.error('listEvents did not return an array');
            return;
        }
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

      // const startTime = Math.floor(Date.now() / 1000);
      // const endTime = startTime + 86400; // 1 day from now
      // const description = "Test Event";
      //  try {
      //       const txResponse = await eventManagerContract.createEvent(startTime, endTime, description);
      //       console.log(`Transaction hash: ${txResponse.hash}`);
      //
      //       await txResponse.wait(); // Wait for the transaction to be mined
      //
      //       console.log('Transaction mined successfully.');
      //
      //       // Extract the event logs from the transaction receipt
			// 	 console.log('Provider before getTransactionReceipt:', provider);
      //       const receipt = await provider.getTransactionReceipt(txResponse.hash);
      //
      //       // Filter out the EventCreated event logs
      //       const iface = new ethers.utils.Interface(["event EventCreated(uint256 eventId, uint256 startTime, uint256 endTime, string description)"]);
      //       const eventCreatedLogs = receipt.logs.filter(log => {
      //           try {
      //               iface.parseLog(log);
      //               return true;
      //           } catch (error) {
      //               return false;
      //           }
      //       });
      //
      //       if (eventCreatedLogs.length > 0) {
      //           const log = eventCreatedLogs[0];
      //           const parsedLog = iface.parseLog(log);
      //           const { args } = parsedLog;
      //           console.log(`EventCreated emitted with ID: ${args.eventId.toString()}, StartTime: ${args.startTime.toString()}, EndTime: ${args.endTime.toString()}, Description: ${args.description}`);
      //       } else {
      //           console.log('EventCreated event not found in transaction receipt.');
      //       }
        // } catch (error) {
        //     console.error('Error creating event:', error.message);
        // }

    } catch (error) {
        console.error("Failed to load events:", error.message);
    }
}

// Call the function when the page loads
window.addEventListener('load', async () => {
    await loadAvailableQuests();
    await loadAvailableEvents();
});
