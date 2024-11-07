// components/Header.js
"use client"; // This directive makes the component a Client Component

import React from 'react';
import Image from 'next/image';

const Header = () => {
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
      <nav className="flex">
        <a href="/" className="text-white hover:text-yellow-400 mx-3">Home</a>
        <a href="/resources" className="text-white hover:text-yellow-400 mx-3">Resources</a>
        <a href="/blog" className="text-white hover:text-yellow-400 mx-3">Blog</a>
        <a href="/contact" className="text-white hover:text-yellow-400 mx-3">Contact</a>
      </nav>

      {/* Metamask Logo */}
      <Image src="/metamask-logo.png" alt="Metamask Logo" width={50} height={50} />
    </header>
  );
};

export default Header;

