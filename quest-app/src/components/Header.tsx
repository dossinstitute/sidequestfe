// components/Header.js
"use client"; // This directive makes the component a Client Component

import React, { useState } from 'react';
import Image from 'next/image';
import { ethers } from "ethers";

const Header = () => {
  // State to manage login status and user logo
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLogo, setUserLogo] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [showWalletOptions, setShowWalletOptions] = useState(false);

  // Handle MetaMask login
  const handleWalletLogin = async (walletType: 'metamask' | 'coinbase') => {
    try {
      let provider;
      
      if (walletType === 'metamask') {
        if (!window.ethereum) {
          alert("MetaMask is not installed. Please install it to log in.");
          return;
        }
        provider = new ethers.BrowserProvider(window.ethereum);
      } else if (walletType === 'coinbase') {
        if (!window.ethereum?.isCoinbaseWallet) {
          alert("Coinbase Wallet is not installed. Please install it to log in.");
          return;
        }
        provider = new ethers.BrowserProvider(window.ethereum);
      }

      const accounts = await provider!.send("eth_requestAccounts", []);
      const walletAddress = accounts[0];
      setWalletAddress(walletAddress);
      
      const userLogoUrl = walletType === 'metamask' ? '/metamask-logo.png' : '/coinbase-logo.png';
      setUserLogo(userLogoUrl);
      setIsLoggedIn(true);
      setShowWalletOptions(false);
    } catch (error) {
      console.error(`Error connecting to ${walletType} wallet:`, error);
    }
  };

  return (
    <header className="flex justify-between items-center p-6 bg-[#123B47]">
      {/* Logo and Badge */}
      <div className="flex items-center space-x-4">
        <Image src="/compass-logo.png" alt="Logo" width={50} height={50} />
        <span className="bg-yellow-400 text-black py-1 px-3 rounded-full font-bold">
          50
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex space-x-6">
        <a href="/" style={{ marginRight: '12px' }} className="text-white hover:text-yellow-400">Home</a>
        <a href="/resources" style={{ marginRight: '12px' }} className="text-white hover:text-yellow-400">Resources</a>
        <a href="/Admin" style={{ marginRight: '12px' }} className="text-white hover:text-yellow-400">Admin</a>
        <a href="/contact" style={{ marginRight: '12px' }} className="text-white hover:text-yellow-400">Contact</a>
      </nav>

      {/* Login Button or User Logo */}
      <div className="relative">
        {isLoggedIn ? (
          <Image src={userLogo} alt="User Logo" width={50} height={50} className="rounded-full" />
        ) : (
          <>
            <button
              onClick={() => setShowWalletOptions(!showWalletOptions)}
              className="bg-yellow-400 text-black py-2 px-4 rounded-lg font-bold hover:bg-yellow-500 flex items-center"
            >
              <img src="/walletlogo.png" width={20} height={20} alt="Wallet" className="mr-2" />
              Connect Wallet
            </button>
            
            {showWalletOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10">
                <button
                  onClick={() => handleWalletLogin('metamask')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-t-lg flex items-center"
                >
                  <img src="/metamask-logo.png" width={20} height={20} alt="MetaMask" className="mr-2" />
                  MetaMask
                </button>
                <button
                  onClick={() => handleWalletLogin('coinbase')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-b-lg flex items-center"
                >
                  <img src="/coinbase-logo.png" width={20} height={20} alt="Coinbase" className="mr-2" />
                  Coinbase Wallet
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

