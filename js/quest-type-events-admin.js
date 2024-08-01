document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded event fired");

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

    const questTypeContractAddress = "0x2d39372e07C71C0F26ec00c7350AAba5Fe2d4141";
    const questTypeEventsContractAddress = "0x92e0043d21C38dCd1C5B6e4dAfdbf2fd57FB70bF";
    const eventsContractAddress = "0x164155E567ee016DEe8F2c26785003c578eA919E";
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    async function initializeQuestTypeEventsContract() {
        console.log("initializeQuestTypeEventsContract called");
        return await initializeContract(provider, 'QuestTypeEvent.json', questTypeEventsContractAddress);
    }

    async function initializeQuestTypeContract() {
        console.log("initializeQuestTypeContract called");
        return await initializeContract(provider, 'QuestTypes.json', questTypeContractAddress);
    }

    async function initializeEventsContract() {
        console.log("initializeEventsContract called");
        return await initializeContract(provider, 'Events.json', eventsContractAddress);
    }

    async function fetchAndPopulateQuestTypes() {
        console.log("fetchAndPopulateQuestTypes called");
        try {
            await connectWalletByProvider(provider);
            const questTypeContract = await initializeQuestTypeContract();
            const questTypeCountParams = [];
            if (verifyFunctionSignature(questTypeContract, 'getQuestTypeCount', questTypeCountParams)) {
                console.log(`Function signature verified for getQuestTypeCount with params: ${JSON.stringify(questTypeCountParams)}`);
            } else {
                console.error(`Function signature verification failed for getQuestTypeCount with params: ${JSON.stringify(questTypeCountParams)}`);
            }
            const questTypeCount = await questTypeContract.getQuestTypeCount();
            console.log(`Total quest types: ${questTypeCount}`);
            const questTypeSelect = document.getElementById('quest-type-id');

            for (let i = 0; i < questTypeCount; i++) {
                try {
                    console.log(`Fetching quest type at index ${i}`);
                    const params = [ethers.BigNumber.from(i)];
                    if (verifyFunctionSignature(questTypeContract, 'getQuestTypeByIndex', params)) {
                        console.log(`Function signature verified for getQuestTypeByIndex with params: ${JSON.stringify(params)}`);
                    } else {
                        console.error(`Function signature verification failed for getQuestTypeByIndex with params: ${JSON.stringify(params)}`);
                    }
                    const questType = await questTypeContract.getQuestTypeByIndex(params[0]);
                    console.log(`Fetched quest type: ${JSON.stringify(questType)}`);

                    const option = document.createElement('option');
                    option.value = questType.questTypeId;
                    option.textContent = `${questType.name} (${questType.questTypeId})`;
                    questTypeSelect.appendChild(option);
                } catch (error) {
                    console.error(`Error fetching quest type at index ${i}:`, error);
                }
            }
        } catch (error) {
            handleError(error);
        }
    }

    async function fetchAndPopulateEvents() {
        console.log("fetchAndPopulateEvents called");
        try {
            await connectWalletByProvider(provider);
            const eventsContract = await initializeEventsContract();
            const eventCountParams = [];
            if (verifyFunctionSignature(eventsContract, 'getEventCount', eventCountParams)) {
                console.log(`Function signature verified for getEventCount with params: ${JSON.stringify(eventCountParams)}`);
            } else {
                console.error(`Function signature verification failed for getEventCount with params: ${JSON.stringify(eventCountParams)}`);
            }
            const eventCount = await eventsContract.getEventCount();
            console.log(`Total events: ${eventCount}`);
            const eventSelect = document.getElementById('event-id');

            for (let i = 0; i < eventCount; i++) {
                try {
                    console.log(`Fetching event at index ${i}`);
                    const params = [ethers.BigNumber.from(i)];
                    if (verifyFunctionSignature(eventsContract, 'getEventByIndex', params)) {
                        console.log(`Function signature verified for getEventByIndex with params: ${JSON.stringify(params)}`);
                    } else {
                        console.error(`Function signature verification failed for getEventByIndex with params: ${JSON.stringify(params)}`);
                    }
                    const event = await eventsContract.getEventByIndex(params[0]);
                    console.log(`Fetched event: ${JSON.stringify(event)}`);

                    const option = document.createElement('option');
                    option.value = event.eventId;
                    option.textContent = `${event.name} (${event.eventId})`;
                    eventSelect.appendChild(option);
                } catch (error) {
                    console.error(`Error fetching event at index ${i}:`, error);
                }
            }
        } catch (error) {
            handleError(error);
        }
    }

    async function fetchQuestTypeEvents() {
        console.log("fetchQuestTypeEvents called");
        try {
            await connectWalletByProvider(provider);
            const questTypeEventsContract = await initializeQuestTypeEventsContract();
            const questTypeEventsList = document.getElementById('quest-type-events-list');
            const questTypeEventCountParams = [];
            if (verifyFunctionSignature(questTypeEventsContract, 'getQuestTypeEventCount', questTypeEventCountParams)) {
                console.log(`Function signature verified for getQuestTypeEventCount with params: ${JSON.stringify(questTypeEventCountParams)}`);
            } else {
                console.error(`Function signature verification failed for getQuestTypeEventCount with params: ${JSON.stringify(questTypeEventCountParams)}`);
            }
            const questTypeEventCount = await questTypeEventsContract.getQuestTypeEventCount();
            console.log(`Total quest type events: ${questTypeEventCount}`);

            let questTypeEvents = [];
            for (let i = 0; i < questTypeEventCount; i++) {
                try {
                    console.log(`Fetching quest type event at index ${i}`);
                    const params = [ethers.BigNumber.from(i)];
                    if (verifyFunctionSignature(questTypeEventsContract, 'getQuestTypeEventByIndex', params)) {
                        console.log(`Function signature verified for getQuestTypeEventByIndex with params: ${JSON.stringify(params)}`);
                    } else {
                        console.error(`Function signature verification failed for getQuestTypeEventByIndex with params: ${JSON.stringify(params)}`);
                    }
                    const questTypeEvent = await questTypeEventsContract.getQuestTypeEventByIndex(params[0]);
                    console.log(`Fetched quest type event: ${JSON.stringify(questTypeEvent)}`);
                    questTypeEvents.push(questTypeEvent);
                } catch (error) {
                    console.error(`Error fetching quest type event at index ${i}:`, error);
                }
            }
            populateQuestTypeEventsList(questTypeEvents);
        } catch (error) {
            handleError(error);
        }
    }

    function populateQuestTypeEventsList(questTypeEvents) {
        console.log(`populateQuestTypeEventsList called with questTypeEvents=${JSON.stringify(questTypeEvents)}`);
        const questTypeEventsList = document.getElementById('quest-type-events-list');
        questTypeEventsList.innerHTML = '';

        questTypeEvents.forEach(questTypeEvent => {
            const listItem = document.createElement('li');
            listItem.className = 'quest-type-event-item';
            listItem.innerHTML = `
                <div class="quest-type-event-id">Quest Type Event ID: <span>${questTypeEvent.questTypeEventId}</span></div>
                <div class="event-id">Event ID: <span>${questTypeEvent.eventId}</span></div>
                <div class="quest-type-id">Quest Type ID: <span>${questTypeEvent.questTypeId}</span></div>
                <div class="reward">Reward: <span>${questTypeEvent.reward}</span></div>
                <div class="name">Name: <span>${questTypeEvent.name}</span></div>
                <div class="description">Description: <span>${questTypeEvent.description}</span></div>
                <div class="required-interactions">Required Interactions: <span>${questTypeEvent.requiredInteractions}</span></div>
                <div class="quest-event-start-date">Start Date: <span>${new Date(questTypeEvent.questEventStartDate * 1000).toISOString().split('T')[0]}</span></div>
                <div class="quest-event-end-date">End Date: <span>${new Date(questTypeEvent.questEventEndDate * 1000).toISOString().split('T')[0]}</span></div>
            `;
            listItem.addEventListener('click', () => handleQuestTypeEventSelection(questTypeEvent, listItem));
            questTypeEventsList.appendChild(listItem);
        });
    }

    function handleQuestTypeEventSelection(questTypeEvent, listItem) {
        console.log(`handleQuestTypeEventSelection called with questTypeEvent=${JSON.stringify(questTypeEvent)}, listItem=${listItem}`);
        document.getElementById('quest-type-event-id').value = questTypeEvent.questTypeEventId;
        document.getElementById('event-id').value = questTypeEvent.eventId;
        document.getElementById('quest-type-id').value = questTypeEvent.questTypeId;
        document.getElementById('reward').value = questTypeEvent.reward;
        document.getElementById('name').value = questTypeEvent.name;
        document.getElementById('description').value = questTypeEvent.description;
        document.getElementById('required-interactions').value = questTypeEvent.requiredInteractions;
        document.getElementById('quest-event-start-date').value = new Date(questTypeEvent.questEventStartDate * 1000).toISOString().split('T')[0];
        document.getElementById('quest-event-end-date').value = new Date(questTypeEvent.questEventEndDate * 1000).toISOString().split('T')[0];

        const questTypeEventItems = document.querySelectorAll('#quest-type-events-list li');
        questTypeEventItems.forEach(item => item.classList.remove('selected'));
        listItem.classList.add('selected');
    }

    async function createQuestTypeEvent() {
        console.log("createQuestTypeEvent called");
        const questTypeEventsContract = await initializeQuestTypeEventsContract();
        const eventId = parseInt(document.getElementById('event-id').value, 10);
        const questTypeId = parseInt(document.getElementById('quest-type-id').value, 10);
        const reward = ethers.BigNumber.from(document.getElementById('reward').value);
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const requiredInteractions = parseInt(document.getElementById('required-interactions').value, 10);
        const startDate = Math.floor(new Date(document.getElementById('quest-event-start-date').value).getTime() / 1000);
        const endDate = Math.floor(new Date(document.getElementById('quest-event-end-date').value).getTime() / 1000);

        try {
            const params = [eventId, questTypeId, reward, name, description, requiredInteractions, startDate, endDate];
            if (verifyFunctionSignature(questTypeEventsContract, 'createQuestTypeEvent', params)) {
                console.log(`Function signature verified for createQuestTypeEvent with params: ${JSON.stringify(params)}`);
            } else {
                console.error(`Function signature verification failed for createQuestTypeEvent with params: ${JSON.stringify(params)}`);
            }
            const txResponse = await questTypeEventsContract.createQuestTypeEvent(eventId, questTypeId, reward, name, description, requiredInteractions, startDate, endDate);
            console.log(`Quest Type Event creation transaction hash: ${txResponse.hash}`);
            await txResponse.wait();
            console.log('Quest Type Event created successfully');
            alert('Quest Type Event created successfully');
            fetchQuestTypeEvents(); // Refresh quest type event list
        } catch (error) {
            handleError(error);
        }
    }

    async function updateQuestTypeEvent() {
        console.log("updateQuestTypeEvent called");
        const questTypeEventsContract = await initializeQuestTypeEventsContract();
        const questTypeEventId = parseInt(document.getElementById('quest-type-event-id').value, 10);
        const eventId = parseInt(document.getElementById('event-id').value, 10);
        const questTypeId = parseInt(document.getElementById('quest-type-id').value, 10);
        const reward = ethers.BigNumber.from(document.getElementById('reward').value);
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const requiredInteractions = parseInt(document.getElementById('required-interactions').value, 10);
        const startDate = Math.floor(new Date(document.getElementById('quest-event-start-date').value).getTime() / 1000);
        const endDate = Math.floor(new Date(document.getElementById('quest-event-end-date').value).getTime() / 1000);

        try {
            const params = [questTypeEventId, eventId, questTypeId, reward, name, description, requiredInteractions, startDate, endDate];
            if (verifyFunctionSignature(questTypeEventsContract, 'updateQuestTypeEvent', params)) {
                console.log(`Function signature verified for updateQuestTypeEvent with params: ${JSON.stringify(params)}`);
            } else {
                console.error(`Function signature verification failed for updateQuestTypeEvent with params: ${JSON.stringify(params)}`);
                console.error(`Valid functions: ${questTypeEventsContract.interface.fragments.map(frag => `${frag.name}: ${JSON.stringify(frag.inputs)}`)}`);
            }
            const txResponse = await questTypeEventsContract.updateQuestTypeEvent(questTypeEventId, eventId, questTypeId, reward, name, description, requiredInteractions, startDate, endDate);
            console.log(`Quest Type Event update transaction hash: ${txResponse.hash}`);
            await txResponse.wait();
            console.log('Quest Type Event updated successfully');
            alert('Quest Type Event updated successfully');
            fetchQuestTypeEvents(); // Refresh quest type event list
        } catch (error) {
            handleError(error);
        }
    }

    async function deleteQuestTypeEvent() {
        console.log("deleteQuestTypeEvent called");
        const questTypeEventsContract = await initializeQuestTypeEventsContract();
        const questTypeEventId = parseInt(document.getElementById('quest-type-event-id').value, 10);

        try {
            const params = [questTypeEventId];
            if (verifyFunctionSignature(questTypeEventsContract, 'deleteQuestTypeEvent', params)) {
                console.log(`Function signature verified for deleteQuestTypeEvent with params: ${JSON.stringify(params)}`);
            } else {
                console.error(`Function signature verification failed for deleteQuestTypeEvent with params: ${JSON.stringify(params)}`);
                console.error(`Valid functions: ${questTypeEventsContract.interface.fragments.map(frag => `${frag.name}: ${JSON.stringify(frag.inputs)}`)}`);
            }
            const txResponse = await questTypeEventsContract.deleteQuestTypeEvent(questTypeEventId);
            console.log(`Quest Type Event delete transaction hash: ${txResponse.hash}`);
            await txResponse.wait();
            console.log('Quest Type Event deleted successfully');
            alert('Quest Type Event deleted successfully');
            fetchQuestTypeEvents(); // Refresh quest type event list
        } catch (error) {
            handleError(error);
        }
    }

    document.getElementById('new-quest-type-event').addEventListener('click', clearFormFields);
    document.getElementById('create-quest-type-event').addEventListener('click', createQuestTypeEvent);
    document.getElementById('update-quest-type-event').addEventListener('click', updateQuestTypeEvent);
    document.getElementById('delete-quest-type-event').addEventListener('click', deleteQuestTypeEvent);

    function clearFormFields() {
        console.log("clearFormFields called");
        document.getElementById('quest-type-event-form').reset();
    }

    async function initializePage() {
        console.log("initializePage called");
        try {
            await connectWalletByProvider(provider);
            await fetchAndPopulateQuestTypes();
            await fetchAndPopulateEvents();
            await fetchQuestTypeEvents();
        } catch (error) {
            handleError(error);
        }
    }

    initializePage();
});

