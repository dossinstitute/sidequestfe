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

	const usersContractAddress = "0x38d4FCfF637332a28dFd10b64598c037f58E65Fe";
	const userQuestEventsContractAddress = "0xB3c43977cC56c606fa895f7e26Df3801b9c2c55A";
	const questEventsContractAddress = "0x6E9A6EE7C83f00EBdB9dA0d075CCEeEd75bab2Ba";
	const eventsContractAddress = "0xceBdF22a2cabE08a58C380b1307C98aBB3be26a4";
	const questsContractAddress = "0xFF0A37a6BB9bBe0D6a26eb42EC6f44b5497a59f6";

  async function fetchEventsABI() {
    console.log(`quest event fetchEventsABI`);
    let response = await fetch('Events.json');
    const data = await response.json();
    return data.abi;
  }

  async function fetchQuestsABI() {
    console.log(`quest event fetchQuestsABI`);
    let response = await fetch('Quests.json');
    const data = await response.json();
    return data.abi;
  }

  async function fetchQuestEventsABI() {
    console.log(`quest event fetchQuestEventsABI`);
    let response = await fetch('QuestEvents.json');
    const data = await response.json();
    return data.abi;
  }

  async function initializeEventsContractLocal() {
    console.log(`quest event initializeEventsContract`);
    const eventsABI = await fetchEventsABI();
    console.log(`eventsABI ${eventsABI}`);
    console.log('Provider before eventsContract:', provider);
    const eventsContract = new ethers.Contract(eventsContractAddress, eventsABI, signer);
    console.log(`initializeEventsContract quest event after events contract`);
    return eventsContract;
  }

  async function initializeQuestsContract() {
    console.log(`quest event initializeQuestsContract`);
    const questsABI = await fetchQuestsABI();
    const questsContract = new ethers.Contract(questsContractAddress, questsABI, signer);
    return questsContract;
  }

  async function initializeQuestEventsContract() {
    console.log(`quest event initializeQuestEventsContract`);
    const questEventsABI = await fetchQuestEventsABI();
    const questEventsContract = new ethers.Contract(questEventsContractAddress, questEventsABI, signer);
    return questEventsContract;
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

  async function fetchAndPopulateEvents() {
    console.log(`fetchAndPopulateEvents`);
    await connectWallet();
    // const eventsContract = await initializeEventsContract();
    const eventsContract = await initializeEventsContractLocal();

    console.log(`before getEventCount`);
		console.log("Available eventsContract Functions:", eventsContract.functions); // Log available functions
    const eventCount = await eventsContract.getEventCount();
    console.log(`after getEventCount`);
    const eventSelect = document.getElementById('event-id');

    for (let i = 0; i < eventCount; i++) {
      const event = await eventsContract.getEventByIndex(i);
      const option = document.createElement('option');
      option.value = event.eventId;
      option.textContent = `${event.name} (${event.eventId})`;
      eventSelect.appendChild(option);
    }
  }

  async function fetchAndPopulateQuests() {
    console.log(`fetchAndPopulateQuests`);
    await connectWallet();
    const questsContract = await initializeQuestsContract();
    console.log(`fetchAndPopulateQuests questsContract.getQuestCount`);
		console.log("Available questsContract Functions:", questsContract.functions); // Log available functions
    const questCount = await questsContract.getQuestCount();
    console.log(`fetchAndPopulateQuests questCount ${questCount}`);
    const questSelect = document.getElementById('quest-id');

    for (let i = 0; i < questCount; i++) {
      const quest = await questsContract.getQuestByIndex(i);
      const option = document.createElement('option');
      option.value = quest.questId;
      option.textContent = `${quest.name} (${quest.questId})`;
      questSelect.appendChild(option);
    }
  }

  async function fetchQuestEvents() {
    console.log(`fetchQuestEvents`);
    await connectWallet();
    const questEventsContract = await initializeQuestEventsContract();
    const questEventList = document.getElementById('quest-event-list');
    const questEventCount = await questEventsContract.getQuestEventCount();

    let questEvents = [];
    for (let i = 0; i < questEventCount; i++) {
      const questEvent = await questEventsContract.readQuestEvent(i + 1); // Adjust for 1-based indexing
      questEvents.push(questEvent);
    }
    populateQuestEventList(questEvents);
  }

  function populateQuestEventList(questEvents) {
    console.log(`populateQuestEventList`);
    const questEventList = document.getElementById('quest-event-list');
    questEventList.innerHTML = '';

    questEvents.forEach(questEvent => {
      const listItem = document.createElement('li');
      listItem.className = 'quest-event-item';
      listItem.innerHTML = `
        <div class="quest-event-id">Quest Event ID: <span>${questEvent.questEventId}</span></div>
        <div class="event-id">Event ID: <span>${questEvent.eventId}</span></div>
        <div class="quest-id">Quest ID: <span>${questEvent.questId}</span></div>
      `;
      listItem.addEventListener('click', () => handleQuestEventSelection(questEvent, listItem));
      questEventList.appendChild(listItem);
    });
  }

  function handleQuestEventSelection(questEvent, listItem) {
    console.log(`Quest Event ${questEvent.questEventId} selected`);

    document.getElementById('quest-event-id').value = questEvent.questEventId;
    document.getElementById('event-id').value = questEvent.eventId;
    document.getElementById('quest-id').value = questEvent.questId;
    document.getElementById('minimum-interactions').value = questEvent.minimumInteractions;
    // Convert Unix timestamp to yyyy-MM-dd format
    const startDate = new Date(questEvent.startDate * 1000).toISOString().split('T')[0];
    const endDate = new Date(questEvent.endDate * 1000).toISOString().split('T')[0];
    
    document.getElementById('start-date').value = startDate;
    document.getElementById('end-date').value = endDate;

    document.getElementById('reward-amount').value = questEvent.rewardAmount;
    document.getElementById('url-hash-tags').value = questEvent.urlHashTags;

    const questEventItems = document.querySelectorAll('#quest-event-list li');
    questEventItems.forEach(item => item.classList.remove('selected'));
    listItem.classList.add('selected');
  }

  async function createQuestEvent() {
    await connectWallet();
    const questEventsContract = await initializeQuestEventsContract();
    // Get values from form fields
    const eventIdStr = document.getElementById('event-id').value;
    const questIdStr = document.getElementById('quest-id').value;
    const minimumInteractionsStr = document.getElementById('minimum-interactions').value;
    const startDateStr = document.getElementById('start-date').value;
    const endDateStr = document.getElementById('end-date').value;
    const rewardAmountStr = document.getElementById('reward-amount').value;
    const urlHashTags = document.getElementById('url-hash-tags').value;

    // Convert string values to uint256
    // Convert string values to uint256
    const eventId = ethers.BigNumber.from(eventIdStr);
    const questId = ethers.BigNumber.from(questIdStr);
    const minimumInteractions = ethers.BigNumber.from(minimumInteractionsStr);
    
    // Convert date strings to Unix timestamps
    const startDate = ethers.BigNumber.from(Math.floor(new Date(startDateStr).getTime() / 1000));
    const endDate = ethers.BigNumber.from(Math.floor(new Date(endDateStr).getTime() / 1000));
    
    const rewardAmount = ethers.BigNumber.from(rewardAmountStr);


    try {
      const txResponse = await questEventsContract.createQuestEvent(eventId, questId, minimumInteractions, startDate, endDate, rewardAmount, urlHashTags);
      console.log(`Quest Event creation transaction hash: ${txResponse.hash}`);
      await txResponse.wait();
      console.log('Quest Event created successfully');
      alert('Quest Event created successfully');
      fetchQuestEvents(); // Refresh quest event list
    } catch (error) {
      console.error('Error creating quest event:', error);
    }
  }

  async function updateQuestEvent() {
    await connectWallet();
    const questEventsContract = await initializeQuestEventsContract();
    const questEventIdStr = document.getElementById('quest-event-id').value;
    const eventIdStr = document.getElementById('event-id').value;
    const questIdStr = document.getElementById('quest-id').value;
    const minimumInteractionsStr = document.getElementById('minimum-interactions').value;
    const startDateStr = document.getElementById('start-date').value;
    const endDateStr = document.getElementById('end-date').value;
    const rewardAmountStr = document.getElementById('reward-amount').value;
    const urlHashTags = document.getElementById('url-hash-tags').value;

    // Convert string values to uint256
    // Convert string values to uint256
    const questEventId = ethers.BigNumber.from(questEventIdStr);
    const eventId = ethers.BigNumber.from(eventIdStr);
    const questId = ethers.BigNumber.from(questIdStr);
    const minimumInteractions = ethers.BigNumber.from(minimumInteractionsStr);
    
    // Convert date strings to Unix timestamps
    const startDate = ethers.BigNumber.from(Math.floor(new Date(startDateStr).getTime() / 1000));
    const endDate = ethers.BigNumber.from(Math.floor(new Date(endDateStr).getTime() / 1000));
    
    const rewardAmount = ethers.BigNumber.from(rewardAmountStr);

    try {
      const txResponse = await questEventsContract.updateQuestEvent(questEventId, eventId, questId, minimumInteractions, startDate, endDate, rewardAmount, urlHashTags);
      console.log(`Quest Event update transaction hash: ${txResponse.hash}`);
      await txResponse.wait();
      console.log('Quest Event updated successfully');
      alert('Quest Event updated successfully');
      fetchQuestEvents(); // Refresh quest event list
    } catch (error) {
      console.error('Error updating quest event:', error);
    }
  }

  async function deleteQuestEvent() {
    await connectWallet();
    const questEventsContract = await initializeQuestEventsContract();
    const questEventId = document.getElementById('quest-event-id').value;

    try {
      const txResponse = await questEventsContract.deleteQuestEvent(questEventId);
      console.log(`Quest Event delete transaction hash: ${txResponse.hash}`);
      await txResponse.wait();
      console.log('Quest Event deleted successfully');
      alert('Quest Event deleted successfully');
      fetchQuestEvents(); // Refresh quest event list
    } catch (error) {
      console.error('Error deleting quest event:', error);
    }
  }

  document.getElementById('new-quest-event').addEventListener('click', clearFormFields);
  document.getElementById('create-quest-event').addEventListener('click', createQuestEvent);
  document.getElementById('update-quest-event').addEventListener('click', updateQuestEvent);
  document.getElementById('delete-quest-event').addEventListener('click', deleteQuestEvent);

  function clearFormFields() {
    document.getElementById('quest-event-form').reset();
  }

  async function initializePage() {
    try {
      await connectWallet();
      await fetchAndPopulateEvents();
      await fetchAndPopulateQuests();
      await fetchQuestEvents();
    } catch (error) {
      console.error("Failed to initialize page:", error);
    }
  }

  initializePage();
});

