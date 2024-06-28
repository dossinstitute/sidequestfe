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
        await connectWallet();
        const questManagerContract = await initializeQuestContract();

        let quests = [];
        const questCount = await questManagerContract.getQuestCount();
        for (let i = 0; i < questCount; i++) {
            const quest = await questManagerContract.getQuestByIndex(i);
            quests.push({
                questId: quest.questId.toNumber(),
                eventId: quest.eventId,
                startDate: new Date(quest.startDate * 1000).toISOString().split('T')[0],
                endDate: new Date(quest.endDate * 1000).toISOString().split('T')[0],
                requiredInteractions: quest.requiredInteractions,
                rewardType: quest.rewardType
            });
        }
        return quests;
    }

    async function populateQuestList(quests) {
        const questList = document.getElementById('quest-list');
        quests.forEach(quest => {
            const listItem = document.createElement('li');
            listItem.className = 'quest-item';
            listItem.innerHTML = `
                <div class="quest-id">Quest ID: <span>${quest.questId}</span></div>
                <div class="event-id">Event ID: <span>${quest.eventId}</span></div>
            `;
            listItem.addEventListener('click', () => handleQuestSelection(quest, listItem));
            questList.appendChild(listItem);
        });
    }

    function handleQuestSelection(quest, listItem) {
        document.getElementById('quest-id').value = quest.questId.toString();
        document.getElementById('event-id').value = quest.eventId.toString();
        document.getElementById('start-date').value = quest.startDate;
        document.getElementById('end-date').value = quest.endDate;
        document.getElementById('required-interactions').value = quest.requiredInteractions.toString();
        document.getElementById('reward-type').value = quest.rewardType;

        const questItems = document.querySelectorAll('#quest-list li');
        questItems.forEach(item => item.classList.remove('selected'));
        listItem.classList.add('selected');
    }

    async function registerForQuest() {
        await connectWallet();
        const userManagerContract = await initializeUserContract();
        const questId = parseInt(document.getElementById('quest-id').value, 10);
        const userAddress = await signer.getAddress();

        try {
					console.log(`wallet address: ${userAddress}`);
            const txResponse = await userManagerContract.registerForQuest(userAddress, questId);
            console.log(`Quest registration transaction hash: ${txResponse.hash}`);
            await txResponse.wait();
            alert('Quest registered successfully');
        } catch (error) {
            console.error('Error registering for quest:', error);
        }
    }

    document.getElementById('register-quest').addEventListener('click', registerForQuest);

    async function initializeQuestList() {
        try {
            const quests = await fetchQuests();
            await populateQuestList(quests);
        } catch (error) {
            console.error("Failed to fetch or populate quests:", error);
        }
    }

    initializeQuestList();
});

