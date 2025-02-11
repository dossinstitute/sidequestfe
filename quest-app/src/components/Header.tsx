// components/Header.js
"use client"; // This directive makes the component a Client Component

import React, { useState } from 'react';
import Image from 'next/image';
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <header className="
        flex justify-between items-center p-6 
        bg-[#123B47]/80 backdrop-blur-md
        shadow-lg
        w-full
      ">
        <div className="flex items-center space-x-4">
          <Image src="/compass-logo.png" alt="Logo" width={50} height={50} />
          <span className="bg-yellow-400 text-black py-1 px-3 rounded-full font-bold">
            50
          </span>
        </div>

        <nav className="flex items-center">
          <a href="/" style={{ marginRight: '12px' }} className="text-white hover:text-yellow-400">Home</a>
          <a href="/resources" style={{ marginRight: '12px' }} className="text-white hover:text-yellow-400">Resources</a>
          <a href="/Admin" style={{ marginRight: '12px' }} className="text-white hover:text-yellow-400">Admin</a>
          <a href="/contact" style={{ marginRight: '12px' }} className="text-white hover:text-yellow-400">Contact</a>
        </nav>

        <div className="relative">
          <ConnectButton />
        </div>
      </header>
    </div>
  );
};

export default Header;

