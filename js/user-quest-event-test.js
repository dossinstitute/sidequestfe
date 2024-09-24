document.addEventListener('DOMContentLoaded', async function () {
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

    let signer, userQuestEventsContract;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const output = document.getElementById('output');
    const userQuestEventsContractAddress = "0xf442b5dbA616a630Fb98559AC4E757c67Ead54Ab";
    const userContractAddress = "0x2E1baC0213F0df0f4bcEB9B6e50F79D6E129A24e";

    async function connectWalletAndInitializeContract() {
        signer = await connectWalletByProvider(provider);
        userQuestEventsContract = await initializeContract(provider, 'UserQuestEvents.json', userQuestEventsContractAddress);
    }

    async function createUserQuestEvent() {
        await connectWalletAndInitializeContract();
        const questEventId = ethers.BigNumber.from(1);
        // const userId = await getUserIdByWallet(await signer.getAddress());
        const userId = ethers.BigNumber.from(1) 
        const interactions = ethers.BigNumber.from(5);
        const validated = true;
        const url = "http://example.com";
        const completed = false;

        const params = [questEventId, userId, interactions, validated, url, completed];

        try {
            const contractABI = await fetchContractABI('UserQuestEvents.json');
            verifyFunctionSignature(contractABI, 'createUserQuestEvent', params);

            console.log("Creating User Quest Event with params:", params);

            const txResponse = await userQuestEventsContract.createUserQuestEvent(...params);
            console.log(`User Quest Event creation transaction hash: ${txResponse.hash}`);
            const receipt = await txResponse.wait();

            parseLogs(receipt.logs, userQuestEventsContract);

            const event = receipt.events.find(event => event.event === 'UserQuestEventCreated');
            if (event) {
                const userQuestEventId = event.args.userQuestEventId.toString();
                console.log("User Quest Event ID:", userQuestEventId);
                output.innerText = `User Quest Event created with ID: ${userQuestEventId}`;
            } else {
                console.error("UserQuestEventCreated event not found in receipt.events:", receipt.events);
            }
        } catch (error) {
            console.error("Error creating user quest event:", error);
            if (error.transactionHash) {
                const reason = await decodeRevertReason(error.transactionHash, provider);
                console.error("Revert reason:", reason);
            }
            handleError(error);
        }
    }

    async function getUserIdByWallet(wallet) {
        const userContract = await initializeContract(provider, 'Users.json', userContractAddress);
        return await userContract.getUserIdByWallet(wallet);
    }

    async function updateUserQuestEvent() {
        await connectWalletAndInitializeContract();
        const userQuestEventId = ethers.BigNumber.from(1); // Change as needed
        const questEventId = ethers.BigNumber.from(1); // Change as needed
        const userId = await getUserIdByWallet(await signer.getAddress());
        const interactions = ethers.BigNumber.from(10);
        const validated = false;
        const url = "http://updated.com";
        const completed = true;

        const params = [userQuestEventId, questEventId, userId, interactions, validated, url, completed];

        try {
            const contractABI = await fetchContractABI('UserQuestEvents.json');
            verifyFunctionSignature(contractABI, 'updateUserQuestEvent', params);

            console.log("Updating User Quest Event with params:", params);

            const txResponse = await userQuestEventsContract.updateUserQuestEvent(...params);
            console.log(`User Quest Event update transaction hash: ${txResponse.hash}`);
            const receipt = await txResponse.wait();

            parseLogs(receipt.logs, userQuestEventsContract);

            console.log('User Quest Event updated successfully');
            output.innerText = 'User Quest Event updated successfully';
        } catch (error) {
            console.error("Error updating user quest event:", error);
            if (error.transactionHash) {
                const reason = await decodeRevertReason(error.transactionHash, provider);
                console.error("Revert reason:", reason);
            }
            handleError(error);
        }
    }

    async function deleteUserQuestEvent() {
        await connectWalletAndInitializeContract();
        const userQuestEventId = ethers.BigNumber.from(1); // Change as needed

        const params = [userQuestEventId];

        try {
            const contractABI = await fetchContractABI('UserQuestEvents.json');
            verifyFunctionSignature(contractABI, 'deleteUserQuestEvent', params);

            console.log("Deleting User Quest Event with params:", params);

            const txResponse = await userQuestEventsContract.deleteUserQuestEvent(...params);
            console.log(`User Quest Event delete transaction hash: ${txResponse.hash}`);
            const receipt = await txResponse.wait();

            parseLogs(receipt.logs, userQuestEventsContract);

            console.log('User Quest Event deleted successfully');
            output.innerText = 'User Quest Event deleted successfully';
        } catch (error) {
            console.error("Error deleting user quest event:", error);
            if (error.transactionHash) {
                const reason = await decodeRevertReason(error.transactionHash, provider);
                console.error("Revert reason:", reason);
            }
            handleError(error);
        }
    }

    async function listUserQuestEvents() {
        await connectWalletAndInitializeContract();

        try {
            const userQuestEventList = await userQuestEventsContract.listUserQuestEvents();
            console.log("User Quest Events:", userQuestEventList);
            output.innerText = `User Quest Events: ${JSON.stringify(userQuestEventList)}`;
        } catch (error) {
            handleError(error);
        }
    }

    async function getQuestsForUser() {
        await connectWalletAndInitializeContract();
        const userId = await getUserIdByWallet(await signer.getAddress());

        try {
            const userQuests = await userQuestEventsContract.getQuestsForUser(userId);
            console.log("User Quests:", userQuests);
            output.innerText = `User Quests: ${JSON.stringify(userQuests)}`;
        } catch (error) {
            handleError(error);
        }
    }

    async function getUserQuestEventCount() {
        await connectWalletAndInitializeContract();

        try {
            const userQuestEventCount = await userQuestEventsContract.getUserQuestEventCount();
            console.log("User Quest Event Count:", userQuestEventCount);
            output.innerText = `User Quest Event Count: ${userQuestEventCount}`;
        } catch (error) {
            handleError(error);
        }
    }

    document.getElementById('create-user-quest-event').addEventListener('click', createUserQuestEvent);
    document.getElementById('update-user-quest-event').addEventListener('click', updateUserQuestEvent);
    document.getElementById('delete-user-quest-event').addEventListener('click', deleteUserQuestEvent);
    document.getElementById('list-user-quest-events').addEventListener('click', listUserQuestEvents);
    document.getElementById('get-quests-for-user').addEventListener('click', getQuestsForUser);
    document.getElementById('get-user-quest-event-count').addEventListener('click', getUserQuestEventCount);
});

