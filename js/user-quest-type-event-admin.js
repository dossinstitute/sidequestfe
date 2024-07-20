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
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const userQuestTypeEventsContractAddress = "0x9E2D8a12713042E541c2f342B83878c7A168a660";
		const questTypeEventsContractAddress = "0x92e0043d21C38dCd1C5B6e4dAfdbf2fd57FB70bF";

		async function fetchAndPopulateQuestTypeEvents() {
				const signer = await connectWalletByProvider(provider);
				const questTypeEventsContract = await initializeContract(provider, 'QuestTypeEvent.json', questTypeEventsContractAddress);

				try {
						const questTypeEventCount = await questTypeEventsContract.getQuestTypeEventCount();
						const questTypeEventSelect = document.getElementById('quest-type-event-id');

						for (let i = 0; i < questTypeEventCount; i++) {
								const questTypeEvent = await questTypeEventsContract.readQuestTypeEvent(i + 1); // Adjust for 1-based indexing
								const option = document.createElement('option');
								option.value = questTypeEvent.questTypeEventId;
								option.textContent = `${questTypeEvent.name} (${questTypeEvent.questTypeEventId})`;
								questTypeEventSelect.appendChild(option);
						}
				} catch (err) {
						console.error("Error fetching quest type events:", err);
				}
		}

		async function fetchUserQuestTypeEvents() {
				const userQuestTypeEventsContract = await initializeContract(provider, 'UserQuestTypeEvents.json', userQuestTypeEventsContractAddress);
				const userQuestTypeEventList = document.getElementById('user-quest-type-event-list');

				try {
						const userQuestTypeEventCount = await userQuestTypeEventsContract.getUserQuestTypeEventCount();
console.log (`uqte count: ${userQuestTypeEventCount}`)
						let userQuestTypeEvents = [];
						for (let i = 0; i < userQuestTypeEventCount; i++) {
								const userQuestTypeEvent = await userQuestTypeEventsContract.getUserQuestTypeEventByIndex(i); // Adjust for 1-based indexing
								userQuestTypeEvents.push(userQuestTypeEvent);
						}
						populateUserQuestTypeEventList(userQuestTypeEvents);
				} catch (err) {
						console.error("Error fetching user quest type events:", err);
				}
		}

		function populateUserQuestTypeEventList(userQuestTypeEvents) {
				const userQuestTypeEventList = document.getElementById('user-quest-type-event-list');
				userQuestTypeEventList.innerHTML = '';

				userQuestTypeEvents.forEach(userQuestTypeEvent => {
						const listItem = document.createElement('li');
						listItem.className = 'user-quest-type-event-item';
						listItem.innerHTML = `
								<div class="user-quest-type-event-id">User Quest Type Event ID: <span>${userQuestTypeEvent.userQuestTypeEventId}</span></div>
								<div class="user-id">User ID: <span>${userQuestTypeEvent.userId}</span></div>
								<div class="quest-type-event-id">Quest Type Event ID: <span>${userQuestTypeEvent.questTypeEventId}</span></div>
						`;
						listItem.addEventListener('click', () => handleUserQuestTypeEventSelection(userQuestTypeEvent, listItem));
						userQuestTypeEventList.appendChild(listItem);
				});
		}

		function handleUserQuestTypeEventSelection(userQuestTypeEvent, listItem) {
				document.getElementById('user-quest-type-event-id').value = userQuestTypeEvent.userQuestTypeEventId;
				document.getElementById('user-id').value = userQuestTypeEvent.userId;
				document.getElementById('quest-type-event-id').value = userQuestTypeEvent.questTypeEventId;
				document.getElementById('interactions').value = userQuestTypeEvent.interactions;
				document.getElementById('validated').checked = userQuestTypeEvent.validated;
				document.getElementById('url').value = userQuestTypeEvent.url;
				document.getElementById('completed').checked = userQuestTypeEvent.completed;

				const userQuestTypeEventItems = document.querySelectorAll('#user-quest-type-event-list li');
				userQuestTypeEventItems.forEach(item => item.classList.remove('selected'));
				listItem.classList.add('selected');
		}

		async function createUserQuestTypeEvent() {
				const userQuestTypeEventsContract = await initializeContract(provider, 'UserQuestTypeEvents.json', userQuestTypeEventsContractAddress);

				const userId = document.getElementById('user-id').value;
				const questTypeEventId = document.getElementById('quest-type-event-id').value;
				const interactions = document.getElementById('interactions').value;
				const validated = document.getElementById('validated').checked;
				const url = document.getElementById('url').value;
				const completed = document.getElementById('completed').checked;

        const params = {
            questTypeEventId: ethers.BigNumber.from(questTypeEventId),
            userId: ethers.BigNumber.from(userId),
						interactions: ethers.BigNumber.from(parseInt(interactions, 10)),
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
                params.completed
								);
						await txResponse.wait();
						alert('User Quest Type Event created successfully');
						fetchUserQuestTypeEvents(); // Refresh user quest type event list
				} catch (error) {
						console.error('Error creating user quest type event:', error);
				}
		}

		async function updateUserQuestTypeEvent() {
				const userQuestTypeEventsContract = await initializeContract(provider, 'UserQuestTypeEvents.json', userQuestTypeEventsContractAddress);

				const userQuestTypeEventId = document.getElementById('user-quest-type-event-id').value;
				const userId = document.getElementById('user-id').value;
				const questTypeEventId = document.getElementById('quest-type-event-id').value;
				const interactions = document.getElementById('interactions').value;
				const validated = document.getElementById('validated').checked;
				const url = document.getElementById('url').value;
				const completed = document.getElementById('completed').checked;

				try {
						const txResponse = await userQuestTypeEventsContract.updateUserQuestTypeEvent(userQuestTypeEventId, userId, questTypeEventId, interactions, validated, url, completed);
						await txResponse.wait();
						alert('User Quest Type Event updated successfully');
						fetchUserQuestTypeEvents(); // Refresh user quest type event list
				} catch (error) {
						console.error('Error updating user quest type event:', error);
				}
		}

		async function deleteUserQuestTypeEvent() {
				const userQuestTypeEventsContract = await initializeContract(provider, 'UserQuestTypeEvents.json', userQuestTypeEventsContractAddress);
				const userQuestTypeEventId = document.getElementById('user-quest-type-event-id').value;

				try {
						const txResponse = await userQuestTypeEventsContract.deleteUserQuestTypeEvent(userQuestTypeEventId);
						await txResponse.wait();
						alert('User Quest Type Event deleted successfully');
						fetchUserQuestTypeEvents(); // Refresh user quest type event list
				} catch (error) {
						console.error('Error deleting user quest type event:', error);
				}
		}

		document.getElementById('new-user-quest-type-event').addEventListener('click', clearFormFields);
		document.getElementById('create-user-quest-type-event').addEventListener('click', createUserQuestTypeEvent);
		document.getElementById('update-user-quest-type-event').addEventListener('click', updateUserQuestTypeEvent);
		document.getElementById('delete-user-quest-type-event').addEventListener('click', deleteUserQuestTypeEvent);

		function clearFormFields() {
				document.getElementById('user-quest-type-event-form').reset();
		}

		async function initializePage() {
				try {
						await connectWalletByProvider(provider);
						await fetchAndPopulateQuestTypeEvents();
						await fetchUserQuestTypeEvents();
				} catch (error) {
						console.error("Failed to initialize page:", error);
				}
		}

		initializePage();
});

