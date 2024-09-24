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

    let signer, contentCreatorQuestContract;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const output = document.getElementById('output');
    const contentCreatorQuestContractAddress = "0x59b544dd3533f1E0a0dac51D0DdFf7a1AE693003"; // Replace with your contract address

    async function connectWalletAndInitializeContract() {
        signer = await connectWalletByProvider(provider);
        contentCreatorQuestContract = await initializeContract(provider, 'ContentCreatorQuest.json', contentCreatorQuestContractAddress);
    }

    async function initializeQuest() {
        await connectWalletAndInitializeContract();
        const questId = ethers.BigNumber.from(document.getElementById('quest-id').value);
        const questTypeId = ethers.BigNumber.from(document.getElementById('quest-type-id').value);
        const currentTimestamp = (await provider.getBlock('latest')).timestamp;
        const expirationTime = currentTimestamp + 86400;
        const minSubmissions = ethers.BigNumber.from(2);
        const requiredHashtags = ["#test"];
        const requireHashtags = true;

        const params = [questId, questTypeId, expirationTime, minSubmissions, requiredHashtags, requireHashtags];

        try {
            verifyFunctionSignature(contentCreatorQuestContract, 'initializeContentCreatorQuest', params);

            const txResponse = await contentCreatorQuestContract.initializeContentCreatorQuest(...params);
            const receipt = await txResponse.wait();

            parseLogs(receipt.logs, contentCreatorQuestContract);
            output.innerText = `Quest initialized: ${JSON.stringify(receipt.events)}`;
        } catch (error) {
            if (error.transactionHash) {
                const reason = await decodeRevertReason(error.transactionHash, provider);
                console.error("Revert reason:", reason);
            }
            handleError(error);
        }
    }

    async function submitContent() {
        await connectWalletAndInitializeContract();
        const questId = ethers.BigNumber.from(document.getElementById('quest-id').value);
        const contentUrl = "http://example.com";
        const hashtags = ["#test"];
        const contentData = ethers.utils.defaultAbiCoder.encode(["string", "string[]"], [contentUrl, hashtags]);

        const params = [questId, await signer.getAddress(), "submit", contentData];

        try {
            verifyFunctionSignature(contentCreatorQuestContract, 'interact', params);

            const txResponse = await contentCreatorQuestContract.interact(...params);
            const receipt = await txResponse.wait();

            parseLogs(receipt.logs, contentCreatorQuestContract);
            output.innerText = `Content submitted: ${JSON.stringify(receipt.events)}`;
        } catch (error) {
            if (error.transactionHash) {
                const reason = await decodeRevertReason(error.transactionHash, provider);
                console.error("Revert reason:", reason);
            }
            handleError(error);
        }
    }

    async function listSubmissions() {
        await connectWalletAndInitializeContract();
        const questId = ethers.BigNumber.from(document.getElementById('quest-id').value);

        try {
            const submissions = await contentCreatorQuestContract.getContentSubmissions(questId);
            output.innerText = `Submissions: ${JSON.stringify(submissions)}`;
        } catch (error) {
            handleError(error);
        }
    }

    async function listActiveQuests() {
        await connectWalletAndInitializeContract();

        try {
            const activeQuests = await contentCreatorQuestContract.listActiveQuests();
            output.innerText = `Active Quests: ${JSON.stringify(activeQuests)}`;
        } catch (error) {
            handleError(error);
        }
    }

    async function completeQuest() {
        await connectWalletAndInitializeContract();
        const questId = ethers.BigNumber.from(document.getElementById('quest-id').value);

        try {
            const txResponse = await contentCreatorQuestContract.completeQuest(questId);
            const receipt = await txResponse.wait();

            parseLogs(receipt.logs, contentCreatorQuestContract);
            output.innerText = `Quest completed: ${JSON.stringify(receipt.events)}`;
        } catch (error) {
            if (error.transactionHash) {
                const reason = await decodeRevertReason(error.transactionHash, provider);
                console.error("Revert reason:", reason);
            }
            handleError(error);
        }
    }

    document.getElementById('initialize-quest').addEventListener('click', initializeQuest);
    document.getElementById('submit-content').addEventListener('click', submitContent);
    document.getElementById('list-submissions').addEventListener('click', listSubmissions);
    document.getElementById('list-active-quests').addEventListener('click', listActiveQuests);
    document.getElementById('complete-quest').addEventListener('click', completeQuest);
});

