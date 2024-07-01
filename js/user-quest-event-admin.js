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

	const userQuestEventsContractAddress = "0xB3c43977cC56c606fa895f7e26Df3801b9c2c55A";
	const questEventsContractAddress = "0x6E9A6EE7C83f00EBdB9dA0d075CCEeEd75bab2Ba";
	const eventsContractAddress = "0xceBdF22a2cabE08a58C380b1307C98aBB3be26a4";
	const questsContractAddress = "0xFF0A37a6BB9bBe0D6a26eb42EC6f44b5497a59f6";

	async function fetchEventsABI() {
		console.log(`fetchEventsABI`);
		let response = await fetch('Events.json');
		const data = await response.json();
		return data.abi;
	}

	async function fetchQuestsABI() {
		console.log(`fetchQuestsABI`);
		let response = await fetch('Quests.json');
		const data = await response.json();
		return data.abi;
	}

	async function fetchQuestEventsABI() {
		console.log(`fetchQuestEventsABI`);
		let response = await fetch('QuestEvents.json');
		const data = await response.json();
		return data.abi;
	}

	async function fetchUserQuestEventsABI() {
		console.log(`fetchUserQuestEventsABI`);
		let response = await fetch('UserQuestEvents.json');
		const data = await response.json();
		return data.abi;
	}

	async function initializeEventsContract() {
		console.log(`initializeEventsContract`);
		const eventsABI = await fetchEventsABI();
		const eventsContract = new ethers.Contract(eventsContractAddress, eventsABI, signer);
		return eventsContract;
	}

	async function initializeQuestsContract() {
		console.log(`initializeQuestsContract`);
		const questsABI = await fetchQuestsABI();
		const questsContract = new ethers.Contract(questsContractAddress, questsABI, signer);
		return questsContract;
	}

	async function initializeQuestEventsContract() {
		console.log(`initializeQuestEventsContract`);
		const questEventsABI = await fetchQuestEventsABI();
		const questEventsContract = new ethers.Contract(questEventsContractAddress, questEventsABI, signer);
		return questEventsContract;
	}

	async function initializeUserQuestEventsContract() {
		console.log(`initializeUserQuestEventsContract`);
		const userQuestEventsABI = await fetchUserQuestEventsABI();
		const userQuestEventsContract = new ethers.Contract(userQuestEventsContractAddress, userQuestEventsABI, signer);
		return userQuestEventsContract;
	}

	const provider = new ethers.providers.Web3Provider(window.ethereum);
	let signer;

	async function connectWallet() {
		try {
			await window.ethereum.request({ method: 'eth_requestAccounts' });
			signer = provider.getSigner();
		} catch (error) {
			console.error("User rejected request to connect wallet:", error);
		}
	}

	async function fetchAndPopulateQuestEvents() {
		console.log(`fetchAndPopulateQuestEvents`);
		await connectWallet();
		const questEventsContract = await initializeQuestEventsContract();

		try {
			const questEventCount = await questEventsContract.getQuestEventCount();
			const questEventSelect = document.getElementById('quest-event-id');

			for (let i = 0; i < questEventCount; i++) {
				try {
					const questEvent = await questEventsContract.readQuestEvent(i + 1); // Adjust for 1-based indexing
					const eventId = questEvent.eventId;
					const questId = questEvent.questId;

					const eventsContract = await initializeEventsContract();
					const questsContract = await initializeQuestsContract();
					const event = await eventsContract.readEvent(eventId);
					const quest = await questsContract.readQuest(questId);

					const option = document.createElement('option');
					option.value = questEvent.questEventId;
					option.textContent = `${event.name} - ${quest.name} (${questEvent.questEventId})`;
					questEventSelect.appendChild(option);
				} catch (err) {
					console.error(`Error reading quest event at index ${i + 1}:`, err);
				}
			}
		} catch (err) {
			console.error("Error fetching quest events:", err);
		}
	}

	async function fetchUserQuestEvents() {
		console.log(`fetchUserQuestEvents`);
		await connectWallet();
		const userQuestEventsContract = await initializeUserQuestEventsContract();
		const userQuestEventList = document.getElementById('user-quest-event-list');

		try {
			console.log("Available userQuestEventsContract Functions:", userQuestEventsContract.functions); // Log available functions
			const userQuestEventCount = await userQuestEventsContract.getUserQuestEventCount();
		console.log(`userQuestEventCount ${userQuestEventCount}`);
			let userQuestEvents = [];
			for (let i = 0; i < userQuestEventCount; i++) {
				try {
					const userQuestEvent = await userQuestEventsContract.readUserQuestEvent(i + 1); // Adjust for 1-based indexing
					userQuestEvents.push(userQuestEvent);
				} catch (err) {
					console.error(`Error reading user quest event at index ${i + 1}:`, err);
				}
			}
			populateUserQuestEventList(userQuestEvents);
		} catch (err) {
			console.error("Error fetching user quest events:", err);
		}
	}

	function populateUserQuestEventList(userQuestEvents) {
		console.log(`populateUserQuestEventList`);
		const userQuestEventList = document.getElementById('user-quest-event-list');
		userQuestEventList.innerHTML = '';

		userQuestEvents.forEach(userQuestEvent => {
			const listItem = document.createElement('li');
			listItem.className = 'user-quest-event-item';
			listItem.innerHTML = `
				<div class="user-quest-event-id">User Quest Event ID: <span>${userQuestEvent.userQuestEventId}</span></div>
				<div class="user-id">User ID: <span>${userQuestEvent.userId}</span></div>
				<div class="quest-event-id">Quest Event ID: <span>${userQuestEvent.questEventId}</span></div>
			`;
			listItem.addEventListener('click', () => handleUserQuestEventSelection(userQuestEvent, listItem));
			userQuestEventList.appendChild(listItem);
		});
	}

	function handleUserQuestEventSelection(userQuestEvent, listItem) {
		console.log(`User Quest Event ${userQuestEvent.userQuestEventId} selected`);

		document.getElementById('user-quest-event-id').value = userQuestEvent.userQuestEventId;
		document.getElementById('user-id').value = userQuestEvent.userId;
		document.getElementById('quest-event-id').value = userQuestEvent.questEventId;
		document.getElementById('interactions').value = userQuestEvent.interactions;
		document.getElementById('validated').checked = userQuestEvent.validated;
		document.getElementById('url').value = userQuestEvent.url;
		document.getElementById('completed').checked = userQuestEvent.completed;

		const userQuestEventItems = document.querySelectorAll('#user-quest-event-list li');
		userQuestEventItems.forEach(item => item.classList.remove('selected'));
		listItem.classList.add('selected');
	}

	async function createUserQuestEvent() {
		await connectWallet();
		const userQuestEventsContract = await initializeUserQuestEventsContract();

		const userId = ethers.BigNumber.from(document.getElementById('user-id').value);
		const questEventId = ethers.BigNumber.from(document.getElementById('quest-event-id').value);
		const interactions = ethers.BigNumber.from(document.getElementById('interactions').value);
		const validated = document.getElementById('validated').checked;
		const url = document.getElementById('url').value;
		const completed = document.getElementById('completed').checked;

		try {
			const txResponse = await userQuestEventsContract.createUserQuestEvent(userId, questEventId, interactions, validated, url, completed);
			console.log(`User Quest Event creation transaction hash: ${txResponse.hash}`);
			await txResponse.wait();
			console.log('User Quest Event created successfully');
			alert('User Quest Event created successfully');
			fetchUserQuestEvents(); // Refresh user quest event list
		} catch (error) {
			console.error('Error creating user quest event:', error);
		}
	}

	async function updateUserQuestEvent() {
		await connectWallet();
		const userQuestEventsContract = await initializeUserQuestEventsContract();

		const userQuestEventId = ethers.BigNumber.from(document.getElementById('user-quest-event-id').value);
		const userId = ethers.BigNumber.from(document.getElementById('user-id').value);
		const questEventId = ethers.BigNumber.from(document.getElementById('quest-event-id').value);
		const interactions = ethers.BigNumber.from(document.getElementById('interactions').value);
		const validated = document.getElementById('validated').checked;
		const url = document.getElementById('url').value;
		const completed = document.getElementById('completed').checked;

		try {
			const txResponse = await userQuestEventsContract.updateUserQuestEvent(userQuestEventId, userId, questEventId, interactions, validated, url, completed);
			console.log(`User Quest Event update transaction hash: ${txResponse.hash}`);
			await txResponse.wait();
			console.log('User Quest Event updated successfully');
			alert('User Quest Event updated successfully');
			fetchUserQuestEvents(); // Refresh user quest event list
		} catch (error) {
			console.error('Error updating user quest event:', error);
		}
	}

	async function deleteUserQuestEvent() {
		await connectWallet();
		const userQuestEventsContract = await initializeUserQuestEventsContract();
		const userQuestEventId = ethers.BigNumber.from(document.getElementById('user-quest-event-id').value);

		try {
			const txResponse = await userQuestEventsContract.deleteUserQuestEvent(userQuestEventId);
			console.log(`User Quest Event delete transaction hash: ${txResponse.hash}`);
			await txResponse.wait();
			console.log('User Quest Event deleted successfully');
			alert('User Quest Event deleted successfully');
			fetchUserQuestEvents(); // Refresh user quest event list
		} catch (error) {
			console.error('Error deleting user quest event:', error);
		}
	}

	document.getElementById('new-user-quest-event').addEventListener('click', clearFormFields);
	document.getElementById('create-user-quest-event').addEventListener('click', createUserQuestEvent);
	document.getElementById('update-user-quest-event').addEventListener('click', updateUserQuestEvent);
	document.getElementById('delete-user-quest-event').addEventListener('click', deleteUserQuestEvent);

	function clearFormFields() {
		document.getElementById('user-quest-event-form').reset();
	}

	async function initializePage() {
		try {
			await connectWallet();
			await fetchAndPopulateQuestEvents();
			await fetchUserQuestEvents();
		} catch (error) {
			console.error("Failed to initialize page:", error);
		}
	}

	initializePage();
});

