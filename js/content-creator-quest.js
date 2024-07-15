// content-creator-quest.js

document.addEventListener('DOMContentLoaded', async function () {
    console.log('DOM fully loaded and parsed');
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

    let signer, contentCreatorQuestContract, userQuestEventsContract;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const questIdInput = document.getElementById('quest-id');
    const expirationTimeInput = document.getElementById('expiration-time');
    const minSubmissionsInput = document.getElementById('min-submissions');
    const requiredHashtagsInput = document.getElementById('required-hashtags');
    const requireHashtagsInput = document.getElementById('require-hashtags');
    const contentUrlInput = document.getElementById('content-url');
    const contentHashtagsInput = document.getElementById('content-hashtags');
    const eventIdInput = document.getElementById('event-id');
    const minimumInteractionsInput = document.getElementById('minimum-interactions');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const rewardAmountInput = document.getElementById('reward-amount');
    const urlHashTagsInput = document.getElementById('url-hash-tags');
    const output = document.getElementById('output');
    const userQuestEventIdInput = document.getElementById('user-quest-event-id');
    const contentCreatorQuestAddress = "0x91cBc191c5729CBF08E0ed95889eF5a517D777aE";
    const questEventsContractAddress = "0xeb6EEbb7bA7C56Cc76F0a84BE166Ff2148450266";
    const userQuestEventsContractAddress = "0xb60Cf112f4b5846Aa274F9AAe4457EDA9E1491D0";
    const eventsContractAddress = "0x164155E567ee016DEe8F2c26785003c578eA919E";
    const questsContractAddress = "0xcbf7b6da410b8d3f77f9ba600eD9ED689C058a0e";
    const usersContractAddress = "0xF9F98Ee5e4fa000E6Bada4cA6F7fC97Cc2b9301e";

    async function connectWalletByProvider() {
        console.log("connectWalletByProvider called");
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        const contentCreatorQuestABI = await fetchContentCreatorQuestABI();
        const userQuestEventsABI = await fetchUserQuestEventsABI();
        contentCreatorQuestContract = new ethers.Contract(contentCreatorQuestAddress, contentCreatorQuestABI, signer);
        userQuestEventsContract = new ethers.Contract(userQuestEventsContractAddress, userQuestEventsABI, signer);
        console.log("Connected to wallet");
    }

    async function fetchContentCreatorQuestABI() {
        console.log("fetchContentCreatorQuestABI called");
        let response = await fetch('ContentCreatorQuest.json');
        const data = await response.json();
        return data.abi;
    }

    async function fetchQuestEventsABI() {
        console.log("fetchQuestEventsABI called");
        let response = await fetch('QuestEvents.json');
        const data = await response.json();
        return data.abi;
    }

    async function fetchEventsABI() {
        console.log("fetchEventsABI called");
        let response = await fetch('Events.json');
        const data = await response.json();
        return data.abi;
    }

    async function fetchQuestsABI() {
        console.log("fetchQuestsABI called");
        let response = await fetch('Quests.json');
        const data = await response.json();
        return data.abi;
    }

    async function fetchUserQuestEventsABI() {
        console.log("fetchUserQuestEventsABI called");
        let response = await fetch('UserQuestEvents.json');
        const data = await response.json();
        return data.abi;
    }

    async function fetchUsersABI() {
        console.log("fetchUsersABI called");
        let response = await fetch('Users.json');
        const data = await response.json();
        return data.abi;
    }

    async function initializeQuest(userQuestEventId) {
        console.log(`initializeQuest called with params: userQuestEventId=${userQuestEventId}`);
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const expirationTime = currentTimestamp + 86400;
        const minSubmissions = parseInt(minSubmissionsInput.value, 10);
        const requiredHashtags = requiredHashtagsInput.value.split(", ");
        const requireHashtags = requireHashtagsInput.checked;

        console.log("Initializing quest with params:", {
            userQuestEventId, expirationTime, minSubmissions, requiredHashtags, requireHashtags
        });

        try {
            const tx = await contentCreatorQuestContract.initializeContentCreatorQuest(
                ethers.BigNumber.from(userQuestEventId),
                expirationTime,
                minSubmissions,
                requiredHashtags,
                requireHashtags,
                { gasLimit: 1000000 }
            );
            console.log(`Quest initialization transaction hash: ${tx.hash}`);
            const receipt = await tx.wait();

            const parsedLogs = await parseLogs(receipt.logs, contentCreatorQuestContract);
            console.log("Parsed logs:", parsedLogs);

            console.log("Quest initialized:", userQuestEventId);
            output.innerText = `Quest initialized with ID: ${userQuestEventId}`;

            const questStatus = await contentCreatorQuestContract.quests(userQuestEventId);
            console.log("Quest status after initialization:", questStatus);
        } catch (error) {
            console.error("Error initializing quest:", error);
            if (error.transactionHash) {
                const reason = await decodeRevertReason(error.transactionHash, provider);
                console.error("Revert reason:", reason);
                output.innerText = `Error: ${reason}`;
            } else {
                handleError(error);
            }
        }
    }

    async function submitContent(userQuestEventId) {
        console.log(`submitContent called with params: userQuestEventId=${userQuestEventId}`);
        const contentUrl = contentUrlInput.value;
        const hashtags = contentHashtagsInput.value.split(", ");

        const questStatus = await contentCreatorQuestContract.quests(userQuestEventId);
        console.log("Quest status before submission:", questStatus);
        const parsedQuestData = parseQuestData(questStatus);
        console.log("Parsed Quest Data: ", parsedQuestData);

        if (!parsedQuestData.isActive || parsedQuestData.isCompleted) {
            throw new Error("Quest is either inactive or already completed.");
        }

        const contentData = ethers.utils.defaultAbiCoder.encode(["string", "string[]"], [contentUrl, hashtags]);
        try {
            const tx = await contentCreatorQuestContract.interact(userQuestEventId, await signer.getAddress(), "submit", contentData, {
                gasLimit: 500000
            });
            const receipt = await tx.wait();

            parseLogs(receipt.logs, contentCreatorQuestContract);

            console.log("Content submitted:", contentUrl);
            output.innerText = `Content submitted: ${contentUrl}`;
        } catch (error) {
            console.error("Error submitting content:", error);
            if (error.transactionHash) {
                const reason = await decodeRevertReason(error.transactionHash, provider);
                console.error("Revert reason:", reason);
                output.innerText = `Error: ${reason}`;
            } else {
                handleError(error);
            }
        }
    }

    async function checkSubmissions(userQuestEventId) {
        console.log(`checkSubmissions called with params: userQuestEventId=${userQuestEventId}`);
        const submissions = await contentCreatorQuestContract.getContentSubmissions(userQuestEventId);
        console.log("Submissions:", submissions);
        output.innerText = `Submissions: ${JSON.stringify(submissions)}`;
    }

    async function checkQuestActive(userQuestEventId) {
        console.log(`checkQuestActive called with params: userQuestEventId=${userQuestEventId}`);
        const questStatus = await contentCreatorQuestContract.quests(userQuestEventId);
        const parsedQuestData = parseQuestData(questStatus);
        const isActive = parsedQuestData.isActive;
        console.log("Quest active status:", isActive);
        output.innerText = `Quest active status: ${isActive}`;
    }

    async function checkQuestCompleted(userQuestEventId) {
        console.log(`checkQuestCompleted called with params: userQuestEventId=${userQuestEventId}`);
        const questStatus = await contentCreatorQuestContract.quests(userQuestEventId);
        const parsedQuestData = parseQuestData(questStatus);
        const isCompleted = parsedQuestData.isCompleted;
        console.log("Quest completed status:", isCompleted);
        output.innerText = `Quest completed status: ${isCompleted}`;
    }

    async function fetchQuestEvents() {
        console.log("fetchQuestEvents called");
        await connectWalletByProvider();
        const questEventsABI = await fetchQuestEventsABI();
        const questEventsContract = new ethers.Contract(questEventsContractAddress, questEventsABI, signer);
        const questEventList = document.getElementById('quest-event-list');
        const questEventCount = await questEventsContract.getQuestEventCount();

        let questEvents = [];
        for (let i = 0; i < questEventCount; i++) {
            const questEvent = await questEventsContract.readQuestEvent(i + 1);
            questEvents.push(questEvent);
        }
        await populateQuestEventList(questEvents);
    }

    async function fetchAndPopulateEvents() {
        console.log("fetchAndPopulateEvents called");
        await connectWalletByProvider();
        const eventsABI = await fetchEventsABI();
        const eventsContract = new ethers.Contract(eventsContractAddress, eventsABI, signer);
        const eventSelect = document.getElementById('event-id');
        const eventCount = await eventsContract.getEventCount();

        for (let i = 0; i < eventCount; i++) {
            const event = await eventsContract.getEventByIndex(i);
            const option = document.createElement('option');
            option.value = event.eventId;
            option.textContent = `${event.name} (${event.eventId})`;
            eventSelect.appendChild(option);
        }
    }

    async function fetchAndPopulateQuests() {
        console.log("fetchAndPopulateQuests called");
        await connectWalletByProvider();
        const questsABI = await fetchQuestsABI();
        const questsContract = new ethers.Contract(questsContractAddress, questsABI, signer);
        const questSelect = document.getElementById('quest-id');
        const questCount = await questsContract.getQuestCount();

        for (let i = 0; i < questCount; i++) {
            const quest = await questsContract.getQuestByIndex(i);
            const option = document.createElement('option');
            option.value = quest.questId;
            option.textContent = `${quest.name} (${quest.questId})`;
            questSelect.appendChild(option);
        }
    }

    async function getUserQuestEventId(questEventId) {
        console.log(`getUserQuestEventId called with params: questEventId=${questEventId}`);
        try {
            const userId = await signer.getAddress();
            const userQuestEventCount = await userQuestEventsContract.getUserQuestEventCount();
            for (let i = 0; i < userQuestEventCount; i++) {
                const userQuestEvent = await userQuestEventsContract.readUserQuestEvent(i + 1);
                if (userQuestEvent.questEventId == questEventId && userQuestEvent.userId == userId) {
                    return userQuestEvent.userQuestEventId;
                }
            }
        } catch (error) {
            console.error("Error fetching user quest event ID:", error);
        }
        return null;
    }

    async function createUserQuestEvent(questEventId) {
        console.log(`createUserQuestEvent called with params: questEventId=${questEventId}`);
        await connectWalletByProvider();
        const userContract = await initializeContract(provider, 'Users.json', usersContractAddress);
        const userId = await userContract.getUserIdByWallet(await signer.getAddress());
        const interactions = ethers.BigNumber.from(0);
        const validated = false;
        const url = '';
        const completed = false;

        const params = {
            questEventId: ethers.BigNumber.from(questEventId),
            userId: ethers.BigNumber.from(userId),
            interactions,
            validated,
            url,
            completed
        };

        console.log("Creating User Quest Event with params:", params);

        try {
            verifyFunctionSignature(userQuestEventsContract, "createUserQuestEvent", [
                params.questEventId,
                params.userId,
                params.interactions,
                params.validated,
                params.url,
                params.completed
            ]);

            const txResponse = await userQuestEventsContract.createUserQuestEvent(
                params.questEventId,
                params.userId,
                params.interactions,
                params.validated,
                params.url,
                params.completed
            );
            console.log(`User Quest Event creation transaction hash: ${txResponse.hash}`);
            const receipt = await txResponse.wait();

            // Log the contract ABI for debugging
            console.log("UserQuestEvents contract ABI:", userQuestEventsContract.interface.format(ethers.utils.FormatTypes.json));

            const parsedLogs = await parseLogs(receipt.logs, userQuestEventsContract);
            console.log("Parsed logs:", parsedLogs);

            const event = parsedLogs.find(event => event.name === 'UserQuestEventCreated');
            if (event) {
                const userQuestEventId = event.args.userQuestEventId.toString();
                document.getElementById('user-quest-event-id').value = userQuestEventId;
                return userQuestEventId;
            } else {
                console.error("UserQuestEventCreated event not found in receipt logs:", receipt.logs);
                output.innerText = "Error: UserQuestEventCreated event not found";
            }
        } catch (error) {
            console.error("Error creating user quest event:", error);
            if (error.transactionHash) {
                const reason = await decodeRevertReason(error.transactionHash, provider);
                console.error("Revert reason:", reason);
                output.innerText = `Error: ${reason}`;
            } else {
                handleError(error);
            }
        }
    }

    async function populateQuestEventList(questEvents) {
        console.log("populateQuestEventList called with params:", questEvents);
        const questEventList = document.getElementById('quest-event-list');
        questEventList.innerHTML = '';

        for (const questEvent of questEvents) {
            const userQuestEventId = await getUserQuestEventId(questEvent.questEventId);
            const listItem = document.createElement('li');
            listItem.className = 'quest-event-item';
            listItem.innerHTML = `
                <div class="quest-event-id">Quest Event ID: <span>${questEvent.questEventId}</span></div>
                <div class="user-quest-event-id">User Quest Event ID: <span>${userQuestEventId || ''}</span></div>
                <div class="event-id">Event ID: <span>${questEvent.eventId}</span></div>
                <div class="quest-id">Quest ID: <span>${questEvent.questId}</span></div>
            `;
            listItem.addEventListener('click', () => handleQuestEventSelection(questEvent, listItem, userQuestEventId));
            questEventList.appendChild(listItem);
        }
    }

    function handleQuestEventSelection(questEvent, listItem, userQuestEventId) {
        console.log("handleQuestEventSelection called with params:", { questEvent, userQuestEventId });
        document.getElementById('quest-event-id').value = questEvent.questEventId;
        document.getElementById('event-id').value = questEvent.eventId;
        document.getElementById('quest-id').value = questEvent.questId;
        document.getElementById('minimum-interactions').value = questEvent.minimumInteractions;

        const startDate = new Date(questEvent.startDate * 1000).toISOString().split('T')[0];
        const endDate = new Date(questEvent.endDate * 1000).toISOString().split('T')[0];

        document.getElementById('start-date').value = startDate;
        document.getElementById('end-date').value = endDate;

        document.getElementById('reward-amount').value = questEvent.rewardAmount;
        document.getElementById('url-hash-tags').value = questEvent.urlHashTags;
        document.getElementById('user-quest-event-id').value = userQuestEventId || '';

        const questEventItems = document.querySelectorAll('#quest-event-list li');
        questEventItems.forEach(item => item.classList.remove('selected'));
        listItem.classList.add('selected');

        updateQuestStatus(questEvent.questId);
    }

    async function updateQuestStatus(userQuestEventId) {
        console.log(`updateQuestStatus called with params: userQuestEventId=${userQuestEventId}`);
        const questStatus = await contentCreatorQuestContract.quests(userQuestEventId);
        const parsedQuestData = parseQuestData(questStatus);
        const isActive = parsedQuestData.isActive;
        const isCompleted = parsedQuestData.isCompleted;

        document.getElementById('quest-status').innerText = `Active: ${isActive}, Completed: ${isCompleted}`;
    }

    fetchQuestEvents();
    fetchAndPopulateEvents();
    fetchAndPopulateQuests();

    document.getElementById('initialize-quest').addEventListener('click', async () => {
        console.log("initialize-quest button clicked");
        await connectWalletByProvider();
        const questEventId = document.getElementById('quest-event-id').value;
        try {
            let userQuestEventId = document.getElementById('user-quest-event-id').value;
            if (!userQuestEventId) {
                userQuestEventId = await createUserQuestEvent(questEventId);
            }
            await initializeQuest(userQuestEventId);
        } catch (error) {
            handleError(error);
        }
    });

    document.getElementById('submit-content').addEventListener('click', async () => {
        console.log("submit-content button clicked");
        await connectWalletByProvider();
        const questEventId = document.getElementById('quest-event-id').value;
        try {
            let userQuestEventId = document.getElementById('user-quest-event-id').value;
            if (!userQuestEventId) {
                userQuestEventId = await createUserQuestEvent(questEventId);
            }
            await submitContent(userQuestEventId);
        } catch (error) {
            handleError(error);
        }
    });

    document.getElementById('check-submissions').addEventListener('click', async () => {
        console.log("check-submissions button clicked");
        await connectWalletByProvider();
        const userQuestEventId = document.getElementById('user-quest-event-id').value;
        try {
            await checkSubmissions(userQuestEventId);
        } catch (error) {
            handleError(error);
        }
    });

    document.getElementById('check-quest-active').addEventListener('click', async () => {
        console.log("check-quest-active button clicked");
        await connectWalletByProvider();
        const userQuestEventId = document.getElementById('user-quest-event-id').value;
        try {
            await checkQuestActive(userQuestEventId);
        } catch (error) {
            handleError(error);
        }
    });

    document.getElementById('check-quest-completed').addEventListener('click', async () => {
        console.log("check-quest-completed button clicked");
        await connectWalletByProvider();
        const userQuestEventId = document.getElementById('user-quest-event-id').value;
        try {
            await checkQuestCompleted(userQuestEventId);
        } catch (error) {
            handleError(error);
        }
    });
});


