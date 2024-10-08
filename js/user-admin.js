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
    console.log("user-admin fetchUsers");
    await connectWallet(); // Ensure wallet is connected before proceeding
    const usersContract = await initializeNewUsersContract(); // Ensure contract is initialized before calling methods

    let users = [];
    console.log('user-admin Provider before usersContract:', provider);
    const userCount = await usersContract.getUserCount();
    console.log(`user-admin fetch userCount: ${userCount}`);

    for (let i = 0; i < userCount; i++) {
      try {
        const user = await usersContract.getUserByIndex(i);
        console.log(`user-admin fetch user: ${JSON.stringify(user, null, 2)}`);
        users.push({
          id: user.userId.toNumber(),
          wallet: user.wallet,
          role: user.role
          });
        } catch (error) {
          console.error(`Failed to fetch user at index ${i}: ${error.message}`);
          }
      }

    console.log(`user-admin fetch users: ${JSON.stringify(users, null, 2)}`);
    return users;
    }

  async function populateUserList(users) {
    console.log("user-admin populateUserList");
    console.log(`user-admin users: ${JSON.stringify(users, null, 2)}`);
    const userList = document.getElementById('user-list');

    users.forEach(user => {
      const listItem = document.createElement('li');
      listItem.className = 'user-item';
      listItem.innerHTML = `
      <div class="user-id">User ID: <span>${user.id}</span></div>
      <div class="wallet-address">Wallet Address: <span>${user.wallet}</span></div>
      <div class="role">Role: <span>${user.role}</span></div>
      `;
      listItem.addEventListener('click', () => handleUserSelection(user, listItem));
      userList.appendChild(listItem);
    });
    console.log("user-admin populateUserList end");
  }

  function handleUserSelection(user, listItem) {
    console.log(`User ${user.id} selected`);

      document.getElementById('user-id').value = user.id.toString();
      document.getElementById('wallet-address').value = user.wallet;
      document.getElementById('role').value = user.role;

      const userItems = document.querySelectorAll('#user-list li');
      userItems.forEach(item => item.classList.remove('selected'));
      listItem.classList.add('selected');
      }

    async function initializeUserList() {
      console.log("user-admin initializeUserList");
      try {
        const users = await fetchUsers();
        console.log(`user-admin initializeUserList fetchUsers ${users}`);
        await populateUserList(users);
        console.log(`after populateUserList(users)`);
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
      console.log('Provider before usersContract:', provider);
      const usersContract = await initializeNewUsersContract();
      const wallet = document.getElementById('wallet-address').value;
      const role = document.getElementById('role').value;
      try {
        // Check if the wallet address is valid
        if (!ethers.utils.isAddress(wallet)) {
          throw new Error("Invalid wallet address");
          }
        // Ensure role is not empty
        if (!role || role.trim() === "") {
          throw new Error("Role cannot be empty");
          }
        console.log(`Creating user with wallet: ${wallet}, role: ${role}`);
        const txResponse = await usersContract.createUser(wallet, role);
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

    async function updateUser(userId, newWallet, newRole) {
      await connectWallet();
      console.log('Provider before usersContract:', provider);
      const usersContract = await initializeNewUsersContract();
      try {
        // Check if the wallet address is valid
        if (!ethers.utils.isAddress(newWallet)) {
          throw new Error("Invalid wallet address");
          }
        // Ensure role is not empty
        if (!newRole || newRole.trim() === "") {
          throw new Error("Role cannot be empty");
          }
        console.log(`Updating user with ID: ${userId}, new wallet: ${newWallet}, new role: ${newRole}`);
        const txResponse = await usersContract.updateUser(userId, newWallet, newRole);
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
      const userId = document.getElementById('user-id').value;
      const newWallet = document.getElementById('wallet-address').value;
      const newRole = document.getElementById('role').value;
      updateUser(userId, newWallet, newRole);
    });

    async function deleteUser(userId) {
      await connectWallet();
      console.log('Provider before usersContract:', provider);
      const usersContract = await initializeNewUsersContract();
      try {
        console.log(`Deleting user with ID: ${userId}`);
        const txResponse = await usersContract.deleteUser(userId);
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
      const userId = document.getElementById('user-id').value;
      deleteUser(userId);
    });

    async function registerQuest() {
      await connectWallet();
      const usersContract = await initializeNewUsersContract();
      const userId = document.getElementById('user-id').value;
      const questId = parseInt(prompt("Enter Quest ID to register"), 10);
      if (isNaN(questId)) {
        alert("Invalid Quest ID");
        return;
        }
      try {
        console.log(`Registering quest with user ID: ${userId}, quest ID: ${questId}`);
        const txResponse = await usersContract.registerForQuest(userId, questId);
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

    const userQuestEventsContractAddress = "0xce6fcee19eA91fab8Db884D3f3F7dC05b70E4f84";
    const usersContractAddress = "0xF9F98Ee5e4fa000E6Bada4cA6F7fC97Cc2b9301e";
    const questEventsContractAddress = "0xeb6EEbb7bA7C56Cc76F0a84BE166Ff2148450266";
    const eventsContractAddress = "0x164155E567ee016DEe8F2c26785003c578eA919E";
    const questsContractAddress = "0xcbf7b6da410b8d3f77f9ba600eD9ED689C058a0e";

    async function initializeNewUsersContract() {
      console.log("initializeNewUsersContract");
      const usersABI = await fetchNewUsersABI(); // Fetch and assign the ABI
      const usersContract = new ethers.Contract(usersContractAddress, usersABI, signer);
      return usersContract;
      }

    async function fetchNewUsersABI() {
      let response = await fetch('Users.json');
      const data = await response.json();
      return data.abi; // Assuming the ABI is stored under the key 'abi'
    }

  });
