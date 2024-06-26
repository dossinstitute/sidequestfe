document.addEventListener('DOMContentLoaded', function() {

    (function() {
        'use strict';
        $('.hamburger-menu').click(function(e) {
            e.preventDefault();
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $('.menu .menu-list').slideToggle('slow', 'swing');
            } else {
                $(this).addClass('active');
                $('.menu .menu-list').slideToggle('slow', 'swing');
            }
        });
    })();

async function fetchQuests() {
		console.log("fetchQuests");
        await connectWallet(); // Ensure wallet is connected before proceeding
			const questManagerContract = await initializeQuestContract(); // Ensure contract is initialized before calling methods

	let quests = [];
				console.log('Provider before questManagerContract:', provider);
	const questCount = await questManagerContract.getQuestCount();
		console.log(`fetch questCount: ${JSON.stringify(questCount, null, 2)}`);
	for (let i = 0; i < questCount; i++) {
		const quest = await questManagerContract.getQuestByIndex(i);
		console.log(`fetch quest: ${JSON.stringify(quest, null, 2)}`);
		quests.push({
			id: quest.questId.toNumber(),
			eventId: quest.eventId.toNumber(),
			startDate: new Date(quest.startDate * 1000).toISOString().split('T')[0],
			endDate: new Date(quest.endDate * 1000).toISOString().split('T')[0],
			interactions: quest.requiredInteractions,
			rewardType: quest.rewardType,
		});
	}
		console.log(`fetch quests: ${JSON.stringify(quests, null, 2)}`);
	return quests;
}

// // Example quests array
// const quests = [
// 		{ id: 1, startDate: '2024-06-25', endDate: '2024-06-30', interactions: 5, rewardType: 'NFT' },
// 		{ id: 2, startDate: '2024-07-01', endDate: '2024-07-15', interactions: 3, rewardType: 'Token' },
// 		// Add more quests as needed
// ];

async function populateQuestList(quests) {
		// const quests = fetchQuests();
		console.log(`quests: ${JSON.stringify(quests, null, 2)}`);
		const questList = document.getElementById('quest-list');

		quests.forEach(quest => {
				const listItem = document.createElement('li');
				listItem.innerHTML = `
						<div class="quest-id">Quest ID: <span>${quest.id}</span></div>
						<div class="quest-dates">Start Date: <span>${quest.startDate}</span> | End Date: <span>${quest.endDate}</span></div>
						<div class="quest-interactions">Interactions: <span>${quest.interactions}</span></div>
						<div class="quest-reward">Reward: <span>${quest.rewardType}</span>
				`;
				listItem.addEventListener('click', () => handleQuestSelection(quest, listItem)); // Add click listener
				questList.appendChild(listItem);
		});
}

function handleQuestSelection(quest, listItem) {
		console.log(`Quest ${quest.id} selected`);

		// Populate the form fields with the selected quest's details
		document.getElementById('event-id').value = quest.eventId.toString();
		document.getElementById('start-date').value = quest.startDate;
		document.getElementById('end-date').value = quest.endDate;
		document.getElementById('interactions').value = quest.interactions.toString();
		document.getElementById('reward-details').value = quest.rewardType;

		// Optionally, enable/disable buttons based on the action (create/update/delete)
		// For simplicity, we'll assume this is for updating a quest
		// document.getElementById('update-quest').disabled = false;
		// document.getElementById('create-quest').disabled = true;
		// document.getElementById('delete-quest').disabled = false;

		// Highlight the selected quest in the list
		const questItems = document.querySelectorAll('#quest-list li');
		questItems.forEach(item => item.classList.remove('selected'));
		listItem.classList.add('selected'); // Assuming listItem is the clicked element
}

// populateQuestList(quests);

//  populateQuestList(quests);
async function initializeQuestList() {
		console.log("initializeQuestList");
  try {
    const quests = await fetchQuests();
    console.log("const quests = await fetchQuests();");
    await populateQuestList(quests);
  } catch (error) {
    console.error("Failed to fetch or populate quests:", error);
  }
}

initializeQuestList(); 



  function clearFormFields() {
    // Select all input elements within the form
    var inputs = document.querySelectorAll('#quest-form input');

    // Loop through each input element and set its value to an empty string
    inputs.forEach(function(input) {
      input.value = '';
    });

    // Clear the select dropdown
    var select = document.querySelector('#quest-form select');
    select.selectedIndex = 0; // Reset to the first option
  }

  // Example usage: Call clearFormFields() when needed, e.g., after submitting the form
  // Or, you can attach it to a button click event like so:
  document.getElementById('new-quest').addEventListener('click', clearFormFields);

async function updateQuest(seventId, sstartDate, sendDate, srequiredInteractions, rewardType) {
	// Get the current signer (the connected wallet)

			const eventId = parseInt(seventId, 10);
			const dstartDate= new Date(sstartDate);
			const startDate = Math.floor(dstartDate.getTime() / 1000);
			const dendDate= new Date(sendDate);
			const endDate= Math.floor(dendDate.getTime() / 1000);
			const requiredInteractions = parseInt(srequiredInteractions, 10);

			const questManagerContract = await initializeQuestContract(); // Ensure contract is initialized before calling methods
		const questcontracttx = questManagerContract.updateQuest(eventId, startDate, endDate, requiredInteractions, rewardType)
				console.log(`quest Transaction hash: ${questcontracttx.hash}`);
}

document.getElementById('update-quest').addEventListener('click', function() {
  // Retrieve values from the form fields
  const eventId = document.getElementById('event-id').value;
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const requiredInteractions = document.getElementById('interactions').value;
  const rewardDetails = document.getElementById('reward-details').value;

  // Call the updateQuest function with the retrieved values
  updateQuest(eventId, startDate, endDate, requiredInteractions, rewardDetails);
});

async function deleteQuest(seventId) {

		const eventId = parseInt(seventId, 10);
		const questManagerContract = await initializeQuestContract(); // Ensure contract is initialized before calling methods
		const questcontracttx = questManagerContract.deleteQuest(eventId)
		console.log(`quest Transaction hash: ${questcontracttx.hash}`);
}

document.getElementById('delete-quest').addEventListener('click', function() {
  // Retrieve values from the form fields
  const eventId = document.getElementById('event-id').value;
  deleteQuest(eventId);
});

	const questform = document.getElementById('create-quest');
	if (questform) {
    questform.addEventListener('click', async function() {
			event.preventDefault();
			const seventId = document.getElementById('event-id').value;
			const eventId = parseInt(seventId, 10);
			const sstartDate= document.getElementById('start-date').value;
			const dstartDate= new Date(sstartDate);
			const startDate = Math.floor(dstartDate.getTime() / 1000);
			const sendDate= document.getElementById('end-date').value;
			const dendDate= new Date(sendDate);
			const endDate= Math.floor(dendDate.getTime() / 1000);
			const srequiredInteractions = document.getElementById('interactions').value;
			const requiredInteractions = parseInt(srequiredInteractions, 10);
			const rewardType = document.getElementById('reward-details').value;


			const questManagerContract = await initializeQuestContract(); // Ensure contract is initialized before calling methods
			try {
				const txResponse = await questManagerContract.createQuest(eventId, startDate, endDate, requiredInteractions, rewardType)
				console.log(`quest Transaction hash: ${txResponse.hash}`);

				await txResponse.wait(); // Wait for the transaction to be mined

				console.log('quest Transaction mined successfully.');

				// Extract the event logs from the transaction receipt
				console.log('Provider before getTransactionReceipt:', provider);
				const receipt = await provider.getTransactionReceipt(txResponse.hash);
				console.log(`quest receipt: ${receipt}`);

				// Filter out the EventCreated event logs
				// const iface = new ethers.utils.Interface(["event QuestCreated(uint256 eventId, uint256 startTime, uint256 endTime, string description)"]);
				const iface = new ethers.utils.Interface([
					"event QuestCreated(uint256 questId, uint256 eventId, uint256 startDate, uint256 endDate, uint256 requiredInteractions, string rewardType)"
					]);
				const questCreatedLogs = receipt.logs.filter(log => {
					try {
						iface.parseLog(log);
						console.log("iface.parseLog(log);");
						return true;
					} catch (error) {
						console.log("failed iface.parseLog(log);");
						return false;
					}
				});
				if (questCreatedLogs.length > 0) {
					const log = questCreatedLogs[0];
					const parsedLog = iface.parseLog(log);
					if (parsedLog && parsedLog.args) {
						const { args } = parsedLog;
						console.log(`QuestCreated emitted with Quest ID: ${args.questId?.toString()}, Event ID: ${args.eventId?.toString()}, Start Time: ${args.startDate?.toString()}, End Time: ${args.endDate?.toString()}, Required Interactions: ${args.requiredInteractions?.toString()}, Reward Type: ${args.rewardType}`);
						alert('Quest Created');
						} else {
							console.log('QuestCreated event not found in transaction receipt or failed to parse.');
							}

					} else {
						console.log('QuestCreated event not found in transaction receipt.');
						}

				} 
			catch (error) {
				console.error('Error creating quest:', error.message);
				}
			});
		} else {
			console.error('Element with ID "create-quest" not found');
			}
});
