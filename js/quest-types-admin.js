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

  const questTypesContractAddress = "0x2d39372e07C71C0F26ec00c7350AAba5Fe2d4141";
  const questTypesABIPath = 'QuestTypes.json'; // Path to your ABI file

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer;

  async function fetchQuestTypes() {
    await connectWallet();
    const questTypesContract = await initializeContract(provider, questTypesABIPath, questTypesContractAddress);
    const questTypeList = document.getElementById('quest-type-list');
    const questTypeCount = await questTypesContract.getQuestTypeCount();

    let questTypes = [];
    for (let i = 0; i < questTypeCount; i++) {
      const questType = await questTypesContract.readQuestType(i + 1); // Adjust for 1-based indexing
      questTypes.push(questType);
    }
    populateQuestTypeList(questTypes);
  }

  function populateQuestTypeList(questTypes) {
    const questTypeList = document.getElementById('quest-type-list');
    questTypeList.innerHTML = '';

    questTypes.forEach(questType => {
      const listItem = document.createElement('li');
      listItem.className = 'quest-type-item';
      listItem.innerHTML = `
        <div class="quest-type-id">Quest Type ID: <span>${questType.questTypeId}</span></div>
        <div class="name">Name: <span>${questType.name}</span></div>
      `;
      listItem.addEventListener('click', () => handleQuestTypeSelection(questType, listItem));
      questTypeList.appendChild(listItem);
    });
  }

  function handleQuestTypeSelection(questType, listItem) {
    document.getElementById('quest-type-id').value = questType.questTypeId;
    document.getElementById('name').value = questType.name;
    document.getElementById('description').value = questType.description;
    document.getElementById('screen-name').value = questType.screenName;
    document.getElementById('quest-contract-name').value = questType.questContractName;
    document.getElementById('quest-contract-address').value = questType.questContractAddress;
    document.getElementById('sponsor-requirements-contract-name').value = questType.sponsorRequirementsContractName;
    document.getElementById('sponsor-requirements-address').value = questType.sponsorRequirementsAddress;

    const questTypeItems = document.querySelectorAll('#quest-type-list li');
    questTypeItems.forEach(item => item.classList.remove('selected'));
    listItem.classList.add('selected');
  }

  async function createQuestType() {
    await connectWallet();
    const questTypesContract = await initializeContract(provider, questTypesABIPath, questTypesContractAddress);
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const screenName = document.getElementById('screen-name').value;
    const questContractName = document.getElementById('quest-contract-name').value;
    const questContractAddress = document.getElementById('quest-contract-address').value;
    const sponsorRequirementsContractName = document.getElementById('sponsor-requirements-contract-name').value;
    const sponsorRequirementsAddress = document.getElementById('sponsor-requirements-address').value;

    try {
      const txResponse = await questTypesContract.createQuestType(name, description, screenName, questContractName, questContractAddress, sponsorRequirementsContractName, sponsorRequirementsAddress);
      console.log(`Quest Type creation transaction hash: ${txResponse.hash}`);
      await txResponse.wait();
      console.log('Quest Type created successfully');
      alert('Quest Type created successfully');
      fetchQuestTypes(); // Refresh quest type list
    } catch (error) {
      handleError(error);
    }
  }

  async function updateQuestType() {
    await connectWallet();
    const questTypesContract = await initializeContract(provider, questTypesABIPath, questTypesContractAddress);
    const questTypeId = document.getElementById('quest-type-id').value;
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const screenName = document.getElementById('screen-name').value;
    const questContractName = document.getElementById('quest-contract-name').value;
    const questContractAddress = document.getElementById('quest-contract-address').value;
    const sponsorRequirementsContractName = document.getElementById('sponsor-requirements-contract-name').value;
    const sponsorRequirementsAddress = document.getElementById('sponsor-requirements-address').value;

    try {
      const txResponse = await questTypesContract.updateQuestType(questTypeId, name, description, screenName, questContractName, questContractAddress, sponsorRequirementsContractName, sponsorRequirementsAddress);
      console.log(`Quest Type update transaction hash: ${txResponse.hash}`);
      await txResponse.wait();
      console.log('Quest Type updated successfully');
      alert('Quest Type updated successfully');
      fetchQuestTypes(); // Refresh quest type list
    } catch (error) {
      handleError(error);
    }
  }

  async function deleteQuestType() {
    await connectWallet();
    const questTypesContract = await initializeContract(provider, questTypesABIPath, questTypesContractAddress);
    const questTypeId = document.getElementById('quest-type-id').value;

    try {
      const txResponse = await questTypesContract.deleteQuestType(questTypeId);
      console.log(`Quest Type delete transaction hash: ${txResponse.hash}`);
      await txResponse.wait();
      console.log('Quest Type deleted successfully');
      alert('Quest Type deleted successfully');
      fetchQuestTypes(); // Refresh quest type list
    } catch (error) {
      handleError(error);
    }
  }

  document.getElementById('new-quest-type').addEventListener('click', clearFormFields);
  document.getElementById('create-quest-type').addEventListener('click', createQuestType);
  document.getElementById('update-quest-type').addEventListener('click', updateQuestType);
  document.getElementById('delete-quest-type').addEventListener('click', deleteQuestType);

  function clearFormFields() {
    document.getElementById('quest-type-form').reset();
  }

  async function initializePage() {
    try {
      await connectWallet();
      await fetchQuestTypes();
    } catch (error) {
      console.error("Failed to initialize page:", error);
    }
  }

  initializePage();
});

