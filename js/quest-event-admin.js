document.addEventListener('DOMContentLoaded', function() {
 
  // Hamburger menu setup
 document.querySelector('.hamburger-menu').addEventListener('click', function (e) {
  e.preventDefault();
  const menu = document.querySelector('.menu .menu-list');
  if (this.classList.contains('active')) {
      this.classList.remove('active');
      menu.style.display = 'none';
  } else {
      this.classList.add('active');
      menu.style.display = 'block';
  }
});

  // const userQuestEventsContractAddress = "0x9596640e54d4382717dB30946f22152cfA5673fE";
  // const userContractAddress = "0x03DFc1e09395d5875eCF4DF432307BBE62b145bd";
  // const questEventsContractAddress = "0xb20a8C14d4ade65338b468B794f5261D472c2402";
  // const eventsContractAddress = "0x9725CD79109Ee4F956ec9Fa6dCb22BF623c18BF8";
  // const questsContractAddress = "0x113632694bF0E7F1f447046403784d3220C29580";

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

