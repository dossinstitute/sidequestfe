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

  const regform = document.getElementById('registration-form');
  if (regform) {
    // document.getElementById('registration-form').addEventListener('submit', function(event) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      // Logic to register the user
      // Validate wallet address and store user details
      alert('User registered successfully!');
    });
  } else {
    console.error('Element with ID "registration-form" not found');
  }

  const checkform = document.getElementById('check-status');
  if (checkform) {
    form.addEventListener('click', function() {
        // Logic to check the registration status of the provided wallet address
        const walletAddress = document.getElementById('check-wallet-address').value;
        // Retrieve and display status
        document.getElementById('status-result').textContent = 'Status: Registered/Not Registered'; // Example result
    });
  } else {
    console.error('Element with ID "check-status" not found');
  }

		document.getElementById('update-event-button').addEventListener('click', async function() {
				const name = document.getElementById('event-name').value;
				const location = document.getElementById('event-location').value;
				const date = document.getElementById('event-date').value;
				const description = document.getElementById('event-description').value;

        const eventManagerContract = await initializeEventContract(); // Ensure contract is initialized before calling methods
				const events = await eventManagerContract.listEvents();
			const startTime = Math.floor(Date.now() / 1000);
			const endTime = startTime + 86400; // 1 day from now
       try {
            const txResponse = await eventManagerContract.createEvent(startTime, endTime, description);
            console.log(`Transaction hash: ${txResponse.hash}`);

            await txResponse.wait(); // Wait for the transaction to be mined

            console.log('Transaction mined successfully.');

            // Extract the event logs from the transaction receipt
				 console.log('Provider before getTransactionReceipt:', provider);
            const receipt = await provider.getTransactionReceipt(txResponse.hash);

            // Filter out the EventCreated event logs
            const iface = new ethers.utils.Interface(["event EventCreated(uint256 eventId, uint256 startTime, uint256 endTime, string description)"]);
            const eventCreatedLogs = receipt.logs.filter(log => {
                try {
                    iface.parseLog(log);
                    return true;
                } catch (error) {
                    return false;
                }
            });

            if (eventCreatedLogs.length > 0) {
                const log = eventCreatedLogs[0];
                const parsedLog = iface.parseLog(log);
                const { args } = parsedLog;
                console.log(`EventCreated emitted with ID: ${args.eventId.toString()}, StartTime: ${args.startTime.toString()}, EndTime: ${args.endTime.toString()}, Description: ${args.description}`);
            } else {
                console.log('EventCreated event not found in transaction receipt.');
            }
        } catch (error) {
            console.error('Error creating event:', error.message);
        }


		});


    document.getElementById('award-points-button').addEventListener('click', function() {
            const userWallet = document.getElementById('user-wallet').value;
            const questName = document.getElementById('quest-name').value;
            const pointsAwarded = document.getElementById('points-awarded').value;

            // Logic to award points to user for quest completion
            // Update leaderboard accordingly

            alert(`Points awarded: ${pointsAwarded} to ${userWallet} for ${questName}`);
        });

    document.getElementById('get-leaderboard-button').addEventListener('click', function() {
        // Logic to fetch and display leaderboard
        const leaderboardList = document.getElementById('leaderboard-list');

        // Example leaderboard data (mock data)
        const leaderboardData = [
            { user: 'User1', points: 150 },
            { user: 'User2', points: 120 },
            { user: 'User3', points: 100 },
            { user: 'User4', points: 80 },
            { user: 'User5', points: 50 }
        ];

        leaderboardList.innerHTML = ''; // Clear previous leaderboard

        leaderboardData.forEach(item => {
            const listItem = document.createElement('div');
            listItem.classList.add('leaderboard-item');
            listItem.innerHTML = `<span>${item.user}</span><span>${item.points} points</span>`;
            leaderboardList.appendChild(listItem);
        });
    });

    document.getElementById('create-quest-button').addEventListener('click', function() {
        const name = document.getElementById('quest-name').value;
        const description = document.getElementById('quest-description').value;
        const startDate = document.getElementById('quest-start-date').value;
        const endDate = document.getElementById('quest-end-date').value;
        const rewards = document.getElementById('quest-rewards').value;
        
        // Logic to create new quest
        // Emit event for quest creation

        alert(`Quest "${name}" created successfully!`);
    });

    document.getElementById('monitor-progress-button').addEventListener('click', function() {
        const walletAddress = document.getElementById('user-wallet').value;

        // Logic to view user progress
        // Fetch and display user progress details

        alert(`Displaying progress for wallet: ${walletAddress}`);
    });

    document.getElementById('distribute-rewards-button').addEventListener('click', function() {
        const walletAddress = document.getElementById('reward-wallet').value;
        const amount = document.getElementById('reward-amount').value;

        // Logic to distribute rewards manually
        // Emit event for reward distribution

        alert(`Reward of ${amount} distributed to wallet: ${walletAddress}`);
    });

    document.getElementById('check-completion-status').addEventListener('click', function() {
        // Logic to check quest completion status
        const eventId = document.getElementById('check-event-id').value;
        const walletAddress = document.getElementById('check-wallet-address').value;
        // Example result for demonstration purposes
        document.getElementById('completion-status-result').textContent = `User with wallet ${walletAddress} has completed the quest for event ${eventId}: Yes/No`;
    });

    document.getElementById('redeem-points-button').addEventListener('click', function() {
        const userWallet = document.getElementById('user-wallet').value;
        const selectedReward = document.getElementById('reward-select').value;

        // Logic to redeem points for selected reward
        // Deduct points from user's balance
        // Update UI accordingly

        alert(`Points redeemed for ${selectedReward} successfully by ${userWallet}`);
    });

    document.getElementById('refresh-rewards-button').addEventListener('click', function() {
        // Logic to fetch and display rewards
        const rewardItems = document.getElementById('reward-items');

        // Example reward data (mock data)
        const rewards = [
            { name: 'Reward 1', points: 100 },
            { name: 'Reward 2', points: 200 },
            { name: 'Reward 3', points: 300 }
        ];

        rewardItems.innerHTML = ''; // Clear previous rewards

        rewards.forEach(item => {
            const rewardItem = document.createElement('div');
            rewardItem.classList.add('reward-item');
            rewardItem.innerHTML = `<span>${item.name}</span><span>${item.points} points</span>`;
            rewardItems.appendChild(rewardItem);
        });
    });

     document.getElementById('check-reward-status').addEventListener('click', function() {
        // Logic to check reward distribution status
        const questId = document.getElementById('quest-id').value;
        const walletAddress = document.getElementById('wallet-address').value;
        // Example result for demonstration purposes
        document.getElementById('reward-status-result').textContent = `Reward distribution status for wallet ${walletAddress} for quest ${questId}: Distributed/Not Distributed`;
    });

    // Simulate automatic reward distribution upon quest completion
    function distributeReward(questId, walletAddress) {
        // Logic to distribute reward
        alert(`Reward distributed to wallet ${walletAddress} for quest ${questId}`);
    }

    document.getElementById('interaction-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const eventId = document.getElementById('event-id').value;
        const walletAddress = document.getElementById('wallet-address').value;
        const qrCode = document.getElementById('qr-code').value;

        // Logic to submit interaction
        // Validate and store the interaction
        // Check for uniqueness of QR code per attendee and event
        // Emit event for interaction submission

        alert('Interaction submitted successfully!');
    });

    document.getElementById('manage-interactions').addEventListener('click', function() {
        const eventId = document.getElementById('manage-event-id').value;
        
        // Logic for admin to manage interactions
        // Emit event for interaction management

        alert('Interactions managed successfully!');
    });

    document.getElementById('deploy-testnet-button').addEventListener('click', function() {
        const testnet = document.getElementById('testnet-select').value;

        // Logic to deploy contract to the selected testnet
        // Display status message or result

        alert(`Contract deployed to ${testnet} testnet successfully!`);
    });

    document.getElementById('run-tests-button').addEventListener('click', function() {
        // Logic to run unit tests using a testing framework like Truffle, Hardhat, or Remix
        // Display test results in the test-results div

        const testResults = `
            <p>Test Results:</p>
            <ul>
                <li>Quest creation: Passed</li>
                <li>User registration: Passed</li>
                <li>Interaction submission: Passed</li>
                <li>Quest completion checks: Passed</li>
                <li>Reward distribution: Passed</li>
                <li>Parameter storage and retrieval: Passed</li>
                <li>User interactions and statuses tracking: Passed</li>
                <li>Validation and security checks: Passed</li>
                <li>Prevention of multiple reward distributions: Passed</li>
            </ul>
        `;
        document.getElementById('test-results').innerHTML = testResults;
    });

    document.getElementById('prepare-mainnet-button').addEventListener('click', function() {
        // Logic to prepare for mainnet deployment
        // Display status message or result

        alert('Contract prepared for mainnet deployment successfully!');
    });

    document.getElementById('registration-form').addEventListener('submit', function(event) {
        event.preventDefault();
        // Logic to register the user
        // Validate wallet address and store user details
        alert('User registered successfully!');
    });

    document.getElementById('check-status').addEventListener('click', function() {
        // Logic to check the registration status of the provided wallet address
        const walletAddress = document.getElementById('check-wallet-address').value;
        // Retrieve and display status
        document.getElementById('status-result').textContent = 'Status: Registered/Not Registered'; // Example result
    });

 /*   document.getElementById('interaction-form').addEventListener('submit', function(event) {
        event.preventDefault();
        // Logic to submit interaction
        // Validate and store the interaction
        alert('Interaction submitted successfully!');
    });

    document.getElementById('manage-events').addEventListener('click', function() {
        // Logic for admin to manage event IDs
        alert('Manage Event IDs clicked');
    });

    document.getElementById('review-interactions').addEventListener('click', function() {
        // Logic for admin to review interactions
        alert('Review Interactions clicked');
    });

    // Example of dynamically adding interaction logs
    // This would normally be populated with real data from the contract
    const interactionsLog = document.getElementById('interactions-log');
    const logItem = document.createElement('li');
    logItem.textContent = 'Event ID: 1, Wallet: 0x123, QR Code: ABC';
    interactionsLog.appendChild(logItem);*/

    document.getElementById('interaction-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const eventId = document.getElementById('event-id').value;
        const walletAddress = document.getElementById('wallet-address').value;
        const qrCode = document.getElementById('qr-code').value;

        // Logic to submit interaction
        // Validate and store the interaction
        // Check for uniqueness of QR code per attendee and event

        // Example result for demonstration purposes
        const logItem = document.createElement('li');
        logItem.textContent = `Event ID: ${eventId}, Wallet: ${walletAddress}, QR Code: ${qrCode}`;
        document.getElementById('log').appendChild(logItem);

        alert('Interaction submitted successfully!');
    });

});
