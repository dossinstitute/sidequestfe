const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const questManagerContractAddress = "0xa16D8f09c4BFf7Ef8B17bbAE534F1b524160C911";
let response = fetch('QuestManager.json');
// let response = await fetch('QuestManager.json');
// const data = await response.json();
const data = response.json();
contractABI = data.abi;
// Place networks.json to set the network automatically with the checkNetwork() function
// You can set it manually instead following this guide https://dev.rootstock.io/kb/rootstock-metamask/
// response = await fetch('networks.json'); 
// networks = await response.json();
const questManagerABI = [/* YOUR_ABI_ARRAY_HERE */];

const questManagerContract = new ethers.Contract(questManagerContractAddress, questManagerABI, signer);

async function loadAvailableQuests() {
    try {
        // Example: Retrieve a quest by its eventId
        const questEventId = 1; // Change this to the actual eventId you want to retrieve
        const quest = await questManagerContract.getQuest(questEventId);
        console.log(quest);
    } catch (error) {
        console.error("Failed to load quests:", error);
    }
}

// Call the function when the page loads
window.addEventListener('load', async () => {
    await loadAvailableQuests();
});
