// components/Header.js
"use client"; // This directive makes the component a Client Component

import React from 'react';

const Header = () => {
  return (
    <header className="flex justify-between items-center p-6 bg-[#123B47]">
      <div className="flex items-center">
        <img src="/compass-logo.png" alt="Logo" className="w-10 h-10" />
        <span className="ml-4 bg-yellow-400 text-black py-2 px-4 rounded-full font-bold">50</span>
      </div>
      <nav className="flex space-x-6">
        <a href="/" className="text-white hover:text-yellow-400">Home</a>
        <a href="/resources" className="text-white hover:text-yellow-400">Resources</a>
        <a href="/blog" className="text-white hover:text-yellow-400">Blog</a>
        <a href="/contact" className="text-white hover:text-yellow-400">Contact</a>
      </nav>
      <img src="/metamask-logo.png" alt="MetaMask Logo" className="w-10 h-10" />
    </header>
  );
};

export default Header;
