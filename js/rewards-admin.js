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

    async function fetchRewards() {
        await connectWallet();
        const rewardManagerContract = await initializeRewardsContract();
        console.log("after initialize");
        console.log("Available Contract Functions:", rewardManagerContract.functions); // Log available functions
        if (!rewardManagerContract) {
            console.error("rewardManagerContract Contract is not initialized");
            return;
          }
        let rewards = [];
        const rewardCount = await rewardManagerContract.getRewardCount();
        console.log(`rewardCount: ${rewardCount}`);
        for (let i = 1; i <= rewardCount; i++) {
          try {
            console.log(`rewardCount i: ${i}`);
            console.log(`rewardCount i - 1: ${i - 1}`);
            const reward = await rewardManagerContract.getRewardByIndex(i - 1);
            console.log(`reward-admin fetch reward: ${JSON.stringify(reward, null, 2)}`);
            rewards.push({
                id: reward.rewardId.toNumber(),
                attendeeId: reward.attendeeId.toNumber(),
                rewardPoolId: reward.rewardPoolId.toNumber(),
                amount: reward.amount.toNumber(),
                rewardType: reward.rewardType,
                poolWalletAddress: reward.poolWalletAddress
            });
          } catch (error) {
            console.error(`Failed to fetch rewward at index ${i}: ${error.message}`);
          }
        }
        return rewards;
    }

    async function populateRewardList(rewards) {
        const rewardList = document.getElementById('reward-list');
        rewardList.innerHTML = '';

        rewards.forEach(reward => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div class="reward-id">Reward ID: <span>${reward.id}</span></div>
                <div class="attendee-id">Attendee ID: <span>${reward.attendeeId}</span></div>
                <div class="reward-pool-id">Reward Pool ID: <span>${reward.rewardPoolId}</span></div>
                <div class="amount">Amount: <span>${reward.amount}</span></div>
                <div class="reward-type">Reward Type: <span>${reward.rewardType}</span></div>
                <div class="pool-wallet-address">Pool Wallet Address: <span>${reward.poolWalletAddress}</span></div>
            `;
            listItem.addEventListener('click', () => handleRewardSelection(reward, listItem));
            rewardList.appendChild(listItem);
        });
    }

    function handleRewardSelection(reward, listItem) {
        document.getElementById('reward-id').value = reward.id;
        document.getElementById('attendee-id').value = reward.attendeeId;
        document.getElementById('reward-pool-id').value = reward.rewardPoolId;
        document.getElementById('amount').value = reward.amount;
        document.getElementById('reward-type').value = reward.rewardType;
        document.getElementById('pool-wallet-address').value = reward.poolWalletAddress;

        const rewardItems = document.querySelectorAll('#reward-list li');
        rewardItems.forEach(item => item.classList.remove('selected'));
        listItem.classList.add('selected');
    }

    async function initializeRewardList() {
        try {
            const rewards = await fetchRewards();
            await populateRewardList(rewards);
        } catch (error) {
            console.error("Failed to fetch or populate rewards:", error);
        }
    }

    initializeRewardList();

    function clearFormFields() {
        var inputs = document.querySelectorAll('#reward-form input');
        inputs.forEach(function(input) {
            input.value = '';
        });
    }

    document.getElementById('new-reward').addEventListener('click', clearFormFields);

    async function createReward(attendeeId, rewardPoolId, amount, rewardType, poolWalletAddress) {
        const rewardManagerContract = await initializeRewardsContract();
        const txResponse = await rewardManagerContract.createReward(attendeeId, rewardPoolId, amount, rewardType, poolWalletAddress);
        await txResponse.wait();
        alert('Reward Created');
    }

    document.getElementById('create-reward').addEventListener('click', async function() {
        const attendeeId = document.getElementById('attendee-id').value;
        const rewardPoolId = document.getElementById('reward-pool-id').value;
        const amount = document.getElementById('amount').value;
        const rewardType = document.getElementById('reward-type').value;
        const poolWalletAddress = document.getElementById('pool-wallet-address').value;

        await createReward(attendeeId, rewardPoolId, amount, rewardType, poolWalletAddress);
    });

    async function updateReward(rewardId, attendeeId, rewardPoolId, amount, rewardType, poolWalletAddress) {
        const rewardManagerContract = await initializeRewardsContract();
        const txResponse = await rewardManagerContract.updateReward(rewardId, attendeeId, rewardPoolId, amount, rewardType, poolWalletAddress);
        await txResponse.wait();
        alert('Reward Updated');
    }

    document.getElementById('update-reward').addEventListener('click', async function() {
        const rewardId = document.getElementById('reward-id').value;
        const attendeeId = document.getElementById('attendee-id').value;
        const rewardPoolId = document.getElementById('reward-pool-id').value;
        const amount = document.getElementById('amount').value;
        const rewardType = document.getElementById('reward-type').value;
        const poolWalletAddress = document.getElementById('pool-wallet-address').value;

        await updateReward(rewardId, attendeeId, rewardPoolId, amount, rewardType, poolWalletAddress);
    });

    async function deleteReward(rewardId) {
        const rewardManagerContract = await initializeRewardsContract();
        const txResponse = await rewardManagerContract.deleteReward(rewardId);
        await txResponse.wait();
        alert('Reward Deleted');
    }

    document.getElementById('delete-reward').addEventListener('click', async function() {
        const rewardId = document.getElementById('reward-id').value;
        await deleteReward(rewardId);
    });

  let rewardManagerContract;

  async function fetchrewardsABI() {
      console.log("reward-admin fetchrewardsABI");
      let response = await fetch('Rewards.json');
      const data = await response.json();
      console.log(`data.abi ${data.abi}`);
      return data.abi; // Assuming the ABI is stored under the key 'abi'
  }
  async function initializeRewardsContract() {
      console.log("reward-admin initializeRewardContract");
      const contractAddress = "0x2cE326C939328D2168E705faf832E661e564373e";
      rewardsABI = await fetchrewardsABI(); // Fetch and assign the ABI

      rewardManagerContract = new ethers.Contract(contractAddress, rewardsABI, signer);
      return rewardManagerContract;
  }
  // async function initializePage() {
  //   try {
  //     await connectWallet();
  //     await fetchAndPopulateEvents();
  //     await fetchAndPopulateQuests();
  //     await fetchQuestEvents();
  //   } catch (error) {
  //     console.error("Failed to initialize page:", error);
  //   }
  // }
  //
  // initializePage();
});
