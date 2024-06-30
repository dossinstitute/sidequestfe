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
			const questManagerContract = await initializeQuestsContract(); // Ensure contract is initialized before calling methods

	let quests = [];
				console.log('Provider before questManagerContract:', provider);
	const questCount = await questManagerContract.getQuestCount();
		console.log(`fetch questCount: ${JSON.stringify(questCount, null, 2)}`);
	for (let i = 0; i < questCount; i++) {
		const quest = await questManagerContract.getQuestByIndex(i);
		console.log(`fetch quest: ${JSON.stringify(quest, null, 2)}`);
		quests.push({
			id: quest.questId.toNumber(),
			name: quest.name,
			description: quest.description,
			defaultStartDate: new Date(quest.defaultStartDate * 1000).toISOString().split('T')[0],
			defaultEndDate: new Date(quest.defaultEndDate * 1000).toISOString().split('T')[0],
			defaultInteractions: quest.defaultInteractions.toNumber(),
			defaultRewardAmount: quest.defaultRewardAmount.toNumber(),
			status : quest.status
		});
	}
		console.log(`fetch quests: ${JSON.stringify(quests, null, 2)}`);
	return quests;
}

async function populateQuestList(quests) {
		// const quests = fetchQuests();
		console.log(`quests: ${JSON.stringify(quests, null, 2)}`);
		const questList = document.getElementById('quest-list');

		quests.forEach(quest => {
				const listItem = document.createElement('li');
				listItem.innerHTML = `
						<div class="quest-id">Quest ID: <span>${quest.id}</span></div>
						<div class="name">Name: <span>${quest.name}</span></div>
						<div class="description">Description: <span>${quest.description}</span></div>
						<div class="quest-dates">Start Date: <span>${quest.defaultStartDate}</span> | End Date: <span>${quest.defaultEndDate}</span></div>
						<div class="quest-interactions">Default Interactions: <span>${quest.defaultInteractions}</span></div>
						<div class="quest-reward">Reward: <span>${quest.defaultRewardAmount}</span>
						<div class="event-status"> ${quest.status==0 ? 'Active' : 'Inactive'} </div>
				`;
				listItem.addEventListener('click', () => handleQuestSelection(quest, listItem)); // Add click listener
				questList.appendChild(listItem);
		});
}

function handleQuestSelection(quest, listItem) {
		console.log(`Quest ${quest.id} selected`);

		// Populate the form fields with the selected quest's details
		document.getElementById('quest-id').value = quest.id.toString();
		document.getElementById('name').value = quest.name.toString();
		document.getElementById('description').value = quest.description.toString();
		document.getElementById('default-start-date').value = quest.defaultStartDate;
		document.getElementById('default-end-date').value = quest.defaultEndDate;
		document.getElementById('default-interactions').value = quest.defaultInteractions.toString();
		document.getElementById('default-reward-amount').value = quest.defaultRewardAmount;
		document.getElementById('status').value = quest.status.toString();

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

async function updateQuest(squestId, name, description, sstartDate, sendDate, sdefaultInteractions, sdefaultRewardAmount, sstatus) {
	// Get the current signer (the connected wallet)
			console.log(`updateQuest`);
			console.log(`questId: ${squestId}`);
			console.log(`name: ${name}`);
			console.log(`description: ${description}`);
			console.log(`startDate: ${sstartDate}`);
			console.log(`endDate: ${sendDate}`);
			console.log(`defaultInteractions: ${sdefaultInteractions}`);
			console.log(`defaultRewardAmount: ${sdefaultRewardAmount}`);
			console.log(`istatus: ${sstatus}`);

			const questId = parseInt(squestId, 10);
			const dstartDate= new Date(sstartDate);
			const startDate = Math.floor(dstartDate.getTime() / 1000);
			const dendDate= new Date(sendDate);
			const endDate= Math.floor(dendDate.getTime() / 1000);
			const defaultInteractions = parseInt(sdefaultInteractions, 10);
			const defaultRewardAmount = parseInt(sdefaultRewardAmount, 10);
			const istatus = parseInt(sstatus, 10);
			// const istatus = parseInt(1, 10);
			console.log(`questId: ${questId}`);
			console.log(`name: ${name}`);
			console.log(`description: ${description}`);
			console.log(`startDate: ${startDate}`);
			console.log(`endDate: ${endDate}`);
			console.log(`defaultInteractions: ${defaultInteractions}`);
			console.log(`defaultRewardAmount: ${defaultRewardAmount}`);
			console.log(`istatus: ${istatus}`);

			const questManagerContract = await initializeQuestsContract(); // Ensure contract is initialized before calling methods
		const questcontracttx = questManagerContract.updateQuest(questId, name, description, defaultInteractions, startDate, endDate,  defaultRewardAmount, istatus)
				console.log(`quest Transaction hash: ${questcontracttx.hash}`);
}

document.getElementById('update-quest').addEventListener('click', function() {
  // Retrieve values from the form fields
  const questId = document.getElementById('quest-id').value;
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const defaultInteractions = document.getElementById('default-interactions').value;
  const defaultStartDate = document.getElementById('default-start-date').value;
  const defaultEndDate = document.getElementById('default-end-date').value;
  const defaultRewardAmount = document.getElementById('default-reward-amount').value;
  const status = document.getElementById('status').value;

  // Call the updateQuest function with the retrieved values
  updateQuest(questId, name, description, defaultStartDate, defaultEndDate,defaultInteractions,  defaultRewardAmount, status);
});

async function deleteQuest(squestId) {

		const questId = parseInt(squestId, 10);
		const questManagerContract = await initializeQuestsContract(); // Ensure contract is initialized before calling methods
		const questcontracttx = questManagerContract.deleteQuest(questId)
		console.log(`quest Transaction hash: ${questcontracttx.hash}`);
}

document.getElementById('delete-quest').addEventListener('click', function() {
  // Retrieve values from the form fields
  const questId = document.getElementById('quest-id').value;
  deleteQuest(questId);
});

	const questform = document.getElementById('create-quest');
	if (questform) {
    questform.addEventListener('click', async function() {
			event.preventDefault();
			const name = document.getElementById('name').value;
			const description = document.getElementById('description').value;
			const squestId = document.getElementById('quest-id').value;
			const questId = parseInt(squestId, 10);
			const sstartDate= document.getElementById('default-start-date').value;
			const dstartDate= new Date(sstartDate);
			const defaultStartDate = Math.floor(dstartDate.getTime() / 1000);
			const sendDate= document.getElementById('default-end-date').value;
			const dendDate= new Date(sendDate);
			const defaultEndDate= Math.floor(dendDate.getTime() / 1000);
			const srequiredInteractions = document.getElementById('default-interactions').value;
			const defaultInteractions = parseInt(srequiredInteractions, 10);
			const defaultRewardAmount = document.getElementById('default-reward-amount').value;


			const questManagerContract = await initializeQuestsContract(); // Ensure contract is initialized before calling methods
			try {
				const txResponse = await questManagerContract.createQuest(name, description, defaultInteractions, defaultStartDate, defaultEndDate,  defaultRewardAmount)
          // questsContract.createQuest("Quest 1", "Description 1", 10, 1640995200, 1641081600, 1000)
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
