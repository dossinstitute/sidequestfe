document.addEventListener('DOMContentLoaded', async function () {
    (function () {
        'use strict';
        $('.hamburger-menu').click(function (e) {
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

  const usersContractAddress = "0x03DFc1e09395d5875eCF4DF432307BBE62b145bd";

    async function fetchUsersABI() {
        let response = await fetch('Users.json');
        const data = await response.json();
        return data.abi;
    }

    async function initializeUsersContract() {
        const usersABI = await fetchUsersABI();
        const usersContract = new ethers.Contract(usersContractAddress, usersABI, signer);
        return usersContract;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer;

    async function connectWallet() {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            signer = provider.getSigner();
        } catch (error) {
            console.error("User rejected request to connect wallet:", error);
        }
    }

    async function checkAndCreateUser() {
        await connectWallet();
        const usersContract = await initializeUsersContract();

        const userWallet = await signer.getAddress();
        try {
            const userId = await usersContract.getUserIdByWallet(userWallet);
            console.log(`User already exists with ID: ${userId}`);
        } catch (error) {
            if (error.data.message === "execution reverted: User does not exist") {
                console.log("User does not exist. Creating new user...");
                try {
                    const txResponse = await usersContract.createUser(userWallet, "defaultRole");
                    console.log(`User creation transaction hash: ${txResponse.hash}`);
                    await txResponse.wait();
                    console.log('User created successfully');
                    alert('User created successfully');
                } catch (createError) {
                    console.error('Error creating user:', createError);
                }
            } else {
                console.error('Error checking user existence:', error);
            }
        }
    }

    // Connect wallet and create user on page load
    await checkAndCreateUser();
});

