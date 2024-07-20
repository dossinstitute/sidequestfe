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

    let signer, contentCreatorQuestContract, userQuestTypeEventsContract;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const questTypeIdInput = document.getElementById('quest-type-id');
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
    const userQuestTypeEventIdInput = document.getElementById('user-quest-type-event-id');
    const contentCreatorQuestAddress = "0x59b544dd3533f1E0a0dac51D0DdFf7a1AE693003"; // Replace with your contract address
    const questTypeEventsContractAddress = "0x92e0043d21C38dCd1C5B6e4dAfdbf2fd57FB70bF";
    const userQuestTypeEventsContractAddress = "0x9E2D8a12713042E541c2f342B83878c7A168a660";
    const eventsContractAddress = "0x164155E567ee016DEe8F2c26785003c578eA919E";
    const questTypesContractAddress = "0x04D64d048aA6E7A50FE59a82b3b30E437cD6a98f";
    const usersContractAddress = "0xF9F98Ee5e4fa000E6Bada4cA6F7fC97Cc2b9301e";

    async function connectWalletByProvider() {
        console.log("connectWalletByProvider called");
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        const contentCreatorQuestABI = await fetchContentCreatorQuestABI();
        const userQuestTypeEventsABI = await fetchUserQuestTypeEventsABI();
        contentCreatorQuestContract = new ethers.Contract(contentCreatorQuestAddress, contentCreatorQuestABI, signer);
        userQuestTypeEventsContract = new ethers.Contract(userQuestTypeEventsContractAddress, userQuestTypeEventsABI, signer);
        console.log("Connected to wallet");
    }

    async function fetchContentCreatorQuestABI() {
        console.log("fetchContentCreatorQuestABI called");
        let response = await fetch('ContentCreatorQuest.json');
        const data = await response.json();
        return data.abi;
    }

    async function fetchQuestTypeEventsABI() {
        console.log("fetchQuestTypeEventsABI called");
        let response = await fetch('QuestTypeEvent.json');
        const data = await response.json();
        return data.abi;
    }

    async function fetchEventsABI() {
        console.log("fetchEventsABI called");
        let response = await fetch('Events.json');
        const data = await response.json();
        return data.abi;
    }

    async function fetchQuestTypesABI() {
        console.log("fetchQuestTypesABI called");
        let response = await fetch('QuestTypes.json');
        const data = await response.json();
        return data.abi;
    }

    async function fetchUserQuestTypeEventsABI() {
        console.log("fetchUserQuestTypeEventsABI called");
        let response = await fetch('UserQuestTypeEvents.json');
        const data = await response.json();
        return data.abi;
    }

    async function fetchUsersABI() {
        console.log("fetchUsersABI called");
        let response = await fetch('Users.json');
        const data = await response.json();
        return data.abi;
    }

		async function initializeQuest(userQuestTypeEventId) {
				console.log(`initializeQuest called with params: userQuestTypeEventId=${userQuestTypeEventId}`);
				const currentTimestamp = Math.floor(Date.now() / 1000);
				const expirationTime = ethers.BigNumber.from(currentTimestamp + 86400); // 24 hours from now
				const minSubmissions = ethers.BigNumber.from(parseInt(minSubmissionsInput.value, 10));
				const requiredHashtags = requiredHashtagsInput.value.split(", ");
				const requireHashtags = requireHashtagsInput.checked;
				const questTypeId = ethers.BigNumber.from(questTypeIdInput.value);

				console.log("Initializing quest with params:", {
						userQuestTypeEventId,
						questTypeId,
						expirationTime,
						minSubmissions,
						requiredHashtags,
						requireHashtags
				});

				try {
						// Verify the function signature before calling the contract
						verifyFunctionSignature(contentCreatorQuestContract, "initializeContentCreatorQuest", [
								ethers.BigNumber.from(userQuestTypeEventId),
								questTypeId,
								expirationTime,
								minSubmissions,
								requiredHashtags,
								requireHashtags
						]);

						// Call the contract function with correct number of parameters
						const tx = await contentCreatorQuestContract.initializeContentCreatorQuest(
								ethers.BigNumber.from(userQuestTypeEventId),
								questTypeId,
								expirationTime,
								minSubmissions,
								requiredHashtags,
								requireHashtags,
								{ gasLimit: 1000000 } // Increased gas limit
						);

						console.log(`Quest initialization transaction hash: ${tx.hash}`);
						const receipt = await tx.wait();

						const parsedLogs = await parseLogs(receipt.logs, contentCreatorQuestContract);
						console.log("Parsed logs:", parsedLogs);

						console.log("Quest initialized:", userQuestTypeEventId);
						output.innerText = `Quest initialized with ID: ${userQuestTypeEventId}`;

						const questStatus = await contentCreatorQuestContract.quests(userQuestTypeEventId);
						console.log("Quest status after initialization:", questStatus);
				} catch (error) {
						console.error("Error initializing quest:", error);

						// Decode the revert reason
						if (error.transactionHash) {
								try {
										const decodedRevertReason = await decodeRevertReason(error.transactionHash, provider);
										console.error("Decoded Revert Reason:", decodedRevertReason);
										output.innerText = `Error: ${decodedRevertReason}`;
								} catch (decodeError) {
										console.error("Error decoding revert reason:", decodeError);
										output.innerText = `Error: ${decodeError.message}`;
								}
						} else {
								handleError(error);
						}
				}
		}

    const submitContent = async (userQuestTypeEventId) => {
        console.log(`submitContent called with params: userQuestTypeEventId=${userQuestTypeEventId}`);
        const contentUrl = contentUrlInput.value;
        const hashtags = contentHashtagsInput.value.split(", ");

        const questStatus = await contentCreatorQuestContract.quests(userQuestTypeEventId);
        console.log("Quest status before submission:", questStatus);
        const parsedQuestData = parseQuestData(questStatus);
        console.log("Parsed Quest Data:", parsedQuestData);

        if (!parsedQuestData.isActive || parsedQuestData.isCompleted) {
            throw new Error("Quest is either inactive or already completed.");
        }

        const contentData = ethers.utils.defaultAbiCoder.encode(["string", "string[]"], [contentUrl, hashtags]);
        try {
            const tx = await contentCreatorQuestContract.interact(userQuestTypeEventId, await signer.getAddress(), "submit", contentData, { gasLimit: 500000 });
            const receipt = await tx.wait();

            parseLogs(receipt.logs, contentCreatorQuestContract);

            console.log("Content submitted:", contentUrl);
            output.innerText = `Content submitted: ${contentUrl}`;
        } catch (error) {
            console.error("Error submitting content:", error);
            handleError(error);
        }
    };

    const checkSubmissions = async (userQuestTypeEventId) => {
        console.log(`checkSubmissions called with params: userQuestTypeEventId=${userQuestTypeEventId}`);
        const submissions = await contentCreatorQuestContract.getContentSubmissions(userQuestTypeEventId);
        console.log("Submissions:", submissions);
        output.innerText = `Submissions: ${JSON.stringify(submissions)}`;
    };

    const checkQuestActive = async (userQuestTypeEventId) => {
        console.log(`checkQuestActive called with params: userQuestTypeEventId=${userQuestTypeEventId}`);
        const questStatus = await contentCreatorQuestContract.quests(userQuestTypeEventId);
        const parsedQuestData = parseQuestData(questStatus);
        const isActive = parsedQuestData.isActive;
        console.log("Quest active status:", isActive);
        output.innerText = `Quest active status: ${isActive}`;
    };

    const checkQuestCompleted = async (userQuestTypeEventId) => {
        console.log(`checkQuestCompleted called with params: userQuestTypeEventId=${userQuestTypeEventId}`);
        const questStatus = await contentCreatorQuestContract.quests(userQuestTypeEventId);
        const parsedQuestData = parseQuestData(questStatus);
        const isCompleted = parsedQuestData.isCompleted;
        console.log("Quest completed status:", isCompleted);
        output.innerText = `Quest completed status: ${isCompleted}`;
    };

    const fetchQuestTypeEvents = async () => {
        console.log("fetchQuestTypeEvents called");
        await connectWalletByProvider();
        const questTypeEventsABI = await fetchQuestTypeEventsABI();
        const questTypeEventsContract = new ethers.Contract(questTypeEventsContractAddress, questTypeEventsABI, signer);
        const questTypeEventList = document.getElementById('quest-type-event-list');
        const questTypeEventCount = await questTypeEventsContract.getQuestTypeEventCount();

        let questTypeEvents = [];
        for (let i = 0; i < questTypeEventCount; i++) {
            const questTypeEvent = await questTypeEventsContract.getQuestTypeEventByIndex(i);
            questTypeEvents.push(questTypeEvent);
        }
        await populateQuestEventList(questTypeEvents);
    };

    const fetchAndPopulateEvents = async () => {
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
    };

    const fetchAndPopulateQuestTypes = async () => {
        console.log("fetchAndPopulateQuestTypes called");
        await connectWalletByProvider();
        const questTypesABI = await fetchQuestTypesABI();
        const questTypesContract = new ethers.Contract(questTypesContractAddress, questTypesABI, signer);
        const questSelect = document.getElementById('quest-type-id');
        const questCount = await questTypesContract.getQuestTypeCount();

        for (let i = 0; i < questCount; i++) {
            try {
                const quest = await questTypesContract.readQuestType(i + 1);
                const option = document.createElement('option');
                option.value = quest.questTypeId;
                option.textContent = `${quest.name} (${quest.questTypeId})`;
                questSelect.appendChild(option);
            } catch (error) {
                console.error(`Error reading quest type at index ${i + 1}:`, error);
            }
        }
    };

    const getUserQuestTypeEventId = async (questTypeEventId) => {
        console.log(`getUserQuestTypeEventId called with params: questTypeEventId=${questTypeEventId}`);
        try {
            await connectWalletByProvider();
            const userContract = await initializeContract(provider, 'Users.json', usersContractAddress);
            const userId = await userContract.getUserIdByWallet(await signer.getAddress());
            verifyFunctionSignature(userQuestTypeEventsContract, "getUserQuestTypeEventCount", []);
            const userQuestTypeEventCount = await userQuestTypeEventsContract.getUserQuestTypeEventCount();
            for (let i = 0; i < userQuestTypeEventCount; i++) {
                verifyFunctionSignature(userQuestTypeEventsContract, "getUserQuestTypeEventByIndex", [ethers.BigNumber.from(i)]);
                const userQuestTypeEvent = await userQuestTypeEventsContract.getUserQuestTypeEventByIndex(ethers.BigNumber.from(i));
                if (ethers.BigNumber.from(userQuestTypeEvent.questTypeEventId).eq(ethers.BigNumber.from(questTypeEventId)) && ethers.BigNumber.from(userQuestTypeEvent.userId).eq(ethers.BigNumber.from(userId))) {
                    console.log("User quest type event found for quest event");
                    return userQuestTypeEvent.userQuestTypeEventId;
                }
            }
        } catch (error) {
            console.error("Error fetching user quest type event ID:", error);
        }
        return null;
    };

      const createUserQuestTypeEvent = async (questTypeEventId) => {
      console.log(`createUserQuestTypeEvent called with params: questTypeEventId=${questTypeEventId}`);
      await connectWalletByProvider();
      const userContract = await initializeContract(provider, 'Users.json', usersContractAddress);
      const userQuestTypeEventsContract = await initializeContract(provider, 'UserQuestTypeEvents.json', userQuestTypeEventsContractAddress);
      const userId = await userContract.getUserIdByWallet(await signer.getAddress());
      const interactions = ethers.BigNumber.from(2);
      const validated = false;
      const url = 'example.com';
      const completed = false;

      const params = {
          questTypeEventId: ethers.BigNumber.from(questTypeEventId),
          userId: ethers.BigNumber.from(userId),
          interactions,
          validated,
          url,
          completed
      };

      console.log("Creating User Quest Type Event with params:", params);

      try {
          verifyFunctionSignature(userQuestTypeEventsContract, "createUserQuestTypeEvent", [
              params.questTypeEventId,
              params.userId,
              params.interactions,
              params.validated,
              params.url,
              params.completed
          ]);

          const txResponse = await userQuestTypeEventsContract.createUserQuestTypeEvent(
              params.questTypeEventId,
              params.userId,
              params.interactions,
              params.validated,
              params.url,
              params.completed,
              { gasLimit: 1000000 } // Increased gas limit
          );
          console.log(`User Quest Type Event creation transaction hash: ${txResponse.hash}`);
          const receipt = await txResponse.wait();

          const parsedLogs = await parseLogs(receipt.logs, userQuestTypeEventsContract);
          console.log("Parsed logs:", parsedLogs);

          const event = parsedLogs.find(event => event.name === 'UserQuestTypeEventCreated');
          if (event) {
              const userQuestTypeEventId = event.args.userQuestTypeEventId.toString();
              document.getElementById('user-quest-type-event-id').value = userQuestTypeEventId;
              return userQuestTypeEventId;
          } else {
              console.error("UserQuestTypeEventCreated event not found in receipt logs:", receipt.logs);
              output.innerText = "Error: UserQuestTypeEventCreated event not found";
          }
      } catch (error) {
          console.error("Error creating user quest type event:", error);
          try {
              const decodedRevertReason = await decodeRevertReason(error.transactionHash, provider);
              console.error("Decoded Revert Reason:", decodedRevertReason);
              output.innerText = `Error: ${decodedRevertReason}`;
          } catch (decodeError) {
              console.error("Error decoding revert reason:", decodeError);
              if (decodeError.data && decodeError.data.message) {
                  output.innerText = `Error: ${decodeError.data.message}`;
              } else {
                  output.innerText = `Error: ${decodeError.message}`;
              }
          }
          handleError(error);
      }
  };

  const populateQuestEventList = async (questTypeEvents) => {
        console.log("populateQuestEventList called with params:", questTypeEvents);
        const questTypeEventList = document.getElementById('quest-type-event-list');
        questTypeEventList.innerHTML = '';

        for (const questTypeEvent of questTypeEvents) {
            const userQuestTypeEventId = await getUserQuestTypeEventId(questTypeEvent.questTypeEventId);
            const listItem = document.createElement('li');
            listItem.className = 'quest-type-event-item';
            listItem.innerHTML = `
                <div class="quest-type-event-id">Quest Event ID: <span>${questTypeEvent.questTypeEventId}</span></div>
                <div class="user-quest-type-event-id">User Quest Type Event ID: <span>${userQuestTypeEventId || ''}</span></div>
                <div class="event-id">Event ID: <span>${questTypeEvent.eventId}</span></div>
                <div class="quest-id">Quest Type ID: <span>${questTypeEvent.questTypeId}</span></div>
            `;
            listItem.addEventListener('click', () => handleQuestEventSelection(questTypeEvent, listItem, userQuestTypeEventId));
            questTypeEventList.appendChild(listItem);
        }
    };

    const handleQuestEventSelection = async (questTypeEvent, listItem, userQuestTypeEventId) => {
        console.log("handleQuestEventSelection called with params:", { questTypeEvent, userQuestTypeEventId });
        document.getElementById('quest-type-event-id').value = questTypeEvent.questTypeEventId;
        document.getElementById('event-id').value = questTypeEvent.eventId;
        document.getElementById('quest-type-id').value = questTypeEvent.questTypeId;
        document.getElementById('minimum-interactions').value = questTypeEvent.requiredInteractions;

        const startDate = new Date(questTypeEvent.questEventStartDate * 1000).toISOString().split('T')[0];
        const endDate = new Date(questTypeEvent.questEventEndDate * 1000).toISOString().split('T')[0];

        document.getElementById('start-date').value = startDate;
        document.getElementById('end-date').value = endDate;

        document.getElementById('reward-amount').value = questTypeEvent.reward;
        document.getElementById('url-hash-tags').value = questTypeEvent.urlHashTags;
        document.getElementById('user-quest-type-event-id').value = userQuestTypeEventId || '';

        const questTypeEventItems = document.querySelectorAll('#quest-type-event-list li');
        questTypeEventItems.forEach(item => item.classList.remove('selected'));
        listItem.classList.add('selected');

        updateQuestStatus(questTypeEvent.questTypeEventId);
    };

    const updateQuestStatus = async (userQuestTypeEventId) => {
        console.log(`updateQuestStatus called with params: userQuestTypeEventId=${userQuestTypeEventId}`);
        verifyFunctionSignature(contentCreatorQuestContract, "quests", [userQuestTypeEventId]);
        const questStatus = await contentCreatorQuestContract.quests(userQuestTypeEventId);
        const parsedQuestData = parseQuestData(questStatus);
        const isActive = parsedQuestData.isActive;
        const isCompleted = parsedQuestData.isCompleted;

        document.getElementById('quest-status').innerText = `Active: ${isActive}, Completed: ${isCompleted}`;
    };

    fetchQuestTypeEvents();
    fetchAndPopulateEvents();
    fetchAndPopulateQuestTypes();

    document.getElementById('initialize-quest').addEventListener('click', async () => {
        console.log("initialize-quest button clicked");
        await connectWalletByProvider();
        const questTypeEventId = document.getElementById('quest-type-event-id').value;
        try {
            let userQuestTypeEventId = document.getElementById('user-quest-type-event-id').value;
            if (!userQuestTypeEventId) {
                userQuestTypeEventId = await createUserQuestTypeEvent(questTypeEventId);
            }
            await initializeQuest(userQuestTypeEventId);
        } catch (error) {
            handleError(error);
        }
    });

    document.getElementById('submit-content').addEventListener('click', async () => {
        console.log("submit-content button clicked");
        await connectWalletByProvider();
        const questTypeEventId = document.getElementById('quest-type-event-id').value;
        try {
            let userQuestTypeEventId = document.getElementById('user-quest-type-event-id').value;
            if (!userQuestTypeEventId) {
                userQuestTypeEventId = await createUserQuestTypeEvent(questTypeEventId);
            }
            await submitContent(userQuestTypeEventId);
        } catch (error) {
            handleError(error);
        }
    });

    document.getElementById('check-submissions').addEventListener('click', async () => {
        console.log("check-submissions button clicked");
        await connectWalletByProvider();
        const userQuestTypeEventId = document.getElementById('user-quest-type-event-id').value;
        try {
            await checkSubmissions(userQuestTypeEventId);
        } catch (error) {
            handleError(error);
        }
    });

    document.getElementById('check-quest-active').addEventListener('click', async () => {
        console.log("check-quest-active button clicked");
        await connectWalletByProvider();
        const userQuestTypeEventId = document.getElementById('user-quest-type-event-id').value;
        try {
            await checkQuestActive(userQuestTypeEventId);
        } catch (error) {
            handleError(error);
        }
    });

    document.getElementById('check-quest-completed').addEventListener('click', async () => {
        console.log("check-quest-completed button clicked");
        await connectWalletByProvider();
        const userQuestTypeEventId = document.getElementById('user-quest-type-event-id').value;
        try {
            await checkQuestCompleted(userQuestTypeEventId);
        } catch (error) {
            handleError(error);
        }
    });
});

