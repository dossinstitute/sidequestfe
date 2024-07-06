document.addEventListener('DOMContentLoaded', function () {
  (function () {
    'use strict';
    $('.hamburger-menu').click(function (e) {
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

  // const userQuestEventsContractAddress = "0x9596640e54d4382717dB30946f22152cfA5673fE";
  // const userContractAddress = "0x03DFc1e09395d5875eCF4DF432307BBE62b145bd";
  // const questEventsContractAddress = "0xb20a8C14d4ade65338b468B794f5261D472c2402";
  // const eventsContractAddress = "0x9725CD79109Ee4F956ec9Fa6dCb22BF623c18BF8";
  // const questsContractAddress = "0x113632694bF0E7F1f447046403784d3220C29580";

  async function fetchEventsABI() {
    let response = await fetch('Events.json');
    const data = await response.json();
    return data.abi;
  }

  async function fetchQuestsABI() {
    let response = await fetch('Quests.json');
    const data = await response.json();
    return data.abi;
  }

  async function fetchQuestEventsABI() {
    let response = await fetch('QuestEvents.json');
    const data = await response.json();
    return data.abi;
  }

  async function fetchUserQuestEventsABI() {
    let response = await fetch('UserQuestEvents.json');
    const data = await response.json();
    return data.abi;
  }

  async function initializeEventsContract() {
    const eventsABI = await fetchEventsABI();
    const eventsContract = new ethers.Contract(eventsContractAddress, eventsABI, signer);
    return eventsContract;
  }

  async function initializeQuestsContract() {
    const questsABI = await fetchQuestsABI();
    const questsContract = new ethers.Contract(questsContractAddress, questsABI, signer);
    return questsContract;
  }

  async function initializeQuestEventsContract() {
    const questEventsABI = await fetchQuestEventsABI();
    const questEventsContract = new ethers.Contract(questEventsContractAddress, questEventsABI, signer);
    return questEventsContract;
  }

  async function initializeUserQuestEventsContract() {
	  console.log("quest interactions initializeUserQuestEventsContract")
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
		console.log(`user quest eventfetchAndPopulateQuestEvents`);
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
	  console.log("quest interactions fetchUserQuestEvents")
    await connectWallet();
    const userQuestEventsContract = await initializeUserQuestEventsContract();
    const userQuestEventList = document.getElementById('user-quest-event-list');
    const accounts = await provider.listAccounts();
    const userAddress = accounts[0];

    try {
			console.log("quest interactions before userQuestEventsContract.getUserQuestsByWallet")
      const userQuestEvents = await userQuestEventsContract.getUserQuestsByWallet(userAddress, usersContractAddress);
      populateUserQuestEventList(userQuestEvents);
    } catch (err) {
      console.error("Error fetching user quest events:", err);
    }
  }

  function populateUserQuestEventList(userQuestEvents) {
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
    document.getElementById('user-quest-event-id').value = userQuestEvent.userQuestEventId;
    document.getElementById('user-id').value = userQuestEvent.userId;
    document.getElementById('quest-event-id').value = userQuestEvent.questEventId;
    document.getElementById('interactions').value = userQuestEvent.interactions;
    document.getElementById('url').value = userQuestEvent.url;

    const userQuestEventItems = document.querySelectorAll('#user-quest-event-list li');
    userQuestEventItems.forEach(item => item.classList.remove('selected'));
    listItem.classList.add('selected');
  }

  async function updateUserQuestEvent() {
    await connectWallet();
    const userQuestEventsContract = await initializeUserQuestEventsContract();

    const userQuestEventId = ethers.BigNumber.from(document.getElementById('user-quest-event-id').value);
    const userId = ethers.BigNumber.from(document.getElementById('user-id').value);
    const questEventId = ethers.BigNumber.from(document.getElementById('quest-event-id').value);
    const interactions = ethers.BigNumber.from(document.getElementById('interactions').value);
    const url = document.getElementById('url').value;

    try {
      const txResponse = await userQuestEventsContract.updateUserQuestEvent(userQuestEventId, questEventId, userId, interactions, false, url, false);
      console.log(`User Quest Event update transaction hash: ${txResponse.hash}`);
      await txResponse.wait();
      console.log('User Quest Event updated successfully');
      alert('User Quest Event updated successfully');
      fetchUserQuestEvents(); // Refresh user quest event list
    } catch (error) {
      console.error('Error updating user quest event:', error);
    }
  }

  document.getElementById('update-user-quest-event').addEventListener('click', updateUserQuestEvent);

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

