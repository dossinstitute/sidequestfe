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

  async function fetchSponsors() {
    console.log("fetchSponsors");
    await connectWallet(); // Ensure wallet is connected before proceeding
    const sponsorsContract = await initializeSponsorsContract(); // Ensure contract is initialized before calling methods

    let sponsors = [];
    console.log('Provider before sponsorsContract:', provider);
    const sponsorList = await sponsorsContract.listSponsors();
    console.log(`fetch sponsorList: ${JSON.stringify(sponsorList, null, 2)}`);
    sponsors = sponsorList.map(sponsor => ({
      id: sponsor.sponsorId.toNumber(),
      companyName: sponsor.companyName,
      wallet: sponsor.wallet,
      rewardPoolId: sponsor.rewardPoolId.toNumber()
    }));
    console.log(`fetch sponsors: ${JSON.stringify(sponsors, null, 2)}`);
    return sponsors;
  }

  async function populateSponsorList(sponsors) {
    console.log(`sponsors: ${JSON.stringify(sponsors, null, 2)}`);
    const sponsorList = document.getElementById('sponsor-list');

    sponsors.forEach(sponsor => {
      const listItem = document.createElement('li');
      listItem.className = 'sponsor-item';
      listItem.innerHTML = `
        <div class="sponsor-id">Sponsor ID: <span>${sponsor.id}</span></div>
        <div class="company-name">Company Name: <span>${sponsor.companyName}</span></div>
        <div class="wallet-address">Wallet Address: <span>${sponsor.wallet}</span></div>
        <div class="reward-pool-id">Reward Pool ID: <span>${sponsor.rewardPoolId}</span></div>
      `;
      listItem.addEventListener('click', () => handleSponsorSelection(sponsor, listItem));
      sponsorList.appendChild(listItem);
    });
  }

  function handleSponsorSelection(sponsor, listItem) {
    console.log(`Sponsor ${sponsor.id} selected`);

    document.getElementById('sponsor-id').value = sponsor.id.toString();
    document.getElementById('company-name').value = sponsor.companyName;
    document.getElementById('wallet-address').value = sponsor.wallet;
    document.getElementById('reward-pool-id').value = sponsor.rewardPoolId;

    const sponsorItems = document.querySelectorAll('#sponsor-list li');
    sponsorItems.forEach(item => item.classList.remove('selected'));
    listItem.classList.add('selected');
  }

  async function initializeSponsorList() {
    console.log("initializeSponsorList");
    try {
      const sponsors = await fetchSponsors();
      await populateSponsorList(sponsors);
    } catch (error) {
      console.error("Failed to fetch or populate sponsors:", error);
      alert("Failed to fetch or populate sponsors. Please try again later.");
    }
  }

  function clearFormFields() {
    var inputs = document.querySelectorAll('#sponsor-form input');
    inputs.forEach(function(input) {
      input.value = '';
    });
  }

  document.getElementById('new-sponsor').addEventListener('click', clearFormFields);

  async function createSponsor() {
    await connectWallet();
    console.log('Provider before sponsorsContract:', provider);
    const sponsorsContract = await initializeSponsorsContract();
    const companyName = document.getElementById('company-name').value;
    const wallet = document.getElementById('wallet-address').value;
    const rewardPoolId = document.getElementById('reward-pool-id').value;
    try {
      // Check if the wallet address is valid
      if (!ethers.utils.isAddress(wallet)) {
        throw new Error("Invalid wallet address");
      }
      // Ensure reward pool ID is a valid number
      if (isNaN(rewardPoolId) || rewardPoolId <= 0) {
        throw new Error("Reward Pool ID must be a positive number");
      }
      console.log(`Creating sponsor with company name: ${companyName}, wallet: ${wallet}, reward pool ID: ${rewardPoolId}`);
      const txResponse = await sponsorsContract.createSponsor(companyName, wallet, rewardPoolId);
      console.log(`Sponsor creation transaction hash: ${txResponse.hash}`);
      await txResponse.wait();
      console.log('Sponsor created successfully');
      alert('Sponsor created successfully');
      initializeSponsorList(); // Refresh sponsor list
    } catch (error) {
      console.error('Error creating sponsor:', error);
      alert(`Error creating sponsor: ${error.message}`);
    }
  }

  document.getElementById('create-sponsor').addEventListener('click', createSponsor);

  async function updateSponsor(sponsorId, companyName, newWallet, newRewardPoolId) {
    await connectWallet();
    console.log('Provider before sponsorsContract:', provider);
    const sponsorsContract = await initializeSponsorsContract();
    try {
      // Check if the wallet address is valid
      if (!ethers.utils.isAddress(newWallet)) {
        throw new Error("Invalid wallet address");
      }
      // Ensure reward pool ID is a valid number
      if (isNaN(newRewardPoolId) || newRewardPoolId <= 0) {
        throw new Error("Reward Pool ID must be a positive number");
      }
      console.log(`Updating sponsor with ID: ${sponsorId}, new company name: ${companyName}, new wallet: ${newWallet}, new reward pool ID: ${newRewardPoolId}`);
      const txResponse = await sponsorsContract.updateSponsor(sponsorId, companyName, newWallet, newRewardPoolId);
      console.log(`Sponsor update transaction hash: ${txResponse.hash}`);
      await txResponse.wait();
      console.log('Sponsor updated successfully');
      alert('Sponsor updated successfully');
      initializeSponsorList(); // Refresh sponsor list
    } catch (error) {
      console.error('Error updating sponsor:', error);
      alert(`Error updating sponsor: ${error.message}`);
    }
  }

  document.getElementById('update-sponsor').addEventListener('click', function() {
    const sponsorId = document.getElementById('sponsor-id').value;
    const companyName = document.getElementById('company-name').value;
    const newWallet = document.getElementById('wallet-address').value;
    const newRewardPoolId = document.getElementById('reward-pool-id').value;
    updateSponsor(sponsorId, companyName, newWallet, newRewardPoolId);
  });

  async function deleteSponsor(sponsorId) {
    await connectWallet();
    console.log('Provider before sponsorsContract:', provider);
    const sponsorsContract = await initializeSponsorsContract();
    try {
      console.log(`Deleting sponsor with ID: ${sponsorId}`);
      const txResponse = await sponsorsContract.deleteSponsor(sponsorId);
      console.log(`Sponsor delete transaction hash: ${txResponse.hash}`);
      await txResponse.wait();
      console.log('Sponsor deleted successfully');
      alert('Sponsor deleted successfully');
      initializeSponsorList(); // Refresh sponsor list
    } catch (error) {
      console.error('Error deleting sponsor:', error);
      alert(`Error deleting sponsor: ${error.message}`);
    }
  }

  document.getElementById('delete-sponsor').addEventListener('click', function() {
    const sponsorId = document.getElementById('sponsor-id').value;
    deleteSponsor(sponsorId);
  });

  initializeSponsorList();
});

const sponsorsContractAddress = "0x50eAcFfa273B9bD000fdea9102abEcb68d8c6544";

async function initializeSponsorsContract() {
  console.log("initializeSponsorsContract");
  const sponsorsABI = await fetchSponsorsABI(); // Fetch and assign the ABI
  const sponsorsContract = new ethers.Contract(sponsorsContractAddress, sponsorsABI, signer);
  return sponsorsContract;
}

async function fetchSponsorsABI() {
  let response = await fetch('Sponsors.json');
  const data = await response.json();
  return data.abi; // Assuming the ABI is stored under the key 'abi'
}
