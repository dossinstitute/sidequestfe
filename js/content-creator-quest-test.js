document.addEventListener('DOMContentLoaded', async function () {
  let signer, contentCreatorQuestContract;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const web3Provider = new Web3(window.ethereum);
  const questId = 1;

  async function fetchContentCreatorQuestABI() {
    let response = await fetch('ContentCreatorQuest.json');
    const data = await response.json();
    return data.abi;
  }

  async function initializeContentCreatorQuestContract() {
    const contentCreatorQuestABI = await fetchContentCreatorQuestABI();
    const contentCreatorQuestAddress = "0x6216D31358A213863553Fcb1a352A929803e22D1"; // Replace with your contract address
    const contentCreatorQuestContract = new ethers.Contract(contentCreatorQuestAddress, contentCreatorQuestABI, signer);
    return contentCreatorQuestContract;
  }

  // Connect to Ethereum Wallet
  async function connectWallet() {
    try {
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      contentCreatorQuestContract = await initializeContentCreatorQuestContract();
      console.log("Connected to wallet");
    } catch (error) {
      console.error("User rejected request to connect wallet:", error);
    }
  }

  // Initialize Quest
  async function initializeQuest() {
    try {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const expirationTime = currentTimestamp + 86400; // 1 day in the future
      const minSubmissions = 2;
      const requiredHashtags = ["#test"];
      const requireHashtags = true;

      const tx = await contentCreatorQuestContract.initializeContentCreatorQuest(questId, expirationTime, minSubmissions, requiredHashtags, requireHashtags, {
        gasLimit: 1000000 // Ensure sufficient gas
      });
      const receipt = await tx.wait();

      // Check for custom debug events
      receipt.logs.forEach(log => {
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

      console.log("Quest initialized:", questId);
      document.getElementById('output').innerText = `Quest initialized with ID: ${questId}`;
    } catch (error) {
      console.error("Error initializing quest:", error);
    }
  }

  // Submit Content
  async function submitContent() {
    try {
      const contentUrl = "http://example.com";
      const hashtags = ["#test"];

      // Check if the quest is still active and not completed
      const quest = await contentCreatorQuestContract.quests(questId);
      if (!quest.isActive || quest.isCompleted) {
        throw new Error("Quest is either inactive or already completed.");
      }

      const contentData = web3Provider.eth.abi.encodeParameters(["string", "string[]"], [contentUrl, hashtags]);
      const tx = await contentCreatorQuestContract.interact(questId, await signer.getAddress(), "submit", contentData, {
        gasLimit: 500000 // Ensure sufficient gas
      });
      const receipt = await tx.wait();

      // Check for custom debug events
      receipt.logs.forEach(log => {
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

      console.log("Content submitted:", contentUrl);
      document.getElementById('output').innerText = `Content submitted: ${contentUrl}`;
    } catch (error) {
      console.error("Error submitting content:", error);
    }
  }

  // Check Submissions
  async function checkSubmissions() {
    try {
      const submissions = await contentCreatorQuestContract.getContentSubmissions(questId);
      console.log("Submissions:", submissions);
      document.getElementById('output').innerText = `Submissions: ${JSON.stringify(submissions)}`;
    } catch (error) {
      console.error("Error checking submissions:", error);
    }
  }

  document.getElementById('initialize-quest').addEventListener('click', async () => {
    await connectWallet();
    await initializeQuest();
  });

  document.getElementById('submit-content').addEventListener('click', async () => {
    await connectWallet();
    await submitContent();
  });

  document.getElementById('check-submissions').addEventListener('click', async () => {
    await connectWallet();
    await checkSubmissions();
  });
});

