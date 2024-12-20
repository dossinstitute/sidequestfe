// components/Header.js
"use client"; // This directive makes the component a Client Component

import React, { useState } from 'react';
import Image from 'next/image';

const Header = () => {
  // State to manage login status and user logo
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLogo, setUserLogo] = useState("");

  // Simulate login process
  const handleLogin = () => {
    // Simulate user logo selection (replace with actual login logic later)
    const chosenLogo = "/metamask-logo.png"; // Example user logo
    setUserLogo(chosenLogo);
    setIsLoggedIn(true);
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
        <a href="/resources" style={{ marginRight: '12px' }} className="text-white hover:text-yellow-400 mx-3 !mx-3">Resources</a>
        <a href="/blog" style={{ marginRight: '12px' }} className="text-white hover:text-yellow-400 mx-3 !mx-3">Blog</a>
        <a href="/contact" style={{ marginRight: '12px' }} className="text-white hover:text-yellow-400 mx-3 !mx-3">Contact</a>
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
            Connect & Sign-up
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;

