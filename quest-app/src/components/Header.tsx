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

  // Handle MetaMask login
  const handleLogin = async () => {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        alert("MetaMask is not installed. Please install it to log in.");
        return;
      }

      // Request wallet connection
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      // Get the first account address
      const walletAddress = accounts[0];
      setWalletAddress(walletAddress);

      // Simulate fetching user profile logo (replace with your API logic)
      const userLogoUrl = `/metamask-logo.png`; // Replace with dynamic user logo from API
      setUserLogo(userLogoUrl);

      // Set login status to true
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
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
        <a href="/blog" style={{ marginRight: '12px' }} className="text-white hover:text-yellow-400">Blog</a>
        <a href="/contact" style={{ marginRight: '12px' }} className="text-white hover:text-yellow-400">Contact</a>
      </nav>

      {/* Login Button or User Logo */}
      <div>
        {isLoggedIn ? (
          <Image src={userLogo} alt="User Logo" width={50} height={50} className="rounded-full" />
        ) : (
          <button
            onClick={handleLogin}
            className="bg-yellow-400 text-black py-2 px-4 rounded-lg font-bold hover:bg-yellow-500"
          >
            <img src="/walletlogo.png"width={20} height={20}/>Connect & Sign-up
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;

