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
  const sponsorQuestRequirementsContractAddress = "0x71C953E5F22b290f813B4695BFc4a5100538Fb51";
  const questTypeEventContractAddress = "0x92e0043d21C38dCd1C5B6e4dAfdbf2fd57FB70bF";
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  async function initializeSponsorQuestRequirementsContract() {
    return await initializeContract(provider, 'SponsorQuestRequirements.json', sponsorQuestRequirementsContractAddress);
  }

  async function initializeQuestTypeEventContract() {
    return await initializeContract(provider, 'QuestTypeEvent.json', questTypeEventContractAddress);
  }

  async function fetchAndPopulateQuestTypeEvents() {
    await connectWalletByProvider(provider);
    const questTypeEventContract = await initializeQuestTypeEventContract();
    const questTypeEventCount = await questTypeEventContract.getQuestTypeEventCount();
    const questTypeEventSelect = document.getElementById('quest-type-event-id');

    for (let i = 0; i < questTypeEventCount; i++) {
      const questTypeEvent = await questTypeEventContract.getQuestTypeEventByIndex(i);
      const option = document.createElement('option');
      option.value = questTypeEvent.questTypeEventId;
      option.textContent = `${questTypeEvent.name} (${questTypeEvent.questTypeEventId})`;
      questTypeEventSelect.appendChild(option);
    }
  }

  async function fetchSponsorQuestRequirements() {
    await connectWalletByProvider(provider);
    const sponsorQuestRequirementsContract = await initializeSponsorQuestRequirementsContract();
    const sponsorQuestRequirementsList = document.getElementById('sponsor-quest-requirements-list');
    const sponsorQuestRequirementCount = await sponsorQuestRequirementsContract.getSponsorQuestRequirementCount();

    let sponsorQuestRequirements = [];
    for (let i = 0; i < sponsorQuestRequirementCount; i++) {
      const sponsorQuestRequirement = await sponsorQuestRequirementsContract.getSponsorQuestRequirementByIndex(i);
      sponsorQuestRequirements.push(sponsorQuestRequirement);
    }
    populateSponsorQuestRequirementsList(sponsorQuestRequirements);
  }

  function populateSponsorQuestRequirementsList(sponsorQuestRequirements) {
    const sponsorQuestRequirementsList = document.getElementById('sponsor-quest-requirements-list');
    sponsorQuestRequirementsList.innerHTML = '';

    sponsorQuestRequirements.forEach(sponsorQuestRequirement => {
      const listItem = document.createElement('li');
      listItem.className = 'sponsor-quest-requirement-item';
      listItem.innerHTML = `
        <div class="sponsor-quest-requirement-id">Sponsor Quest Requirement ID: <span>${sponsorQuestRequirement.sqrId}</span></div>
        <div class="quest-type-event-id">Quest Type Event ID: <span>${sponsorQuestRequirement.questTypeEventId}</span></div>
        <div class="sponsor-hashtags">Sponsor Hashtags: <span>${sponsorQuestRequirement.sponsorHashtags}</span></div>
        <div class="sponsor-hashtags-required">Sponsor Hashtags Required: <span>${sponsorQuestRequirement.sponsorHashtagsRequired}</span></div>
      `;
      listItem.addEventListener('click', () => handleSponsorQuestRequirementSelection(sponsorQuestRequirement, listItem));
      sponsorQuestRequirementsList.appendChild(listItem);
    });
  }

  function handleSponsorQuestRequirementSelection(sponsorQuestRequirement, listItem) {
    document.getElementById('sqr-id').value = sponsorQuestRequirement.sqrId;
    document.getElementById('quest-type-event-id').value = sponsorQuestRequirement.questTypeEventId;
    document.getElementById('sponsor-hashtags').value = sponsorQuestRequirement.sponsorHashtags;
    document.getElementById('sponsor-hashtags-required').checked = sponsorQuestRequirement.sponsorHashtagsRequired;

    const sponsorQuestRequirementItems = document.querySelectorAll('#sponsor-quest-requirements-list li');
    sponsorQuestRequirementItems.forEach(item => item.classList.remove('selected'));
    listItem.classList.add('selected');
  }

  async function createSponsorQuestRequirement() {
    const sponsorQuestRequirementsContract = await initializeSponsorQuestRequirementsContract();
    const questTypeEventId = parseInt(document.getElementById('quest-type-event-id').value, 10);
    const sponsorHashtags = document.getElementById('sponsor-hashtags').value;
    const sponsorHashtagsRequired = document.getElementById('sponsor-hashtags-required').checked;

    try {
      const txResponse = await sponsorQuestRequirementsContract.createSponsorQuestRequirement(questTypeEventId, sponsorHashtags, sponsorHashtagsRequired);
      console.log(`Sponsor Quest Requirement creation transaction hash: ${txResponse.hash}`);
      await txResponse.wait();
      console.log('Sponsor Quest Requirement created successfully');
      alert('Sponsor Quest Requirement created successfully');
      fetchSponsorQuestRequirements(); // Refresh sponsor quest requirements list
    } catch (error) {
      console.error('Error creating sponsor quest requirement:', error);
    }
  }

  async function updateSponsorQuestRequirement() {
    const sponsorQuestRequirementsContract = await initializeSponsorQuestRequirementsContract();
    const sqrId = parseInt(document.getElementById('sqr-id').value, 10);
    const questTypeEventId = parseInt(document.getElementById('quest-type-event-id').value, 10);
    const sponsorHashtags = document.getElementById('sponsor-hashtags').value;
    const sponsorHashtagsRequired = document.getElementById('sponsor-hashtags-required').checked;

    try {
      const txResponse = await sponsorQuestRequirementsContract.updateSponsorQuestRequirement(sqrId, questTypeEventId, sponsorHashtags, sponsorHashtagsRequired);
      console.log(`Sponsor Quest Requirement update transaction hash: ${txResponse.hash}`);
      await txResponse.wait();
      console.log('Sponsor Quest Requirement updated successfully');
      alert('Sponsor Quest Requirement updated successfully');
      fetchSponsorQuestRequirements(); // Refresh sponsor quest requirements list
    } catch (error) {
      console.error('Error updating sponsor quest requirement:', error);
    }
  }

  async function deleteSponsorQuestRequirement() {
    const sponsorQuestRequirementsContract = await initializeSponsorQuestRequirementsContract();
    const sqrId = parseInt(document.getElementById('sqr-id').value, 10);

    try {
      const txResponse = await sponsorQuestRequirementsContract.deleteSponsorQuestRequirement(sqrId);
      console.log(`Sponsor Quest Requirement delete transaction hash: ${txResponse.hash}`);
      await txResponse.wait();
      console.log('Sponsor Quest Requirement deleted successfully');
      alert('Sponsor Quest Requirement deleted successfully');
      fetchSponsorQuestRequirements(); // Refresh sponsor quest requirements list
    } catch (error) {
      console.error('Error deleting sponsor quest requirement:', error);
    }
  }

  document.getElementById('new-sponsor-quest-requirement').addEventListener('click', clearFormFields);
  document.getElementById('create-sponsor-quest-requirement').addEventListener('click', createSponsorQuestRequirement);
  document.getElementById('update-sponsor-quest-requirement').addEventListener('click', updateSponsorQuestRequirement);
  document.getElementById('delete-sponsor-quest-requirement').addEventListener('click', deleteSponsorQuestRequirement);

  function clearFormFields() {
    document.getElementById('sponsor-quest-requirement-form').reset();
  }

  async function initializePage() {
    try {
      await connectWalletByProvider(provider);
      await fetchAndPopulateQuestTypeEvents();
      await fetchSponsorQuestRequirements();
    } catch (error) {
      console.error("Failed to initialize page:", error);
    }
  }

  initializePage();
});

