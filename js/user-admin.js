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

	async function fetchUsers() {
		console.log("fetchUsers");
		await connectWallet(); // Ensure wallet is connected before proceeding
		const userManagerContract = await initializeUserContract(); // Ensure contract is initialized before calling methods

		let users = [];
		console.log('Provider before userManagerContract:', provider);
		const userCount = await userManagerContract.getUserCount();
		console.log(`fetch userCount: ${JSON.stringify(userCount, null, 2)}`);
		for (let i = 0; i < userCount; i++) {
			const user = await userManagerContract.getUserByIndex(i);
			console.log(`fetch user: ${JSON.stringify(user, null, 2)}`);
			users.push({
				id: user.userId.toNumber(),
				walletAddress: user.walletAddress,
				registeredQuests: user.registeredQuests.map(q => q.toNumber())
			});
		}
		console.log(`fetch users: ${JSON.stringify(users, null, 2)}`);
		return users;
	}

	async function populateUserList(users) {
		console.log(`users: ${JSON.stringify(users, null, 2)}`);
		const userList = document.getElementById('user-list');

		users.forEach(user => {
			const listItem = document.createElement('li');
			listItem.className = 'user-item';
			listItem.innerHTML = `
				<div class="user-id">User ID: <span>${user.id}</span></div>
				<div class="wallet-address">Wallet Address: <span>${user.walletAddress}</span></div>
			`;
			listItem.addEventListener('click', () => handleUserSelection(user, listItem));
			userList.appendChild(listItem);
		});
	}

	function handleUserSelection(user, listItem) {
		console.log(`User ${user.id} selected`);

		document.getElementById('user-id').value = user.id.toString();
		document.getElementById('wallet-address').value = user.walletAddress;

		const userItems = document.querySelectorAll('#user-list li');
		userItems.forEach(item => item.classList.remove('selected'));
		listItem.classList.add('selected');
	}

	async function initializeUserList() {
		console.log("initializeUserList");
		try {
			const users = await fetchUsers();
			await populateUserList(users);
		} catch (error) {
			console.error("Failed to fetch or populate users:", error);
		}
	}

	function clearFormFields() {
		var inputs = document.querySelectorAll('#user-form input');
		inputs.forEach(function(input) {
			input.value = '';
		});
	}

	document.getElementById('new-user').addEventListener('click', clearFormFields);

	async function createUser() {
		await connectWallet();
		console.log('Provider before userManagerContract:', provider);
		const userManagerContract = await initializeUserContract();
		const walletAddress = document.getElementById('wallet-address').value;
		try {
			// Check if the wallet address is valid
			if (!ethers.utils.isAddress(walletAddress)) {
					throw new Error("Invalid wallet address");
			}
			const txResponse = await userManagerContract.registerUser(walletAddress);
				// const txResponse = await userManagerContract.getUserCount();
			console.log(`User registration transaction hash: ${txResponse.hash}`);
			await txResponse.wait();
			console.log('User registered successfully');
			alert('User registered successfully');
			initializeUserList(); // Refresh user list
		} catch (error) {
			console.error('Error registering user:', error);
		}
	}

	document.getElementById('create-user').addEventListener('click', createUser);

	async function registerQuest() {
		await connectWallet();
		const userManagerContract = await initializeUserContract();
		const walletAddress = document.getElementById('wallet-address').value;
		const questId = parseInt(prompt("Enter Quest ID to register"), 10);
		if (isNaN(questId)) {
			alert("Invalid Quest ID");
			return;
		}
		try {
			const txResponse = await userManagerContract.registerForQuest(walletAddress, questId);
			console.log(`Quest registration transaction hash: ${txResponse.hash}`);
			await txResponse.wait();
			console.log('Quest registered successfully');
			alert('Quest registered successfully');
		} catch (error) {
			console.error('Error registering quest:', error);
		}
	}

	async function updateUser(oldWalletAddress, newWalletAddress) {
		await connectWallet();
		console.log('Provider before userManagerContract:', provider);
		const userManagerContract = await initializeUserContract();
		try {
			// Check if the wallet address is valid
			if (!ethers.utils.isAddress(newWalletAddress)) {
				throw new Error("Invalid wallet address");
			}
			const txResponse = await userManagerContract.updateUser(oldWalletAddress, newWalletAddress);
			console.log(`User update transaction hash: ${txResponse.hash}`);
			await txResponse.wait();
			console.log('User updated successfully');
			alert('User updated successfully');
			initializeUserList(); // Refresh user list
		} catch (error) {
			console.error('Error updating user:', error);
		}
	}

	document.getElementById('update-user').addEventListener('click', function() {
		const oldWalletAddress = document.getElementById('wallet-address').dataset.oldAddress;
		const newWalletAddress = document.getElementById('wallet-address').value;
		updateUser(oldWalletAddress, newWalletAddress);
	});

	async function deleteUser(walletAddress) {
		await connectWallet();
		console.log('Provider before userManagerContract:', provider);
		const userManagerContract = await initializeUserContract();
		try {
			const txResponse = await userManagerContract.deleteUser(walletAddress);
			console.log(`User delete transaction hash: ${txResponse.hash}`);
			await txResponse.wait();
			console.log('User deleted successfully');
			alert('User deleted successfully');
			initializeUserList(); // Refresh user list
		} catch (error) {
			console.error('Error deleting user:', error);
		}
	}

	document.getElementById('delete-user').addEventListener('click', function() {
		const walletAddress = document.getElementById('wallet-address').value;
		deleteUser(walletAddress);
	});

	async function registerQuest() {
		await connectWallet();
		const userManagerContract = await initializeUserContract();
		const walletAddress = document.getElementById('wallet-address').value;
		const questId = parseInt(prompt("Enter Quest ID to register"), 10);
		if (isNaN(questId)) {
			alert("Invalid Quest ID");
			return;
		}
		try {
			const txResponse = await userManagerContract.registerForQuest(walletAddress, questId);
			console.log(`Quest registration transaction hash: ${txResponse.hash}`);
			await txResponse.wait();
			console.log('Quest registered successfully');
			alert('Quest registered successfully');
		} catch (error) {
			console.error('Error registering quest:', error);
		}
	}


	document.getElementById('register-quest').addEventListener('click', registerQuest);

	initializeUserList();
});

