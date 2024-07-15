document.addEventListener('DOMContentLoaded', async function() {
  // Hamburger menu functionality
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

  const questEventsContractAddress = "0xeb6EEbb7bA7C56Cc76F0a84BE166Ff2148450266";
  const eventsContractAddress = "0x9725CD79109Ee4F956ec9Fa6dCb22BF623c18BF8";
  const questsContractAddress = "0x113632694bF0E7F1f447046403784d3220C29580";
  const contentCreatorQuestAddress = "0x42e893Cd22aBA1851DD18E6bF922397e98545D23"; // Updated contract address

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

  async function fetchContentCreatorQuestABI() {
    console.log(`content creator quest fetchContentCreatorQuestABI`);
    let response = await fetch('ContentCreatorQuest.json');
    const data = await response.json();
    return data.abi;
  }

  async function initializeEventsContract() {
    console.log(`quest event initializeEventsContract`);
    const eventsABI = await fetchEventsABI();
    const eventsContract = new ethers.Contract(eventsContractAddress, eventsABI, signer);
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

  async function initializeContentCreatorQuestContract() {
    console.log(`content creator quest initializeContentCreatorQuestContract`);
    const contentCreatorQuestABI = await fetchContentCreatorQuestABI();
    const contentCreatorQuestContract = new ethers.Contract(contentCreatorQuestAddress, contentCreatorQuestABI, signer);
    return contentCreatorQuestContract;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer;
  let contentCreatorQuestContract;

  async function connectWallet() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' }); 
      signer = provider.getSigner();
      contentCreatorQuestContract = await initializeContentCreatorQuestContract();
      console.log("Connected to wallet");
    } catch (error) {
      console.error("User rejected request to connect wallet:", error);
    }   
  }

  async function fetchAndPopulateEvents() {
    console.log(`fetchAndPopulateEvents`);
    await connectWallet();
    const eventsContract = await initializeEventsContract();

    console.log("Available eventsContract Functions:", eventsContract.functions); // Log available functions
    const eventCount = await eventsContract.getEventCount();
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
    console.log("Available questsContract Functions:", questsContract.functions); // Log available functions
    const questCount = await questsContract.getQuestCount();
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
    document.getElementById('expiration-time').value = questEvent.expirationTime;
    document.getElementById('min-submissions').value = questEvent.minSubmissions;
    document.getElementById('required-hashtags').value = questEvent.requiredHashtags.join(', ');
    document.getElementById('require-hashtags').checked = questEvent.requireHashtags;

    const questEventItems = document.querySelectorAll('#quest-event-list li');
    questEventItems.forEach(item => item.classList.remove('selected'));
    listItem.classList.add('selected');

    updateQuestStatus(questEvent.questId);
  }

  async function updateQuestStatus(questId) {
    const questStatus = await contentCreatorQuestContract.quests(questId);
    const parsedQuestData = parseQuestData(questStatus);
    const isActive = parsedQuestData.isActive;
    const isCompleted = parsedQuestData.isCompleted;

    document.getElementById('quest-status').innerText = `Active: ${isActive}, Completed: ${isCompleted}`;
    document.getElementById('initialize-quest').disabled = isCompleted || isActive;
    document.getElementById('submit-content').disabled = !isActive || isCompleted;
  }

  fetchQuestEvents();
  fetchAndPopulateEvents();
  fetchAndPopulateQuests();

  document.getElementById('initialize-quest').addEventListener('click', async () => {
    await connectWallet();
    const questId = document.getElementById('quest-id').value;
    try {
      await initializeQuest(questId);
    } catch (error) {
      handleError(error);
    }
  });

  document.getElementById('submit-content').addEventListener('click', async () => {
    await connectWallet();
    const questId = document.getElementById('quest-id').value;
    try {
      await submitContent(questId);
    } catch (error) {
      handleError(error);
    }
  });

  document.getElementById('check-submissions').addEventListener('click', async () => {
    await connectWallet();
    const questId = document.getElementById('quest-id').value;
    try {
      await checkSubmissions(questId);
    } catch (error) {
      handleError(error);
    }
  });

  document.getElementById('check-quest-active').addEventListener('click', async () => {
    await connectWallet();
    const questId = document.getElementById('quest-id').value;
    try {
      await checkQuestActive(questId);
    } catch (error) {
      handleError(error);
    }
  });

  document.getElementById('check-quest-completed').addEventListener('click', async () => {
    await connectWallet();
    const questId = document.getElementById('quest-id').value;
    try {
      await checkQuestCompleted(questId);
    } catch (error) {
      handleError(error);
    }
  });

  async function initializeQuest(questId) {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const expirationTime = currentTimestamp + 86400; // 1 day in the future
    const minSubmissions = document.getElementById('min-submissions').value;
    const requiredHashtags = document.getElementById('required-hashtags').value.split(', ');
    const requireHashtags = document.getElementById('require-hashtags').checked;

    console.log("Initializing quest with params:", {
      questId, expirationTime, minSubmissions, requiredHashtags, requireHashtags
    });

    const tx = await contentCreatorQuestContract.initializeContentCreatorQuest(
      questId, expirationTime, minSubmissions, requiredHashtags, requireHashtags, {
      gasLimit: 1000000 // Ensure sufficient gas
    });
    const receipt = await tx.wait();

    parseLogs(receipt.logs);

    console.log("Quest initialized:", questId);
    document.getElementById('output').innerText = `Quest initialized with ID: ${questId}`;

    const questStatus = await contentCreatorQuestContract.quests(questId);
    console.log("Quest status after initialization:", questStatus);

    updateQuestStatus(questId);
  }

  async function submitContent(questId) {
    const contentUrl = document.getElementById('content-url').value;
    const hashtags = document.getElementById('content-hashtags').value.split(', ');

    const questStatus = await contentCreatorQuestContract.quests(questId);
    console.log("Quest status before submission:", questStatus);
    const parsedQuestData = parseQuestData(questStatus);
    console.log("Parsed Quest Data: ", parsedQuestData);

    if (!parsedQuestData.isActive || parsedQuestData.isCompleted) {
      throw new Error("Quest is either inactive or already completed.");
    }

    const contentData = ethers.utils.defaultAbiCoder.encode(["string", "string[]"], [contentUrl, hashtags]);
    const tx = await contentCreatorQuestContract.interact(questId, await signer.getAddress(), "submit", contentData, {
      gasLimit: 500000 // Ensure sufficient gas
    });
    const receipt = await tx.wait();

    parseLogs(receipt.logs);

    console.log("Content submitted:", contentUrl);
    document.getElementById('output').innerText = `Content submitted: ${contentUrl}`;

    updateQuestStatus(questId);
  }

  async function checkSubmissions(questId) {
    const submissions = await contentCreatorQuestContract.getContentSubmissions(questId);
    console.log("Submissions:", submissions);
    document.getElementById('output').innerText = `Submissions: ${JSON.stringify(submissions)}`;
  }

  async function checkQuestActive(questId) {
    const questStatus = await contentCreatorQuestContract.quests(questId);
    const parsedQuestData = parseQuestData(questStatus);
    const isActive = parsedQuestData.isActive;
    console.log("Quest active status:", isActive);
    document.getElementById('output').innerText = `Quest active status: ${isActive}`;
  }

  async function checkQuestCompleted(questId) {
    const questStatus = await contentCreatorQuestContract.quests(questId);
    const parsedQuestData = parseQuestData(questStatus);
    const isCompleted = parsedQuestData.isCompleted;
    console.log("Quest completed status:", isCompleted);
    document.getElementById('output').innerText = `Quest completed status: ${isCompleted}`;
  }

  function parseLogs(logs) {
    logs.forEach(log => {
      try {
        const parsedLog = contentCreatorQuestContract.interface.parseLog(log);
        if (parsedLog.name === 'Debug') {
          console.log('Debug event:', parsedLog.args.message);
        }
        if (parsedLog.name === 'DebugAddress') {
          console.log('DebugAddress event:', parsedLog.args.addr);
        }
        if (parsedLog.name === 'DebugUint256') {
          console.log('DebugUint256 event:', parsedLog.args.value);
        }
        if (parsedLog.name === 'DebugString') {
          console.log('DebugString event:', parsedLog.args.value);
        }
      } catch (e) {
        // Ignore logs that cannot be parsed
      }
    });
  }

  function parseQuestData(questStatus) {
    return {
      questId: questStatus[0].toString(),
      data: questStatus[1],
      isInitialized: questStatus[2],
      isActive: questStatus[3],
      isCompleted: questStatus[4],
      initiator: questStatus[5],
      expirationTime: questStatus[6].toString(),
      questContract: questStatus[7]
    };
  }

  function handleError(error) {
    console.error("Error:", error);
    document.getElementById('output').innerText = `Error: ${error.message || error}`;
  }
});

